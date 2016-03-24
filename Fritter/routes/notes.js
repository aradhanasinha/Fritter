var express = require('express');
var moment = require('moment');
var router = express.Router();
var utils = require('../utils/utils');

var Note = require('../models/Note');


/*
  Grab a note from the store whenever one is referenced with an ID in the
  request path (any routes defined with :note as a parameter).
*/
router.param('note', function(req, res, next, noteId) {
  console.log("routes/notes.js >> router.param")
  User.getNote(req.currentUser.username, noteId, function(err, note) {
    if (note) {
      req.note = note;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
});


/*
  At this point, all requests are authenticated and checked:
  1. Clients must be logged into some account
  2. If accessing or modifying a specific resource, the client must own that note
  3. Requests are well-formed
*/

/*
  GET /notes
  No request parameters
  Response:
    - success: true if the server succeeded in getting the user's notes
    - content: on success, an object with a single field 'notes', which contains a list of the
    user's notes
    - err: on failure, an error message
*/
router.get('/', function(req, res) {
  console.log("router/notes GET function called");
  User.getNotes(req.currentUser.username, res, function(err) { });
});


/*
  GET /notes/:note
  Request parameters:
    - note: the unique ID of the note within the logged in user's note collection
  Response:
    - success: true if the server succeeded in getting the user's notes
    - content: on success, the note object with ID equal to the note referenced in the URL
    - err: on failure, an error message
*/
router.get('/:note', function(req, res) {
  utils.sendSuccessResponse(res, req.note);
});

/*
  POST /notes
  Request body:
    - content: the content of the note
  Response:
    - success: true if the server succeeded in recording the user's note
    - err: on failure, an error message
*/
router.post('/', function(req, res) {
  User.addNote(req.currentUser.username, {
    content: req.body.content,
    creator: req.currentUser.username
  }, function(err, note) {
    if (err) {
      utils.sendErrResponse(res, 500, 'An unknown error occurred.');
    } else {
      utils.sendSuccessResponse(res);
    }
  });
});

/*
  POST /notes/:note
  Request parameters:
    - note ID: the unique ID of the note within the logged in user's note collection.
  Response:
    - success: true if the server succeeded in recording the user's note
    - err: on failure, an error message
*/
router.post('/:note', function(req, res) {
  User.updateNote(
    req.currentUser.username, 
    req.note._id, 
    req.body.content, 
    function(err) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
  });
});

/*
  DELETE /notes/:note
  Request parameters:
    - note ID: the unique ID of the note within the logged in user's note collection
  Response:
    - success: true if the server succeeded in deleting the user's note
    - err: on failure, an error message
*/
router.delete('/:note', function(req, res) {
  User.removeNote(
    req.currentUser.username, 
    req.note._id, 
    function(err) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
  });
});

module.exports = router;
