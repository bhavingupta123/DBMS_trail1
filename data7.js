const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    day1:Number,
    mon1:Number,
    year1:Number,
    day2:Number,
    mon2:Number,
    year2:Number
});

module.exports =mongoose.model('dates',UserSchema,'dates1');