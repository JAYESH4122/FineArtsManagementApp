const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  audience: { 
    type: String, 
    enum: ['all', 'students', 'departmentReps'], 
    required: true 
  },
  datePosted: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('AnnouncementDetails', AnnouncementSchema);
module.exports = Announcement;

