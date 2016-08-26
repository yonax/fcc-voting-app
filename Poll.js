const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Choice = new Schema({
  text: String,
  votes: {
    type: Number,
    default: 0
  }
});

const Poll = new Schema({
  creator: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  topic: String,
  choices: [Choice]
});

module.exports = mongoose.model('Poll', Poll);