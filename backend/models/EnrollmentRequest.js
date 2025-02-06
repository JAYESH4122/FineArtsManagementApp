const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentRequestSchema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails', required: true },
  participants: [
    {
      name: { type: String, required: true },
      admno: { type: String, required: true }, // Ensure admission number is stored
      className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
      attended: { type: Boolean, default: false }, // New field to store attendance
    },
  ],
  participantHash: { type: String, required: true, unique: true }, // Enforce uniqueness
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentDetails', required: true },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);