'use strict';

const mongoose = require('mongoose');
const config = require('../../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUrl);

module.exports = {
  User: require('./User'),
  Poll: require('./Poll')
};