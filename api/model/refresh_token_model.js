const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("usertoken", RefreshTokenSchema);
