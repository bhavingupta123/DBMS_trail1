const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    
    otp :Number,
    id :Number,
    email :String
});

module.exports = mongoose.model('otpv',UserSchema,'otp_datas');