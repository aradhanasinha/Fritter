var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var User = require('../models/User');

/*
  Change follow status

  POST /follows
  Request body:
    - usernameToChangeFollowStatusFor
  Response:
    - success: true if user creation succeeded; false otherwise
    - err: on error, an error message
*/
router.post('/', function(req, res) {
  console.log(req.body);
  console.log(typeof(req.body.usernameToChangeFollowStatusFor));
  var usernamefollows = req.body.usernameToChangeFollowStatusFor;
  console.log(typeof(usernamefollows));
  console.log("3. routes/follows.js >> router.post('/follows'...");
  User.changeFollowStatus(req.currentUser.username, usernamefollows, function(err) {
      console.log("5. routes/follows.js >> router.get('/follows'... >> callback for changeFollowStatus");
      console.log(err);
      if (err) {
	 console.log("ERROR");
         utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
         console.log("6. routes/follows.js >> router.get('/follows'... >> callback for changeFollowStatus >> no error");
         utils.sendSuccessResponse(res);         
      }
    });
});

module.exports = router;
