const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  activity: {
    type: String,
  },
  duration: {
    type: String
  },
});

const ScheduleSchema = new Schema({
  activities: [ActivitySchema],
  /*
  schedule: [{
    activity: String,
    time: String,
  }],
  */
  schedule: [ActivitySchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = Schedule = mongoose.model("Schedule", ScheduleSchema);
