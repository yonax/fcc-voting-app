'use strict';

const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

module.exports = {
  User: require('./User'),
  Poll: require('./Poll')
};