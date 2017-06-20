if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const redis = require('redis')

const router = express.Router()

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const redisClient = redis.createClient(process.env.REDIS_URL)

function setEntry (req, res, next) {
  // @todo: add proper validation and error handling
  if (!req.body) return res.sendStatus(400)

  const fields = req.body.fields

  redisClient
    .setAsync(fields.date['en-US'], fields.type['en-US'])
    .then(() => {
      next()
    })
    .catch(err => console.log(err))
}

router.use(bodyParser.json())
router.use(setEntry)

router.post('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router
