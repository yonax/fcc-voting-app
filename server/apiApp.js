const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const passport = require('passport');

const die = require('./utils').die;

const app = express();
const DATABASE_URL =  process.env.DATABASE_URL || die('DATABASE_URL not specified');

app.set('views', path.resolve(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator()); 
app.use(passport.initialize());

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);
app.use('/api', require('./api'));

module.exports = app;