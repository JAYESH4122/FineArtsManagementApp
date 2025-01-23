const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Registration Schema
const registrationSchema = new Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventDetails',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    participants: {
        type: Number,
        required: true,
        default: 1
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DepartmentDetails',
        required: true
    },
    students: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentDetails', required: true },
            className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
        }
    ],
    teamName: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
