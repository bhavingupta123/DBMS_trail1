const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    party:String,
    votes:Number
    
});

module.exports =mongoose.model('total',UserSchema,'votes_data');