const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
  username: String,
  password: String
});

User.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', User);