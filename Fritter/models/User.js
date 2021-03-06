// Data for each User is stored in memory instead of in
// a database. This store (and internal code within the User model)
// could in principle be replaced by a database without needing to
// modify any code in the controller.
var utils = require('../utils/utils');
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
// Help: https://www.npmjs.com/package/bcrypt-nodejs

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	follows : [String],
});

// Model code for a User object in the note-taking app.
// Each User object stores a username, password, and follows info

/*
Clears all users, super useful for testing
*/
userSchema.statics.clearUsers = function() {
    this.remove({}, function() {});
}

/*
Find a user by their username, error thrown if not found

inputUsername (string) - username to check
callback (function) - function to call with error or result
*/
userSchema.statics.findByUsername = function (inputUsername, callback) {
	console.log("findByUsername called");

	var username = inputUsername.toLowerCase();
	this.find({ username: username }, function(err, result) {
        console.log(result)
        console.log(err)
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
    console.log("4. models/User.js >> followUser function called");
      
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

/*
Get the follows part of the User object

inputUsername (string) - username to check
callback (function) - function to call with error or result
*/
userSchema.statics.getFollows = function (inputUsername, callback) {
	console.log("4. models/User.js >> getFollows function called");

	var username = inputUsername.toLowerCase();

	this.find({ username: username }, function(err, result) {
        if (err) callback(err);
        else if (result.length === 0) callback("User not found");
        else {
            callback(null, result[0].follows);
        }
    });
};

/*
Create a new user (case does not matter with username, does with password)

newUsername (string) - username of new user
newPassword (string) - password of new user
callback (function) - function to call with error or result
*/
userSchema.statics.createUser = function (newUsername, newPassword, callback) {
	console.log("Models > User > createUser function called");

	var username = newUsername.toLowerCase();

	//Source for RegEx: http://99webtools.com/blog/8-most-useful-regular-expressions/
    if (username.match("^[a-z0-9_-]{3,16}$") && typeof newPassword === 'string') {
        this.find({username: username}, function(err, result) { //check if it exists
            if (err) {
            	callback(err); 
            }

            //case: add new user w/bcrypt
            else if (result.length === 0) {
                var salt = bcrypt.genSaltSync(10); //ten is a nice number
                var hash = bcrypt.hashSync(newPassword, salt);
                var user = new User({
                    username: username,
                    password: hash,
                    follows: []
                });
                user.save(function(err,result) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, {username: username});
                    }
                });
            } 

            //case: username already exists
            else {
            	callback("User already exists");
            }
        });
    } 

    //case: invalid username or password
    else {
        callback("Invalid username or password");
    }	
};


/*
Authenticate a user (w/bcrypt)
 
inputUsername (string) - username to authenticate
password (string) - password to authenticate
callback (function) - function to call with err or result
*/
userSchema.statics.authUser = function(inputUsername, password, callback) {
    console.log("Models > User > authUser function called");

    var username = inputUsername.toLowerCase();
    this.find({username: username}, function(err,result) {
        if (err) { //query failed
        	callback(err);
        }

        else if (result.length > 0) { //you have results, wooo!
            if (bcrypt.compareSync(password, result[0].password)) { //...and it matches!!
            	callback(null, {username: username});
            }
            else { //wrong login
            	callback("Login Failed");
            }
        } 

        else { //results empty for some reason
        	callback("Login Failed");
        }
    });
}




//_____________________________OBSOLETE__________________________________
//OLD CODE FROM 5 Months Ago, commented out and slowly moved up as needed
//Attempting to not store all notes under a user object, seems more legit

// Each note has some textual content and is specified
// by the owner's username as well as an ID. Each ID is unique
// only within the space of each User, so a (username, noteID)
// uniquely specifies any note.

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

/* NOTES related functions, being moved

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

*/


var User = mongoose.model('User', userSchema);

module.exports = User;
