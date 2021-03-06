var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var User = require('../models/User');

/*
  For both login and create user, we want to send an error code if the user
  is logged in, or if the client did not provide a username and password
  This function returns true if an error code was sent; the caller should return
  immediately in this case.
*/
var isLoggedInOrInvalidBody = function(req, res) {
  	if (req.currentUser) {
        utils.sendErrResponse(res, 403, 'There is already a user logged in.');
        return false;
    } else if (!req.body.username) {
        utils.sendErrResponse(res, 400, 'Username not provided.');
        return false;
    }
    return true;
};

/*
  This function will check to see that the provided username-password combination 
  is valid. For empty username or password, or if the combination is not correct, 
  an error will be returned.

  An user already logged in is not allowed to call the login API again; an attempt
  to do so will result in an error code 403.

  POST /users/login
  Request body:
    - username
    - password
  Response:
    - success: true if login succeeded; false otherwise
    - content: on success, an object with a single field 'user', the object of the logged in user
    - err: on error, an error message
*/
router.post('/login', function(req, res) {
  if (isLoggedInOrInvalidBody(req, res)) {
        User.authUser(req.body.username, req.body.password, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                req.session.username = req.body.username;
                utils.sendSuccessResponse(res, { user : req.body.username });
            }
        });
    }
});

/*
  POST /users/logout
  Request body: empty
  Response:
    - success: true if logout succeeded; false otherwise
    - err: on error, an error message
*/
router.post('/logout', function(req, res) {
    if (req.currentUser) {
        req.session.destroy();
        utils.sendSuccessResponse(res);
    } else {
        utils.sendErrResponse(res, 403, 'There is no user currently logged in.');
    }
});

/*
  Create a new user in the system.

  All usernames in the system must be distinct. If a request arrives with a username that
  already exists, the response will be an error.

  This route may only be called accessed without an existing user logged in. If an existing user
  is already logged in, it will result in an error code 403.

  Does NOT automatically log in the user.

  POST /users/create
  Request body:
    - username
    - password
  Response:
    - success: true if user creation succeeded; false otherwise
    - err: on error, an error message
*/
router.post('/create', function(req, res) {
    if (isLoggedInOrInvalidBody(req, res)) {
        User.createUser(req.body.username, req.body.password, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                req.session.username = req.body.username;
                utils.sendSuccessResponse(res, { user : result.username });
            }
        });
    }
});

/*
  Determine whether there is a current user logged in

  GET /users/current
  No request parameters
  Response:
    - success.loggedIn: true if there is a user logged in; false otherwise
    - success.user: if success.loggedIn, the currently logged in user
*/
router.get('/current', function(req, res) {
    if (req.currentUser) {
        utils.sendSuccessResponse(res, { loggedIn : true, user : req.currentUser.username });
    } else {
        utils.sendSuccessResponse(res, { loggedIn : false });
    }
});


/*
  Get the user's follows list

  GET /users/follows 
  Request parameters: 
    - username: username of the follower
  Response: 
    - success: true if login is success
    - content: list of usernames the user follows
    - err: error message
 */
router.get('/follows', function(req, res) {
    if (req.currentUser) {
        User.getFollows(req.query.username, function(err, result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, { result: result} );
            }
        })
    } else {
        utils.sendSuccessResponse(res, { loggedIn : false });
    }
});

/*
  Follow user

  POST /users/follow
  Request parameters: 
    - username: username to follow
  Response: 
    - success: true if login is success
    - content: list of usernames the user follows
    - err: error message
 */
router.post('/follow', function(req, res) {
    if (req.currentUser) {
        User.followUser(req.currentUser.username, req.body.username, function(err, result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, { result: result} );
            }
        })
    } else {
        utils.sendSuccessResponse(res, { loggedIn : false });
    }
});


module.exports = router;
