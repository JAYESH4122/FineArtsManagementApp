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
    required: true
  },
  category: {
    type: String,
    required: true
  },
  winners: {
    first: { type: WinnerSchema, required: true },
    second: { type: WinnerSchema, required: true },
    third: { type: WinnerSchema, required: true }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});
<<<<<<< HEAD


=======
>>>>>>> 1b9cb52f3bb6f90acd5e15ab6bfe4880b85c3e51
const Scoreboard = mongoose.model('Scoreboard', scoreboardSchema);
module.exports = Scoreboard;
