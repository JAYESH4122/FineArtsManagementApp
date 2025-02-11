const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for each winning position
const WinnerSchema = new Schema({
  studentNames: {
    type: [String], // Array of student names
    required: true
  },
  classNames: {
    type: [mongoose.Schema.Types.ObjectId], // Array of class IDs
    ref: 'Class',
    required: true
  },
  departmentNames: {
    type: [mongoose.Schema.Types.ObjectId], // Store department ID per student
    ref: 'DepartmentDetails',
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  }
});
// Main scoreboard schema with nested winners
const scoreboardSchema = new Schema({
  eventName: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  winners: {
    first: { type: WinnerSchema, required: false },
    second: { type: WinnerSchema, required: false },
    third: { type: WinnerSchema, required: false }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});
const Scoreboard = mongoose.model('Scoreboard', scoreboardSchema);
module.exports = Scoreboard;
