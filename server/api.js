const mongoose = require('mongoose');
const User = require('./User');
const Poll = require('./Poll');
const router = require('express').Router();

router.get('/polls', (request, response) => {
  Poll.find().then(polls => response.json(polls));
});

router.get('/polls/:pollId', (request, response) => {
  Poll.findOne({ _id: request.params.pollId }).then(poll => response.json(poll));
});

router.post('/polls/:pollId/vote', (request, response) => {
  const pollId = request.params.pollId;
  const custom = request.body.custom;

  if (custom) {
    const text = request.body.text;
    if (!text) {
      return response.status(400).json({
        error: 'text must be present'
      });
    }
    Poll.findOneAndUpdate(
      { _id: pollId },
      { $push: {'choices' : {text, votes: 1}}},
      { new: true }
    ).then(
      poll => poll ? response.json(poll) : response.status(400).json({ error: "Poll not found" }),
      error => response.status(400).json({ error: error.message })  
    )
  } else {
    const choiceId  = request.body._id;
    if (!choiceId) {
      return response.status(400).json({
        error: 'choiceId must be present'
      });
    }
    Poll.findOneAndUpdate(
      { _id: pollId, 'choices._id': choiceId },
      { $inc: {"choices.$.votes": 1} },
      { new: true }
    ).then(
      poll => poll ? response.json(poll) : response.status(400).json({ error: "Poll or choice not found" }),
      error => response.status(400).json({ error: error.message })
    );
  }
});

router.post('/polls/', (request, response) => {
  const poll = request.body;

  Poll.create(poll).then(
    createdPoll => poll ? response.json(createdPoll) : response.status(400).json({ error: "Something went wrong" }),
    error       => {
      console.log(error);
      response.status(400).json({ error: error.message })
    }
  )
});

router.post('/auth/login', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  
  if (!username || !password) {
    return response.status(400).json({ error: 'Missing password or username'});
  }
  if (username === 'user' && password === '123') {
    response.json({ 
      username,
      token: require('crypto').randomBytes(8).toString('base64') 
    });
  } else {
    return response.status(401).json({ error: 'Wrong password or username'});
  }
});

module.exports = router;
