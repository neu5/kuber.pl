const express = require('express')
const bodyParser = require('body-parser')
const { CONTENTFUL_CONTENT_TYPE } = require('src/const')

const router = express.Router()

const { redis } = require('src/client')

function setEntry (req, res, next) {
  // @todo: add proper validation and error handling
  if (!req.body) return res.sendStatus(400)

  const { date, type } = req.body.fields

  redis
    .setAsync(date['en-US'], type['en-US'])
    .then(() => {
      next()
    })
    .catch(err => console.log(err))
}

router.use(bodyParser.json({type: CONTENTFUL_CONTENT_TYPE}))
router.use(setEntry)

router.post('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router
