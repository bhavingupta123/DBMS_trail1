const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:String,
    password1:String,
    party:String,
    id :Number,
    date1 :String,
    gender : String,
});

module.exports =mongoose.model('candidate',UserSchema,'candidate_data');