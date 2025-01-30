const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    departmentname: { type: String, required: true, unique: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

const Department = mongoose.model('DepartmentDetails', DepartmentSchema);
module.exports = Department;


