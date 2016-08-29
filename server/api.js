const mongoose = require('mongoose');
const User = require('./User');
const Poll = require('./Poll');
const router = require('express').Router();
const die = require('./utils').die;

const DATABASE_URL =  process.env.DATABASE_URL || die('DATABASE_URL not specified');

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

router.get('/polls', (request, response) => {
  Poll.find().then(polls => response.json(polls));
});

module.exports = router;