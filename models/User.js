const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  date: {
    type: Date,
    default: Date.now
  },
});
module.exports = User = mongoose.model("User", UserSchema);