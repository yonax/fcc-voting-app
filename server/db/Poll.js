const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Choice = new Schema({
  text: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const Poll = new Schema({
  creator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  topic: {
    type: String,
    required: true
  },
  choices: {
    type: [Choice],
    required: true,
    validate: [arrayMinLength(2)]
  }
});

function arrayMinLength(n) {
  return {
   validator(v) { return v.length >= n },
   message: `{PATH} must have minimum length of ${n}`
  };
}

module.exports = mongoose.model('Poll', Poll);