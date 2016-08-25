const mongoose = require('mongoose');

const Poll = new mongoose.Schema({
  creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  topic: String,
  choices: [{text: String, votes: Number}]
});

module.exports = mongoose.model('Poll', Poll);