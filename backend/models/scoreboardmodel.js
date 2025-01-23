const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreboardSchema = new Schema({
  eventName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  studentNames: {
    type: [String], // Array of student names
    required: true
  },
  classNames: {
    type: [mongoose.Schema.Types.ObjectId], // Array of class IDs for each student
    ref: 'Class', // Reference to the Class model
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  departmentname: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Department model
    ref: 'DepartmentDetails',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  lastUpdated: { type: Date, default: Date.now } // Automatically tracks the last update time
});

const Scoreboard = mongoose.model('Scoreboard', scoreboardSchema);
module.exports = Scoreboard;