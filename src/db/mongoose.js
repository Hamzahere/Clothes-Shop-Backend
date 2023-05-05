const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();



mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

