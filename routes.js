const passport = require('passport');
const User = require('./User');
const Poll = require('./Poll');
const router = require('express').Router();

router.get('/', (req, res) => 
  Poll.find()
      .then(polls => res.render('index', { polls, user : req.user }))
)

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local', {
      successRedirect: '/', failureRedirect: '/register', failureFlash: true  
    })(req, res);
  });
});

router.get('/login', (req, res) => res.render('login', { user: req.user }));
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login', failureFlash: true
}), (req, res) => {
  if (req.query.next) {
    return res.redirect(req.query.next);
  }
  res.redirect('/')
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

const authenticated = nextUrl => (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/login?next=${nextUrl}`);
}

router.get('/create', authenticated('create'), (req, res) => res.render('create', { user : req.user }))
router.post('/create', authenticated('create'), (req, res) => {
  req.checkBody({
    'topic': {
      notEmpty: true,
      isLength: {
        options: [{min: 1, max: 255}],
        errorMessage: 'Must be between 1 and 255 chars long'
      }
    },
    'choices': {
      notEmpty: true,
      isArray: true,
    }
  });
  const errors = req.validationErrors(true);
  if (errors) {
    res.render('create', { errors, form: req.body });
  } else {
    Poll.create({
      topic: req.body.topic,
      choices: req.body.choices.filter(c => c).map(text => ({ text })),
      creator: req.user
    }, (err) => {
      if (err) {
        req.flash('error', err.message);
        return res.render('create', { errors, form: req.body });
      }
      res.redirect('/');
    })
  }
});

router.get('/my', authenticated('my'), (req, res) => {
  Poll.find({ creator: req.user }).exec().then(userPolls => 
    res.render('my', { polls : userPolls, user : req.user })
  );
});

router.get('/poll/:pollId', (req, res) => {
  Poll.findOne({ _id: req.params.pollId }).exec()
  .then(poll =>
    poll ? res.render('poll', { poll, user: req.user }) : res.status(404).render('404')
  )
  .catch(error =>
    res.render('error', { error, user: req.user }) 
  );
});

router.post('/poll/:pollId', (req, res) => {
  const pollId = req.params.pollId;

  req.check({
    choice: {
      notEmpty: true,
      errorMessage: 'You should choose something to vote'
    }
  });

  const errors = req.validationErrors();
  if (errors) {
    errors.forEach(error => req.flash('error', error.msg));
    return res.redirect(`/poll/${pollId}`);
  }

  const choiceId = req.body.choice;

  Poll.findOneAndUpdate(
    { _id: req.params.pollId, 'choices._id': choiceId},
    {$inc: {"choices.$.votes": 1}}
  ).then(() =>
    res.redirect(`/poll/${pollId}/result`) 
  ).catch(error =>
    res.render('error', { error, user: req.user }) 
  );

});

router.get('/poll/:pollId/result', (req, res) => {
  Poll.findOne({ _id: req.params.pollId }).exec()
  .then(poll =>
    poll ? res.render('result', { poll }) : res.status(404).render('404')
  )
  .catch(error =>
    res.render('error', { error, user: req.user }) 
  );
});

module.exports = router;
