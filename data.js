const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:String,
    password1:String,
    address:String,
    id :Number,
    date1 :String,
    gender : String,
    vote :Number
});

module.exports =mongoose.model('all',UserSchema);
