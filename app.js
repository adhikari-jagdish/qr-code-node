const express = require("express");
const Cors = require("cors");
const logger = require('morgan');
require('dotenv').config();
const userRoutes = require('./api/routes/user_route');
const qrAmountRoutes = require('./api/routes/qr_amount_route');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(Cors());

mongoose.connect(process.env.MONGO_URL_ATLAS, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

app.use('/api', userRoutes);
app.use('/api', qrAmountRoutes);
app.use(logger('dev'));
module.exports = app;