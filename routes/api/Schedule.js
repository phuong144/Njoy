const express = require("express");
const router = express.Router();
require('dotenv').config();

// Load User model
// const User = require("../../models/User");
const Schedule = require("../../models/Activity");

// MATT: there is duplicated code in next 3 functions, refactor later

function parseHourFromTime(time) {
  let timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  return parseInt(arr[1]);
}

function parseMinuteFromTime(time) {
  let timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  return parseInt(arr[2]);
}

/**
 * Converts a time string (e.g. '9:00') to Minutes
 * @param {string} time hh:mm
 */
function timeToMinutes(time) {
  const timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  let hour = parseInt(arr[1]);
  let minutes = parseInt(arr[2]);

  let hourToMinutes = hour * 60;

  return hourToMinutes + minutes;
}

/**
 * Generates a random time slot for the activity
 * @param {*} startTime hh:mm
 * @param {*} endTime hh:mm
 * @param {*} duration number string
 */
function randomTimeGenerator(startTime, endTime, duration) {
  var startDate = new Date();
  var endDate =  new Date();

  startDate.setHours(parseHourFromTime(startTime));
  startDate.setMinutes(parseMinuteFromTime(startTime));
  endDate.setHours(parseHourFromTime(endTime));
  endDate.setMinutes(parseMinuteFromTime(endTime));

  var spaces = (endDate.getTime() - startDate.getTime());
  var timestamp = Math.round(Math.random() * spaces);
  timestamp += startDate.getTime();
  const randomDate = new Date(timestamp);
  return formatDate(randomDate, duration);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

function subtractMinutes(date, minutes) {
  return new Date(date.getTime() - minutes*60000);
}

function formatTime(time) {
  // time is a number
  // can be hour || minutes
  if (time < 10) {
    return '0'+time; 
  } else {
    return ''+time;
  }
}

function formatDate(date, duration) {
  const hour = formatTime(date.getHours());
  const minutes = formatTime(date.getMinutes());

  const endDate = addMinutes(date, parseInt(duration));
  const hour2 = formatTime(endDate.getHours());
  const min2 = formatTime(endDate.getMinutes());
  let startDateString = String('T'+hour+':'+minutes);
  let endDateString = String('T'+hour2+':'+min2);
  const finalFormat = startDateString+'-'+endDateString;
  console.log(finalFormat);
  return finalFormat;
}

/**
 * 
 * @param {*} date String start date from drag and drop
 * @param {*} date2 String end date from drag and drop
 * @return {string} String format to save
 */
function convertToHHMM(date, date2) {
  let startDate = new Date(date);
  let endDate = new Date(date2);
  const hour = formatTime(startDate.getHours());
  const minutes = formatTime(startDate.getMinutes());
  const hour2 = formatTime(endDate.getHours());
  const min2 = formatTime(endDate.getMinutes());
  let startDateString = String('T'+hour+':'+minutes);
  let endDateString = String('T'+hour2+':'+min2);
  const finalFormat = startDateString+'-'+endDateString;
  console.log(finalFormat);
  return finalFormat;
}

/**
 * Determines if duration fits within an interval
 * @param {string} startTime hh:mm
 * @param {string} endTime hh:mm
 * @param {string} duration number string
 * @returns {boolean}
 */
function withinInterval(startTime, endTime, duration) {
  let time1 = timeToMinutes(startTime);
  let time2 = timeToMinutes(endTime);

  let intervalLength = time2 - time1;

  if (duration <= intervalLength) {
    console.log("duration fits in interval");

    return true;
  }
  else {
    return false;
  }
}

/**
 * 
 * @param {*} schedule list of objects [{activity:'', duration:''}]
 */
function calculateSchedule(schedule) {
  let timeIntervals = [['09:00', '23:59']];
  const finalSchedule = [];
  // loop through list of activities
  for (let i = 0; i < schedule.length; i++) {
    console.log(schedule[i]);
    // Parse for duration to work with
    const duration = parseInt(schedule[i].duration);

    // For each timeInterval, check if duration fits
    for (let j = 0; j < timeIntervals.length; j++) {
      let timeInterval = timeIntervals[j];
      let startTime = timeInterval[0];
      let endTime = timeInterval[1];
      const endTimeOrig = endTime;

      if (withinInterval(startTime, endTime, duration)) {
        // generate a random time block within that interval
        let date = new Date();
        let hour = parseHourFromTime(endTime);
        let minutes = parseMinuteFromTime(endTime);
        date.setHours(hour);
        date.setMinutes(minutes);
        

        let endTime2 = subtractMinutes(date, duration);
        // 'hh:mm'

        hour = formatTime(endTime2.getHours());
        minutes = formatTime(endTime2.getMinutes());

        endTime = hour+':'+minutes;
        console.log("Subtract d from 24: "+endTime2);
        console.log("String rep: " +endTime);
        let timeSlot = randomTimeGenerator(startTime, endTime, duration);
        console.log('generated time slot' + timeSlot);
        finalSchedule.push({
          activity: schedule[i].activity,
          duration: timeSlot
        })

        // timeSLot - 'T18:55-T19:25'
        const timeParse = timeSlot.split('-');
        const time1 = timeParse[0].split('T')[1];
        const time2 = timeParse[1].split('T')[1];
        timeIntervals[j][1] = time1;

        // split interval
        timeIntervals.push([time2, endTimeOrig ]);
        
        console.log(timeIntervals);
        break;
      }
    }

  }

 console.log(finalSchedule) 
 return finalSchedule;

}

router.post("/setSchedule", (req, res) => {
  // req.body.id = users id
  // req.body.changedActivity = {'activity' : {'startDate':'', 'endDate':'', 'title':''}}
  const uid = req.body.id;
  const activity = req.body.changedActivity;
  Schedule.findOne({ user: uid }).then(schedule => {
    if (schedule) {
      // Loop through schedule and find activity to update
      for (let i=0; i<schedule.schedule.length; i++) {
        // if activity name in db == activity name sent in req
        if (schedule.schedule[i]['activity'] == activity['activity']['title']) {
          schedule.schedule[i]['duration'] = convertToHHMM(activity['activity']['startDate'], activity['activity']['endDate']);
          break;
        }
      }
      schedule
        .save()
        .then(updatedSched => res.json(updatedSched))
        .catch(err => {
          console.log(err);
          res.status(500).json("Error updating schedule");
        });
    } else {
      res.status(500).json("No schedule to set new activity");
    }
  })
});

router.post("/generate", (req, res) => {
  // req.body.id = users id
  // req.body.activities = [{activity: "", duration: ""}]
  const uid = req.body.id;
  const activities = req.body.activities;
  Schedule.findOne({ user: uid }).then(schedule => {
    if (schedule) {
      // if schedule found, add onto existing activites and schedule
      schedule.activities = activities;

      // set schedule.schedule to calculated available schedule
      schedule.schedule = calculateSchedule(activities);
      schedule
        .save()
        .then(updatedSched => res.json(updatedSched))
        .catch(err => {
          console.log(err);
          res.status(500).json("Error updating schedule");
        });
    } else {
      // calculation of available schedule before saving

      const newSchedule = new Schedule({
        activities: activities,
        schedule: activities,
        user: uid,
      });
      newSchedule
        .save()
        .then(schedule => res.json(schedule))
        .catch(err => {
          console.log(err);
          res.status(500).json("Error saving schedule");
        });
    }
  })
});

router.get('/getSchedule', (req, res) => {
  const uid = req.query.uid;
  Schedule.findOne({ user: uid }).then(schedule => {
    if (schedule) {
      // if schedule found, return schedule
      res.status(200).json(schedule);
    } else {
      res.status(404).json("No schedule");
    }
  })
})

module.exports = router;
