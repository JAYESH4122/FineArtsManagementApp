const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DeptRepSchema = new Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true, },
    name : {type : String, required : true},
    departmentname : {type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentDetails', required: true, unique: true }

})

const DeptRep = mongoose.model('DeptRepDetails', DeptRepSchema)
module.exports = DeptRep;