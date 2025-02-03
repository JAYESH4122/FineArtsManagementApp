const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    departmentname: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentDetails', required: true },
    className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    rollno: { type: String },
    admno: { type: String, unique: true, required: true },
    phno: { type: String },
    gmail: { type: String}, // Added Gmail field
});

const Student = mongoose.model('StudentDetails', StudentSchema);
module.exports = Student;