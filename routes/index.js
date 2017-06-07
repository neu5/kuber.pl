var express = require('express');
var moment = require('moment');
var data = require('../data.json');

var router = express.Router();

function getMonths() {
  const currentYear = moment().year().toString();

  return Array.apply(null, {length: 12}).map(Number.call, Number)
    .map(idx => {
      const month = ++idx;

      return {
        days: moment(`${currentYear}-${month.toString()}`, 'YYYY-MM').daysInMonth()
      };
    });
}

const months = getMonths();

router.get('/', function(req, res, next) {
  res.render('index', { 
    now: moment().format('DD-MM-YYYY'),
    months: months
  });
});

module.exports = router;
