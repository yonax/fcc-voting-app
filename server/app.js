const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler')
const expressValidator = require('express-validator');

const path = require('path');

const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const die = require('./utils').die;

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || die('SESSION_SECRET not specified');
const DATABASE_URL =  process.env.DATABASE_URL || die('DATABASE_URL not specified');

app.set('views', path.resolve(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
 customValidators: {
    isArray: function(value) {
        return Array.isArray(value);
    }
 }
})); 
app.use(cookieParser());
app.use(require('express-session')({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(require('flash')());
app.use('/static', express.static(path.resolve(__dirname, '..', 'static')));

const User = require('./User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);
app.use('/', require('./routes'));

if (NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}

module.exports = app;