var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// DATABASE SETUP
mongoose.connect( process.env.MONGOLAB_URI || 'mongodb://localhost/fritter');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("database connected");
});

// Import route handlers
var index = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');

// Import User model
var User = require('./models/User')

//INIT APP
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret : 'dankmemes', resave: false, saveUninitialized: false }));

// Authentication middleware. This function
// is called on _every_ request and populates
// the req.currentUser field with the logged-in
// user object based off the username provided
// in the session variable (accessed by the
// encrypted cookied).
app.use(function(req, res, next) {
  if (req.session.username) {
    User.findByUsername(req.session.username, 
      function(err, user) {
        if (user) {
          req.currentUser = user;
        } else {
          req.currentUser = undefined;
          req.session.destroy();
        }
        next();
      });
  } else {
      next();
  }
});

// Map paths to imported route handlers
app.use('/', index);
app.use('/users', users);
app.use('/notes', notes);


// ERROR HANDLERS
// Note: The methods below are called
// only if none of the above routes 
// match the requested pathname.

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler.
// Will print stacktraces.
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler.
// No stacktraces leaked to user.
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).end();
  res.render('error');
});

module.exports = app;
