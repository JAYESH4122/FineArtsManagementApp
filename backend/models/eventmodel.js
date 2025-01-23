const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventname : {type : String, required : true, unique : true},
    date : {type : Date, required : true},
    category : {type : String, required : true},
    participants : {type : Number, required : true},
    description : {type : String},
})

const Event = mongoose.model('EventDetails', EventSchema)
module.exports = Event;