const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventname : {type : String, required : true, unique : true},
    date : {type : Date, required : true},
    category : {type : String, required : true},
    participants : {type : Number, required : true},
    description : {type : String},
    stage: {
        type: String,
        enum: ["onstage", "offstage"],
        required: true
      }
    }, { timestamps: true });

const Event = mongoose.model('EventDetails', EventSchema)
module.exports = Event;