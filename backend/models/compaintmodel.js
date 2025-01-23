const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentDetails', required: true,},

  department: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentDetails', required: true,},
  
  subject: { type: String, required: true },

  complaintText: { type: String, required: true, },

  reply: { type: String, default: null, },// No reply by default

  createdAt: { type: Date, default: Date.now,  },// Timestamp when the complaint is created
 
  repliedAt: { type: Date, default: null, },// Updated only when replied
});

module.exports = mongoose.model('Complaint', complaintSchema);
