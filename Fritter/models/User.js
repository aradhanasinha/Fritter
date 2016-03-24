// Data for each User is stored in memory instead of in
// a database. This store (and internal code within the User model)
// could in principle be replaced by a database without needing to
// modify any code in the controller.
var utils = require('../utils/utils');
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	follows : [String],
});

// Model code for a User object in the note-taking app.
// Each User object stores a username, password, and follows info

/*
Find a user by their username, error thrown if not found

inputUsername (string) - username to check
callback (function) - function to call with error or result
*/
userSchema.statics.getUserByUserName = function (inputUsername, callback) {
	console.log("getUserByUserName called");
	console.log(inputUsername);

	var username = inputUsername.toLowerCase();
	this.find({ username: username }, function(err, result) {
        if (err) {
        	callback(err);
        }
        else if (result.length > 0) {
        	callback(null, {username: username, _id: result[0]._id});
        }
        else { //query succeeded, no results
        	callback("User not found");
        }
    });
};

/*
Add a follower
 
inputFollower (string)- username of user doing the following
inputUsername (string)- username of user being followed
callback    (function)- function to call with err or result

*/
userSchema.statics.followUser = function(inputFollower, inputUsername, callback) {
    console.log("4. models/User.js >> changeFollowStatus function called");
      
    var follower = inputFollower.toLowerCase();
    var username = inputUsername.toLowerCase();

    this.find({ username: follower }, function(err, result) {
        this.find({username: username}, function(err2, user) {
            //case: errors or user not found cases
            if (err2) {
            	callback(err2);
            }
            else if (err) {
            	callback(err);
            }
            else if (result.length === 0 || user.length === 0) {
                username = undefined;
                callback("User not found");
            }

            //case: already a follower
            else if (result[0].follows.indexOf(username) > -1) {
                callback("User already follows");
            }

            //case: tries to follow self 
            else if (username === follower) {
                callback("User cannot follow self");
            }

            //case: add the follower
            else {
                var follows = result[0].follows;
                follows.push(username);
                this.update({username: follower}, {follows: follows}, callback)
            }
        });
    });
};


//_____________________________OBSOLETE__________________________________
//OLD CODE FROM 5 Months Ago, commented out and slowly moved up as needed
//Attempting to not store all notes under a user object, seems more legit

// Each note has some textual content and is specified
// by the owner's username as well as an ID. Each ID is unique
// only within the space of each User, so a (username, noteID)
// uniquely specifies any note.

//Global Variables:
var emptyDbResponse = "no entries found";

//Helper functions, only accessible to internal functions
var infoRetrieved = emptyDbResponse;
var currentUser = emptyDbResponse;

var setCurrentUser = function(err, user) {
	console.log("setCurrentUser called");
  	if (err) {
     		return utils.sendErrResponse(user,
			 500, 'An unknown error occurred.');
  	}
  
	if (!user) {
    		currentUser = emptyDbResponse;
  	} else {
    		currentUser = user;
  	}
	console.log(currentUser);
};

var setInfoRetrieved = function(err, info) {
  	if (err) {
     		return utils.sendErrResponse(info, 
			500, 'An unknown error occurred.');
  	}
  
	if (!info) {
    		infoRetrieved = emptyDbResponse;
  	} else {
    		infoRetrieved = info;
  	}
};


//Internal functions: all functions that have mongoose code
var arrayDiff = function(a1, a2) {
    	var a=[], diff=[];

    	for ( var i = 0 ; i < a1.length ; i++) {
      		a[a1[i]]=true; 
    	}

    	for ( var i = 0 ; i < a2.length ; i++) {
      		if(a[a2[i]]) {
         		delete a[a2[i]];
      		} else {
         		a[a2[i]]=true; 
      		}
    	}

    	for ( var k in a ) {
      		diff.push(k);
    	}

    	return diff;
};



userSchema.statics.getListOfAllUsernames = function () {
  	var query = User.find({});
  	query.select('username');
  	query.exec(setInfoRetrieved(err, info));
  	var allUsernames = infoRetrieved;
  	return allUsernames
};

userSchema.statics.saveToDatabase = function(user) {
	user.save(function (err) { if (err) 
		return utils.sendErrResponse('save', 500, 'An unknown error occurred.');
	});
};

//Statics
userSchema.statics.getListOfUsersByWhetherFollowed = function (username) {
	console.log("4. models/User.js >> getListOfUsersByWhetherFollowed function called");

	var user = getUser(username);
	if (user === emptyDbResponse) {
		callback({ msg : 'Invalid user.' });
	}

	var listOfAllUsers = getListOfAllUsernames();
	listOfAllUsers.splice( listOfAllUsers.indexOf(username) , 1);
	var usersFollowed = user.follows;
	var usersNotFollowed = arrayDiff(listOfAllUsers, usersFollowed);
	callback(null, usersFollowed, usersNotFollowed);
};

//error goes through this one
userSchema.statics.findByUsername = function (username, callback) {
	console.log("userschema.statics.findByUsername>>");	
	var user = userSchema.statics.getUser(username);
	console.log(user);
	if (user === emptyDbResponse) {
		callback({ msg : 'No such user!' });
	}
	callback(null, user);
};

//works
userSchema.statics.verifyPassword = function(candidateUsername, candidatepw, req, res, callback) {
	console.log("Models > User > verifyPassword function called");
	this.find({ username: candidateUsername }, function(err, users) {
		console.log(users);
  		if (err) {
			console.log("ERROR: db find lookup");
			utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
  		} else {
  
			if (users.length === 0) {
				console.log("ERROR: no user exists");
				utils.sendErrResponse(res, 403, 'Username or password invalid.');
			} else {
				var user = users[0];
				if (candidatepw === user.password) {
      					req.session.username = candidateUsername;
					console.log("SUCCESS: log-in approved.");
      					utils.sendSuccessResponse(res, { user : candidateUsername });
    				} else {
					console.log("ERROR: password mismatch");
      					utils.sendErrResponse(res, 403, 'Username or password invalid.');
    				}
			}
		}
	});
	callback(null);
    	
};

//works
userSchema.statics.createNewUser = function (newUsername, newPassword, res, callback) {
	console.log("Models > User > createNewUser function called");
	var newUser = new this();
	this.find({ username: newUsername }, function(err, users) {
  		if (err) {
			console.log("ERROR: db find lookup");
			utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
  		} else {
  
			if (users.length === 0) {
				newUser.username = newUsername;
				newUser.password = newPassword;
				newUser.follows = [];
				newUser.notes = [];
	
    				newUser.save(function (err) { 
					if (err) {
						console.log("ERROR: db save");
						utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
					} else {
						console.log("SUCCESS: new user registered");
						utils.sendSuccessResponse(res, newUsername);
					}
				});
  			} else {
				console.log("ERROR: username already taken");
				utils.sendErrResponse(res, 400, 'That username is already taken!');
  			}
		}
	});
	callback(null);	
};

userSchema.statics.getNote = function(username, noteId, callback) {
    	var user = getUser(username);
    	if (user === emptyDbResponse) {
        	callback({ msg : 'Invalid user. '});
    	}
    
    	if (user.notes[noteId]) {
        	var note = user.notes[noteId];
        	callback(null, note);
    	} else {
        	callback({ msg : 'Invalid note. '});
    	}
};

//can't reach notes router from index.js, halppp
userSchema.statics.getNotes = function(currentUsername, res, callback) {
	console.log("Models > User > getNotes function called");
	this.findOne({ username: currentUsername }, function(err, user) {
		console.log(err);
		console.log(user);
  		if (err) {
			console.log("ERROR: db find lookup");
			utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
  		} else {  
			utils.sendSuccessResponse(res, { notes: user.notes });			
			/* if (users.length === 0) {
				console.log("ERROR: no user exists in db");
				utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
			} else {
				var user = users[0];
				utils.sendSuccessResponse(res, { notes: user.notes });
			} */
		}
	});    	
    	callback(null);
};

  //mine - worked
userSchema.statics.getAllNotes = function(userLoggedIn, callback) {
    	console.log("4. models/User.js >> getAllNotes function called");
    	var safeStore = []
    	var listOfAllUsers = getListOfAllUsernames();

    	for (var i = 0; i < listOfAllUsers.length; i++) {
      		var username = listOfAllUsers[i];
      		if (username !== userLoggedIn) {
         		var user = getUser(username);
         		safeStore = safeStore.concat(user.notes);
      		}
    	}
    	callback(null, safeStore);
};

  //mine - works
userSchema.statics.getFollowsNotes = function(username, callback) {
	console.log("4. models/User.js >> getFollowsNotes function called");
    	var safeStore = []
    
    	var user = getUser(username);
	if (user === emptyDbResponse) {
        	callback({ msg : 'Invalid user. '});
    	}
    
    	var follows = user.follows;

    	for (var i = 0; i < follows.length; i++) {
      		var username = follows[i];
      		var userFollows = getUser(username);
      		safeStore = safeStore.concat(userFollows.notes);
    	}
    	callback(null, safeStore);
};

  //mine - works
userSchema.statics.changeFollowStatus = function(username, usernameFollows, callback) {
      console.log("4. models/User.js >> changeFollowStatus function called");
      var user = getUser(username);
      if (user === emptyDbResponse) {
        callback({ msg : 'Invalid user. '});
      }

      var index = user.follows.indexOf(usernameFollows);

      if (index > -1) {
        //follow --> unfollow
        user.follows.splice(index, 1);
      } else {
        //unfollow --> follow
        user.follows.push(usernameFollows);
      }
      saveToDatabase(user);
      callback(null);
};

//m
userSchema.statics.addNote = function(username, note, callback) {
	var user = getUser(username);
	if (user === emptyDbResponse) {
		callback({ msg : 'Invalid user. '});
	}

	var newNote =  { creator : username, content : note };
	user.notes.push(newNote);
	saveToDatabase(user);
	callback(null);
};

userSchema.statics.updateNote = function(username, noteId, newContent, callback) {
	var user = getUser(username);
	if (user === emptyDbResponse) {
		callback({ msg : 'Invalid user. '});
	}

	if (user.notes[noteId]) {
        	user.notes[noteId].content = newContent;
        	callback(null);
      	} else {
        	callback({ msg : 'Invalid note.' });
      	}
	saveToDatabase(user);
};

userSchema.statics.removeNote = function(username, noteId, callback) {
	var user = getUser(username);
	if (user === emptyDbResponse) {
		callback({ msg : 'Invalid user. '});
	}

	if (user.notes[noteId]) {
        	delete notes[noteId];
        	callback(null);
      	} else {
        	callback({ msg : 'Invalid note.' });
      	}
	saveToDatabase(user);
};

module.exports = mongoose.model("User", userSchema);
