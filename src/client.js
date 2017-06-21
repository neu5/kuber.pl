if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const bluebird = require('bluebird')
const redis = require('redis')
const contentful = require('contentful')
const { CONTENTFUL_HOST_DELIVERY, CONTENTFUL_HOST_PREVIEW } = require('src/const')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

function getContentfulConfig (accessToken, host) {
  const config = {
    space: process.env.SPACE,
    accessToken,
    host
  }

  return config
}

module.exports = {
  'redis': redis.createClient(process.env.REDIS_URL),
  'contentful': contentful.createClient(getContentfulConfig(process.env.ACCESS_TOKEN, CONTENTFUL_HOST_DELIVERY)),
  'contentfulPreview': contentful.createClient(getContentfulConfig(process.env.PREVIEW_TOKEN, CONTENTFUL_HOST_PREVIEW))
}
