const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  studentName: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentDetails', required: true },
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;