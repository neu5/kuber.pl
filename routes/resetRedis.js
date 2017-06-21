const express = require('express')
const bluebird = require('bluebird')
const router = express.Router()

const { redis, contentful } = require('src/client')

function fetchData (req, res, next) {
  // @todo: make proper error handling
  contentful.getEntries()
    .then(data => {
      const dataToSend = data.items.map(item => {
        return item.fields
      })

      redis.flushall()

      bluebird.all(dataToSend.map(entry => {
        return redis.setAsync(entry.date, entry.type)
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
