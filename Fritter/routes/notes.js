var express = require('express');
var moment = require('moment');
var router = express.Router();
var utils = require('../utils/utils');

var Note = require('../models/Note');

/*
  At this point, all requests are authenticated and checked:
  1. Clients must be logged into some account
  2. If accessing or modifying a specific resource, the client must own that note
  3. Requests are well-formed
*/

//GETTERS:

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
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
    Note.getNotes(username, function(err,result) {
        utils.sendSuccessResponse(res, result);
    });
  } else {
    utils.sendErrResponse(res, 403, 'Invalid Authentication');
  }
  
});

/*
  GET /notes/filter 
  Request parameters:
    - authors: authorList
  Response: 
    - success: true if success
    - content: list of notes
 */
router.get('/filter', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
    Note.getNotesByAuthor(username, req.query.authors, function(err,result) {
      utils.sendSuccessResponse(res, result);
    });
  } else {
    utils.sendErrResponse(res, 403, 'Not authenticated');
  }
});


/*
  GET /notes/:noteUUID
  Request parameters:
    - note: the unique ID of the note within the logged in user's note collection
  Response:
    - success: true if the server succeeded in getting the user's notes
    - content: on success, the note object with ID equal to the note referenced in the URL
    - err: on failure, an error message
*/
router.get('/:fid', function(req, res) {
    Note.getNoteById(req.params.fid, function(err,result) {
        if (err) {
            utils.sendErrResponse(res, 403, err);
        } else {
            utils.sendSuccessResponse(res, result);
        }
    });
});

//POST FUNCTIONS

/*
  POST /notes/add
  Request body:
    - text: the text of the note
  Response:
    - success: true if the server succeeded in recording the user's note
    - err: on failure, an error message
*/
router.post('/add', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
  }

  Note.addNote(username, req.body.note, moment(), function(err, result) {
      if (err) {
          utils.sendErrResponse(res, 403, err);
      } else {
          utils.sendSuccessResponse(res, result);
      }
  });
})

/*
  POST /notes/rf
  Request parameters:
    - note ID: the unique ID of the note within the logged in user's note collection.
  Response:
    - success: true if the server succeeded in recording the user's note
    - err: on failure, an error message
*/
router.post('/rf', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
  }

  Note.refreet(username, req.body.noteId, moment(), function(err, result) {
    if (err) {
      utils.sendErrResponse(res, 403, err);
    } else {
      utils.sendSuccessResponse(res, result);
    }
  });
})

//DELETE FUNCTIONS:

/*
  POST /notes/delete
  Request parameters:
    - note ID: the unique ID of the note within the logged in user's note collection
  Response:
    - success: true if the server succeeded in deleting the user's note
    - err: on failure, an error message
*/
router.post('/delete', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
  }

  Note.deleteNoteById(username, req.body.noteId, function(err, result) {
    if (err) {
      utils.sendErrResponse(res, 403, err);
    } else {
      utils.sendSuccessResponse(res, result);
    }
  });
})

module.exports = router;
