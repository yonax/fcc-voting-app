const passport = require('passport');
const User = require('./User');
const router = require('express').Router();

router.get('/', (req, res) => res.render('index', { user : req.user }));

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

module.exports = router;