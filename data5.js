const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    id :Number,
    email :String,
    otp : Number,
});

module.exports =mongoose.model('otpp',UserSchema);
