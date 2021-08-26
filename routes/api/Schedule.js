const express = require("express");
const router = express.Router();
require('dotenv').config();

const helperFuncs = require('./helperFunctions');

const Schedule = require("../../models/Activity");

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
          schedule.schedule[i]['duration'] = helperFuncs.convertToHHMM(activity['activity']['startDate'], activity['activity']['endDate']);
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
      schedule.schedule = helperFuncs.calculateSchedule(activities);
      schedule
        .save()
        .then(updatedSched => res.json(updatedSched))
        .catch(err => {
          console.log(err);
          res.status(500).json("Error updating schedule");
        });
    } else {
      // calculation of available schedule before saving
      const scheduleCalc = helperFuncs.calculateSchedule(activities);
      const newSchedule = new Schedule({
        activities: activities,
        schedule: scheduleCalc,
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

router.post('/resetSchedule', (req, res) => {
  const uid = req.body.uid;
  Schedule.findOne({ user: uid }).then(schedule => {
    if (schedule) {
      // Init to empty
      const emptyActivity = {
        "activity": '',
        "duration": '',
      }
      // need to push empty activity to init activity form
      schedule.activities = [];
      schedule.activities.push(emptyActivity);
      schedule.schedule = [];
      schedule
        .save()
        .then(updatedSched => res.json(updatedSched))
        .catch(err => {
          console.log(err);
          res.status(500).json("Error updating schedule");
        });
    } else {
      const emptyActivity = {
        "activity": '',
        "duration": '',
      }
      const activityList = [];
      activityList.push(emptyActivity);
      const newSchedule = new Schedule({
        activities: activityList,
        schedule: [],
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
})

module.exports = router;
