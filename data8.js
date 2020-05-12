const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    forgot_otp:String
});

module.exports =mongoose.model('forgot_otp',UserSchema,'forgot_otp');