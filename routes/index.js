const express = require('express');
const moment = require('moment');
const data = require('../data.json');

const router = express.Router();

const m = moment();
const year = m.year();

const months = [
  { daysNum: 31 },
  { daysNum: m.isLeapYear() ? 29 : 28 },
  { daysNum: 31 },
  { daysNum: 30 },
  { daysNum: 31 },
  { daysNum: 30 },
  { daysNum: 31 },
  { daysNum: 31 },
  { daysNum: 30 },
  { daysNum: 31 },
  { daysNum: 30 },
  { daysNum: 31 }
];

function isToday(today) {
  return moment(today, 'YYYY-MM-DD').isSame(m, 'day') ? 'day--today' : '';
}

function getDay(i, firstDayOfMonth, shiftedDay, daysNum) {
  return i >= firstDayOfMonth && shiftedDay <= daysNum ? shiftedDay.toString() : '';
}

function getMonthGrid(month, monthNum, daysToRender = 7, weeksToRender = 6) {
  const grid = [];
  const daysNum = month.daysNum;
  const firstDayOfMonth = moment([year, monthNum]).format('E');
  
  let day = '';
  let i = 1;

  for (let col = 0; col < weeksToRender; col++) {
    for (let row = 0; row < daysToRender; row++) {
      let shiftedDay = i - firstDayOfMonth + 1;
      let day = getDay(i, firstDayOfMonth, shiftedDay, daysNum);

      grid.push({
        day,
        className: (row > 4 ? 'day--weekend' : '') + ' ' + isToday(`${year}-${monthNum + 1}-${day}`)
      });

      i++;
    }
  }

  return grid;
}

function getDays(months) {
  return months.map((month, idx) => {
    return Object.assign(month, {
      name: moment.months()[idx],
      days: getMonthGrid(month, idx)
    });
  });
}

const days = getDays(months);

router.get('/', function(req, res) {
  res.render('index', { 
    today: m.format('DD-MM-YYYY'),
    months: months,
  });
});

module.exports = router;
