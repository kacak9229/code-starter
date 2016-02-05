/* Require all the important libraries */
var express = require('express');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo/es5')(session);

var ejs = require('ejs');
var engine = require('ejs-mate');
var mongoose = require('mongoose');

var passport = require('passport');
var passportSocketIo = require("passport.socketio");

var User = require('./models/user');
var config = require('./config/config');
var sessionStore = new MongoStore({ url: config.database, autoReconnect: true });

/* Create an instance of express app */
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* Connect to MongoDB */
mongoose.connect(config.database, function(err) {
  if (err) {
    console.log('Error connecting to the database');
  } else {
    console.log('Connected to the Database');
  }
});

/* Setting up templating Engine */
app.engine('ejs', engine);
app.set('view engine', 'ejs');

/* Now we are going to teach express some of the libraries above */
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(morgan('dev')); // morgan for logging the request on the server like GET , POST, PUT, DELETE
app.use(bodyParser.json()); // To parse JSON data
app.use(bodyParser.urlencoded( { extended: true } )); // To Parse data like from HTML input fields
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       config.secret,    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));


function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  console.log('failed connection to socket.io:', message);
  if(error) accept(new Error(message));
}

require('./socketio/io')(io);

/* Using Routes */
var userRoutes = require('./routes/user');
var mainRoutes = require('./routes/main');

app.use(userRoutes);
app.use(mainRoutes);

http.listen(config.port, function(err) {
  if (err) {
    console.log('Error connecting to the database');
  } else {
    console.log('App is running on port ' + config.port);
  }
});
