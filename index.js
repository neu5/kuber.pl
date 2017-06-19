const express = require('express');
const app = express();

const index = require('./routes/index');
const updateRedis = require('./routes/updateRedis');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/', index);
app.use('/update-redis', updateRedis);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
