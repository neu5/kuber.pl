if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const bluebird = require('bluebird')
const redis = require('redis')
const contentful = require('contentful')

const router = express.Router()

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const redisClient = redis.createClient(process.env.REDIS_URL)

const client = contentful.createClient({
  space: process.env.SPACE,
  accessToken: process.env.ACCESS_TOKEN
})

function fetchData (req, res, next) {
  // @todo: make proper error handling
  client.getEntries()
    .then(data => {
      const dataToSend = data.items.map(item => {
        return item.fields
      })

      redisClient.flushall()

      bluebird.all(dataToSend.map(entry => {
        return redisClient.setAsync(entry.date, entry.type)
      }))
      .then(() => {
        next()
      })
    })
    .catch(err => console.log(err))
}

router.use(fetchData)

router.post('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router