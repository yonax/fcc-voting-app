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

Poll.methods.getTwitterLink = function() {
  const link = encodeURIComponent(process.env.BASE_URL + `poll/${this._id}`);
  const text = encodeURIComponent(this.topic);

  return ( 
    `https://twitter.com/intent/tweet?url=${link}&text=${text}`
  );
}

module.exports = mongoose.model('Poll', Poll);