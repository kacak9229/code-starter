var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('../config/config');
var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/* Twitter Strategy */
passport.use(new TwitterStrategy(config.twitter, function(token, refreshToken, profile, done) {

  User.findOne({ twitter: profile.id }, function(err, user) {
    if (err) return done(err);

    if (user) {
      return done(null, user);
    } else {
      var user = new User();
      user.twitter = profile.id;
      user.tokens.push({ kind: 'twitter', token: token });
      user.username = profile.username;
      user.displayName = profile.displayName;
      user.picture = profile._json.profile_image_url_https.replace('_normal', '');

      user.save(function(err) {
        if (err) return done(err);
        user.on('es-indexed', function(err, res){
          /* Document is indexed */
          console.log("Indexed");
          });
          return done(null, user);
      });
    }
  });
}));



/* FACEBOOK Strategy*/
passport.use(new FacebookStrategy(
  config.facebook,
  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

    // find the user in the database based on their facebook id
    User.findOne({ facebook : profile.id }, function(err, user) {

      if (err) return done(err);

      if (user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.email = profile._json.email;
        newUser.facebook = profile.id;
        newUser.tokens.push({ kind: 'facebook', token: token });
        newUser.profile.name = profile.displayName;
        newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  }));




  exports.isAuthenticated = function() {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }
