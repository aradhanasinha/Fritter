var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
require('handlebars/runtime');


// DATABASE SETUP
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("database connected");
});



// Import route handlers
var index = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');
var allnotes = require('./routes/allnotes');
var allusers = require('./routes/allusers');
var follows = require('./routes/follows');
var followsnotes = require('./routes/followsnotes');

// Import User model
var User = require('./models/User')

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret : '6170', resave : true, saveUninitialized : true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware. This function
// is called on _every_ request and populates
// the req.currentUser field with the logged-in
// user object based off the username provided
// in the session variable (accessed by the
// encrypted cookied).
app.use(function(req, res, next) {
  console.log('In app.js');
  if (req.session.username) {
    console.log(req.session.username);
    User.findByUsername(req.session.username, 
      function(err, user) {
	console.log(err);
	console.log(user);
        if (user) {
          req.currentUser = user;
        } else {
	  console.log('Error ' + err);
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
app.use('/allnotes', allnotes);
app.use('/allusers', allusers);
app.use('/follows', follows);
app.use('/followsnotes', followsnotes);

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
});

module.exports = app;
