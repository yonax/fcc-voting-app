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
    successRedirect: '/', failureRedirect: '/login', failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


router.get('/create', (req, res) => res.render('create'))
router.post('/create', (req, res) => {
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
      choices: req.body.choices.filter(c => c).map(text => ({ text }))
    }, (err) => {
      if (err) {
        req.flash('error', err.message);
        return res.render('create', { errors, form: req.body });
      }
      res.redirect('/');
    })
  }
});

module.exports = router;
