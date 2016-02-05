module.exports = {

  database: process.env.DATABASE || 'mongodb://localhost/testing1234',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'ARASHISTHEBEST',

  twitter: {
    consumerKey: process.env.TWITTER_KEY || '',
    consumerSecret: process.env.TWITTER_SECRET || '',
    callbackURL: 'http://127.0.0.1:3000/login/twitter/return'
  },
  
  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
  }
}
