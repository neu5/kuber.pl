const express = require('express');
const moment = require('moment');

require('dotenv').config();

const contentful = require('contentful');
const router = express.Router();

const client = contentful.createClient({
  space: process.env.SPACE,
  accessToken: process.env.ACCESS_TOKEN
});

const m = moment();
const YEAR = m.year();

let data = [];

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

function setData(newData) {
  return data = newData;
}

function isSameDay(oneDay, secondDay) {
  return moment(oneDay, 'YYYY-MM-DD').isSame(secondDay, 'd');
}

function getDay(i, firstDayOfMonth, shiftedDay, daysNum) {
  return i >= firstDayOfMonth && shiftedDay <= daysNum ? shiftedDay.toString() : '';
}

function getClassNames(row, monthNum, day) {
  const currentDay = `${YEAR}-${monthNum + 1}-${day}`;
  let classNames = '';

  if (row > 4) {
    classNames += 'color__weekend';
  }
  // check for today
  if (isSameDay(`${YEAR}-${monthNum + 1}-${day}`, m)) {
    classNames += ' color__today';
  }

  // check for days taken from external source
  data.forEach(dataDay => {
    if (!isSameDay(currentDay, moment(dataDay.date, 'YYYY-MM-DD'))) {
      return;
    }

    switch (dataDay.type) {
      case 'maybe':
        classNames += ' color__maybe';
        break;
      case 'available':
        classNames += ' color__available';
        break;
      case 'full':
        classNames += ' color__full';
        break; 
    }
  });

  return classNames;
}

function getMonthGrid(month, monthNum, daysToRender = 7, weeksToRender = 6) {
  const grid = [];
  const daysNum = month.daysNum;
  const firstDayOfMonth = moment([YEAR, monthNum]).format('E');
  
  let day = '';
  let i = 1;

  for (let col = 0; col < weeksToRender; col++) {
    for (let row = 0; row < daysToRender; row++) {
      let shiftedDay = i - firstDayOfMonth + 1;
      let day = getDay(i, firstDayOfMonth, shiftedDay, daysNum);

      grid.push({
        day,
        className: day === '' ? '' : getClassNames(row, monthNum, day)
      });

      i++;
    }
  }

  return grid;
}

function getCalendar() {
  return months.map((month, idx) => {
    return Object.assign(month, {
      name: moment.months()[idx],
      days: getMonthGrid(month, idx)
    });
  });
}

function fetchData (req, res, next) {
  client.getEntries()
    .then(data => {
      setData(data.items.map(item => item.fields));
      req.calendar = getCalendar();

      next();
    })
    .catch(err => console.log(err));
}

router.use(fetchData)

router.get('/', function(req, res) {
  res.render('index', { 
    today: m.format('DD-MM-YYYY'),
    calendar: req.calendar
  });
});

module.exports = router;
