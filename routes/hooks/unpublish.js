const express = require('express')
const bodyParser = require('body-parser')
const { redis, contentfulPreview } = require('src/client')
const { CONTENTFUL_CONTENT_TYPE } = require('src/const')

const router = express.Router()

function deleteEntry (req, res, next) {
  // @todo: add proper validation and error handling
  if (!req.body) return res.sendStatus(400)

  contentfulPreview.getEntry(req.body.sys.id)
    .then(entry => {
      redis.delAsync(entry.fields.date)
        .then(() => {
          next()
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

router.use(bodyParser.json({type: CONTENTFUL_CONTENT_TYPE}))
router.use(deleteEntry)

router.post('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router
