const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for each winning position
const WinnerSchema = new Schema({
  studentNames: {
    type: [String], // Array of student names for this winning team/position
    required: true
  },
  classNames: {
    type: [mongoose.Schema.Types.ObjectId], // Array of class IDs for each student
    ref: 'Class',
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
    required: true
  },
  category: {
    type: String,
    required: true
  },
  winners: {
    first: {
      type: WinnerSchema,
      required: true
    },
    second: {
      type: WinnerSchema,
      required: true
    },
    third: {
      type: WinnerSchema,
      required: true
    }
  },
  departmentname: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Department model
    ref: 'DepartmentDetails',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now // Automatically tracks the last update time
  }
});

const Scoreboard = mongoose.model('Scoreboard', scoreboardSchema);
module.exports = Scoreboard;
