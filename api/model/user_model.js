const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {type: String, require: true},
    mobileNumber: {type: String, require: true},
    email: {type: String},
    userType: {type: String, require: true},
    password: {type: String, require: true},
    image: {type: String},
}, {
    timestamps: true,
});

module.exports = mongoose.model('user', userSchema);