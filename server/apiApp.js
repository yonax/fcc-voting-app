const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

app.set('views', path.resolve(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator()); 
app.use(passport.initialize());

app.use('/api', require('./api'));

module.exports = app;