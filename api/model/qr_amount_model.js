const mongoose = require('mongoose');

const qrAmountSchema = mongoose.Schema({
    userId: {type: String, require: true},
    amount: {type: String, require: true},
}, {
    timestamps: true,
});

module.exports = mongoose.model('qramount', qrAmountSchema);