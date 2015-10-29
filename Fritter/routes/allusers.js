var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var User = require('../models/User')

/*
  Require authentication on ALL access to /notes/*
  Clients which are not logged in will receive a 403 error code.
*/
var requireAuthentication = function(req, res, next) {
  console.log("routes/allusers.js >> Middleware: requireAuthentication")
  if (!req.currentUser) {
    utils.sendErrResponse(res, 403, 'Must be logged in to use this feature.');
  } else {
    next();
  }
};

// Register the middleware handlers above.
router.all('*', requireAuthentication);

/*
  At this point, all requests are authenticated and checked:
  1. Clients must be logged into some account
*/


/* mine
  GET /allusers
  No request parameters
  Response:
    - success: true if the server succeeded in getting all users
    - content: on success, an object with a single field 'notes', which contains a list of the
    user's notes
    - err: on failure, an error message
*/
router.get('/', function(req, res) {
  console.log("3. routes/allusers.js >> router.get('/allusers'...");
  User.getListOfUsersByWhetherFollowed(
    req.currentUser.username, 
    function(err, usersFollowed, usersNotFollowed) {
       console.log("5. routes/allusers.js >> router.get('/allusers'... >> callback for getListOfUsersByWhetherFollowed");
    if (err) {
      console.log(err);
      utils.sendErrResponse(res, 500, 'An unknown error occurred.');
    } else {
      console.log("6. routes/allusers.js >> router.get('/allusers' >> no error");
      utils.sendSuccessResponse(res, { usersFollowed: usersFollowed ,  usersNotFollowed: usersNotFollowed });
    }
  });
});


module.exports = router;
