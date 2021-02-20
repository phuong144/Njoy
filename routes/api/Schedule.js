const express = require("express");
const router = express.Router();
require('dotenv').config();

// Load User model
// const User = require("../../models/User");
const Schedule = require("../../models/Activity");

/**
 * 
 * @param {*} schedule list of objects [{activity:'', duration:''}]
 */
function calculateSchedule(schedule) {
  
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
      schedule.schedule = activities;
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
