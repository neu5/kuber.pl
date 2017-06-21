const path = require('path')
const express = require('express')
const fs = require('fs')
const ejs = require('ejs')
const app = express()

const index = require('./routes/index')
const hookPublish = require('./routes/hooks/publish')
const hookUnpublish = require('./routes/hooks/unpublish')
const resetRedis = require('./routes/resetRedis')

app.set('port', (process.env.PORT || 3000))

app.use(express.static(path.join(__dirname, '/public')))

// views is directory for all template files
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use('/', index)
app.use('/hook/publish', hookPublish)
app.use('/hook/unpublish', hookUnpublish)
app.use('/reset-redis', resetRedis)

const html = ejs.render(fs.readFileSync(path.join('views/pages', 'index.ejs'), 'utf-8'), {
  today: '123',
  calendar: []
}, {
  filename: path.join('views/pages', 'index.ejs')
})
console.log(html)

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
