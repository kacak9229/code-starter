var router = require('express').Router();
var passportConf = require('../config/passport');

router.get('/profile', passportConf.isAuthenticated, function(req, res, next) {
  res.render('accounts/profile');
});

router.get('/login/twitter', passport.authenticate('twitter'));

router.get('/login/twitter/return', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

router.get('/logout', function(req, res, next) {
  res.logout();
  res.redirect('/');
});

module.exports = router;
