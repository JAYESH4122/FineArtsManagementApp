const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentRequestSchema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails', required: true },
  participants: [
    {
      name: { type: String, required: true },
      className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    },
  ],
  participantHash: { type: String, required: true }, // Unique identifier for the group
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentDetails', required: true },
  requestedAt: { type: Date, default: Date.now }, // Use default Date.now to store UTC time
});

module.exports = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);
