const mongoose = require('mongoose');

const Poll = new mongoose.Schema({
  topic: String,
  choices: [{text: String, votes: Number}]
});

module.exports = mongoose.model('Poll', Poll);