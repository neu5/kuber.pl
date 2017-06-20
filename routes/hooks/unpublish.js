if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const redis = require('redis')
const contentful = require('contentful')

const router = express.Router()

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const redisClient = redis.createClient(process.env.REDIS_URL)

const client = contentful.createClient({
  space: process.env.SPACE,
  accessToken: process.env.PREVIEW_TOKEN,
  host: 'preview.contentful.com'
})

function deleteEntry (req, res, next) {
  // @todo: add proper validation and error handling
  if (!req.body) return res.sendStatus(400)

  client.getEntry(req.body.sys.id)
    .then(entry => {
      redisClient.delAsync(entry.fields.date)
        .then(() => {
          next()
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

router.use(bodyParser.json())
router.use(deleteEntry)

router.post('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router
