'use strict';

const { User, Poll } = require('./db');
const router = require('express').Router();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('../config');


function createToken(username) {
  return jwt.sign({ username }, config.jwtSecret, {
    expiresIn: config.jwtExpires
  });
}

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwtSecret
}, (jwt_payload, done) => {
  User.findByUsername(jwt_payload.username, (error, user) => {
    if (error) {
      return done(error, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

const optionalAuth = (request, response, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (user)  {
      request.user = user;
    }
    next();
  })(request, response);
}
const requireAuth  = passport.authenticate('jwt', { session: false });

router.get('/polls', optionalAuth, (request, response) => {
  const my = request.query.filter === 'my';
  let query = {};

  if (request.isAuthenticated() && my) {
    const userId = request.user._id;
    query = Object.assign({}, query, { creator: userId });
  }

  Poll.find(query).then(polls => response.json(polls));
});

router.get('/polls/:pollId',  optionalAuth, (request, response) => {
  Poll.findOne({ _id: request.params.pollId }).then(
    poll => {
      const res = Object.assign(
        {},
        poll.toObject(),
        { canDelete: request.isAuthenticated() && request.user.equals(poll.creator) }
      );
      response.json(res);
    }
  );
});

router.post('/polls/:pollId/vote', optionalAuth, (request, response) => {
  const pollId = request.params.pollId;
  const custom = request.body.custom;
  console.log(request.isAuthenticated(), request.user);

  if (custom) {
    if (!request.isAuthenticated()) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

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

router.post('/polls/', requireAuth, (request, response) => {
  const poll = Object.assign({}, request.body, { creator: request.user });

  Poll.create(poll).then(
    createdPoll => createdPoll ? response.json(createdPoll) : response.status(400).json({ error: "Something went wrong" }),
    error       => {
      console.log(error);
      response.status(400).json({ error: error.message })
    }
  )
});

router.delete('/polls/:pollId', requireAuth, (request, response) => {
  const pollId = request.params.pollId;

  Poll.findOneAndRemove({ _id: pollId }).then(
    removedPoll => removedPoll ? response.json(removedPoll) : response.status(400).json({ error: "Something went wrong" }),
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
  User.findByUsername(username).then(
    user => {
      if (!user) {
        return response.status(401).json({ error: 'Invalid username or password'});
      }

      user.authenticate(password, (err, _, passwordError) => {
        if (err || passwordError) {
          response.status(401).json({ erorr: 'Unauthorized', info: passwordError });
        } else {
          response.json({
            username, 
            token: createToken(username)
          })
        }
      })
    }, 
    error => {
      response.status(401).json({ error });
    }
  )
});

router.post('/auth/signup', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (!username || !password) {
    return response.status(400).json({ error: 'Missing password or username'});
  }

  User.register(new User({ username }), password, (error, user) => {
    if (error) {
      return response.status(400).json({ error: error.message });
    }
    response.json({ username, token: createToken(username) });
  });
});

module.exports = router;
