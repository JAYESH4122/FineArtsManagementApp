const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Assuming 'DepartmentDetails' schema has an array of 'classes' as you mentioned
const StudentSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    departmentname: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentDetails', required: true },
    className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }, // Referring to the 'Class' model now
    rollno: { type: String },
    admno: { type: String, unique: true, required: true },
    phno: { type: String }
});

const Student = mongoose.model('StudentDetails', StudentSchema);
module.exports = Student;
