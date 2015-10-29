var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var User = require('../models/User')

/*
  Require authentication on ALL access to /notes/*
  Clients which are not logged in will receive a 403 error code.
*/
var requireAuthentication = function(req, res, next) {
  console.log("routes/allnotes.js >> Middleware: requireAuthentication")
  if (!req.currentUser) {
    utils.sendErrResponse(res, 403, 'Must be logged in to use this feature.');
  } else {
    next();
  }
};

/*
  Require ownership whenever accessing a particular note
  This means that the client accessing the resource must be logged in
  as the user that originally created the note. Clients who are not owners 
  of this particular resource will receive a 404.

  Why 404? We don't want to distinguish between notes that don't exist at all
  and notes that exist but don't belong to the client. This way a malicious client
  that is brute-forcing urls should not gain any information.
*/
var requireOwnership = function(req, res, next) {
  console.log("routes/allnotes.js >> Middleware: requireOwnership")
  if (!(req.currentUser.username === req.note.creator)) {
    utils.sendErrResponse(res, 404, 'Resource not found.');
  } else {
    next();
  }
};

// Register the middleware handlers above.
router.all('*', requireAuthentication);
router.all('/:note', requireOwnership);

/*
  At this point, all requests are authenticated and checked:
  1. Clients must be logged into some account
  2. If accessing or modifying a specific resource, the client must own that note
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
       console.log("5. routes/allnotes.js >> router.get('/allnotes'... >> callback for getListOfUsersByWhetherFollowed");
    if (err) {
      console.log(err);
      utils.sendErrResponse(res, 500, 'An unknown error occurred.');
    } else {
      console.log("6. routes/allnotes.js >> router.get('/allnotes' >> no error");
      utils.sendSuccessResponse(res, { usersFollowed: usersFollowed ,  usersNotFollowed: usersNotFollowed });
    }
  });
});


module.exports = router;
