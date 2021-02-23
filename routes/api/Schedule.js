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
 * Converts a time string (e.g. 9:00) to Minutes
 * @param {string} time 
 */
function timeToMinutes(time) {
  let timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  let hour = parseInt(arr[1]);
  let minutes = parseInt(arr[2]);

  let hourToMinutes = hour * 60;

  return hourToMinutes + minutes;
}

/**
 * Generates a random time slot for the activity
 * @param {*} startTime 
 * @param {*} endTime 
 * @param {*} duration 
 */
function randomTimeGenerator(startTime, endTime, duration) {
  var startDate = new Date();
  var endDate =  new Date();
  startDate.setHours(parseHourFromTime(startTime));
  startDate.setMinutes(parseMinuteFromTime(startTime));
  endDate.setHours(parseHourFromTime(endTime));
  endDate.setMinutes(parseMinuteFromTime(endTime));
  console.log(startDate.getHours());
  console.log(endDate.getHours());
  var spaces = (endDate - startDate);
  console.log(spaces);
  var timestamp = Math.round(Math.random() * spaces);
  console.log(timestamp);
  timestamp += startDate;
  console.log(timestamp);
  return new Date(timestamp);
}

/**
 * Determines if duration fits within an interval
 * @param {string} startTime 
 * @param {string} endTime
 * @param {string} duration
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

  // loop through list of activities
  for (let i = 0; i < schedule.length; i++) {
    console.log(schedule[i]);
    let duration = parseInt(schedule[i].duration);

    // loop through list of timeIntervals
    for (let j = 0; j < timeIntervals.length; j++) {
      let timeInterval = timeIntervals[j]
      let startTime = timeInterval[0];
      let endTime = timeInterval[1];

      if (withinInterval(startTime, endTime, duration)) {
        // generate a random time block within that interval
        let timeSlot = randomTimeGenerator(startTime, endTime, duration);
        console.log('generated time slot' + timeSlot);
      }
    }

  }

  


}

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
        .then(updatedSched => res.json(updatedSched.schedule))
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
        .then(schedule => res.json(schedule.schedule))
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
      res.status(200).json(schedule.schedule);
    } else {
      res.status(404).json("No schedule");
    }
  })
})

module.exports = router;
