const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email:String,
    password1:String
});

module.exports =mongoose.model('admin',UserSchema,'admin');