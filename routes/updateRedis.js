if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express');
const bluebird = require('bluebird');
const redis = require('redis');
const contentful = require('contentful');

const router = express.Router();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(process.env.REDIS_URL);

const client = contentful.createClient({
  space: process.env.SPACE,
  accessToken: process.env.ACCESS_TOKEN
});

function fetchData (req, res, next) {
  client.getEntries()
    .then(data => {
      const dataToSend = data.items.map(item => {
          return item.fields;
      });

      redisClient.flushall();
      
      dataToSend.forEach(entry => {
          redisClient.set(entry.date, entry.type);
      });

      next();
    })
    .catch(err => console.log(err));
}

router.use(fetchData);

router.post('/', function(req, res) {
    res.send('ok');
});

module.exports = router;
