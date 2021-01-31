const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  activity: {
    type: String,
  },
  time: {
    type: String
  },
});

const ScheduleSchema = new Schema({
  uid: {
    type: ObjectId,
    required: true,
  },
  activities: [ActivitySchema],
  schedule: [{
    activity: String,
    time: String,
  }],
});

module.exports = Schedule = mongoose.model("Schedule", ScheduleSchema);
