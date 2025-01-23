const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    className: { type: String, required: true },
});

const Class = mongoose.model('Class', ClassSchema);
module.exports = Class;
