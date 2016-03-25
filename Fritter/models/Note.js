var mongoose = require("mongoose");
var User = require('./User');

var noteSchema = mongoose.Schema({
  text: String,
  ts: String, 
  author: String,
  isRefreet: Boolean,
  originalAuthor: String,
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

//ADD FUNCTIONS

/*
Add a note; asssumes valid username

inputUsername (string) - author username
noteText (string) - note text
timestamp (object?) - datetime info
callback (function) - function to be called with err or result
 */
noteSchema.statics.addNote = function(inputUsername, noteText, timestamp, callback) {
    if (inputUsername && noteText.length > 0) {
        var username = inputUsername.toLowerCase();
        User.findByUsername(username, function(err, result) { //now we write in callback
            if (err) { //err with finding user
                callback("Invalid username");
            } 

            else { ///add note
                var note = new Note({
                    text: noteText,
                    ts: timestamp,
                    author: result.username,
                    authorId: result._id,
                    isRefreet: false
                });
                note.save(callback);
            }
        });
    } 
    else { //empty text or no user at the momement
    	callback("Invalid note")
    }
}

/*
Add a retweeted note; asssumes valid username

inputUsername (string) - author username
id (string) - note uuid
timestamp (object?) - datetime info
callback (function) - function to be called with err or result
 */
noteSchema.statics.refreet = function(inputUsername, id, timestamp, callback) {
    this.find({_id: id}, function(err, result) {
        if (err) { //err  with queery finding note
        	callback(err);
        }
        else if (result.length === 0) {
        	callback("Note does not exist");
        }

        else {
            if (inputUsername) {
                var note = result[0];
                var username = inputUsername.toLowerCase();

                User.findByUsername(username, function(err, user) {
                    if (err) { //err with query finding user
                        callback("Invalid username");
                    } 
                    else if (username === note.author) { //case: retweet self
                        callback("Cannot refreet your own note");
                    } 
                    else if (note.isRefreet) { //tries to retweet retweeted thing
                        callback("Cannot refreet a refreeted note");
                    } 
                    else { //success: refreet the thing
                        var newNote = new Note({
                            text: note.text,
                            ts: timestamp,
                            author: user.username,
                            authorId: user._id,
                            isRefreet: true,
                            originalAuthor: note.author,
                        });
                        newNote.save(callback);
                    }
                });
            } 

            else { //invaluid username
            	callback("Invalid username");
            }
        }
    });
}


//GET FUNCTIONS

/*
Get all notes by the current user

inputUsername (string) - must be current user
callback (function) - function called with err or result
*/
noteSchema.statics.getNotes = function(inputUsername, callback) {
    if (inputUsername) {
        var username = inputUsername.toLowerCase();

        this.find({}, function(err, notes) {
            
            if (err) { //case: error with query
            	callback(err);
            }

            else { //filter by username
                User.findByUsername(username, function(err, result) {
                    if (err) { //error with query
                    	callback(null, []);
                    }

                    else {
                    	callback(null, notes)
                    }
                });
            }
        });
    } 

    else { //username not specified
    	callback(null, []);
    }
};

/*
Get all notes by the list of users

inputUsername (string) - must be current user
authorList (object) - usernames to get tweets from
callback (function) - function called with err or result
*/
noteSchema.statics.getNotesByAuthor = function(inputUsername, authorList, callback) {
    if (inputUsername) {
        var username = inputUsername.toLowerCase();

        this.find({author: {$in: authorList}}, function(err, notes) {
            if (err) { //error with query
            	callback(err);
            }

            else {//filter
                User.findByUsername(username, function(err, result) {
                    if (err) { //err with query
                    	callback(null, []);
                    }
                    else { //success
                    	callback(null, notes)
                    }
                });
            }
        });
    } 

    else { //invalid username
    	callback(null, []);
    }
};

/*
Get note by id

id (string) - uuid
callback (function) - function called with err or result
*/
noteSchema.statics.getNoteById = function(id, callback) {
    this.find({_id: id}, function(err, result) {
        if (err) { //error with query
        	callback(err);
        }
        else if (result.length > 0) { //found tweets
        	callback(null, result[0]);
        }

        else { //nothing useful found
        	callback("Freet not found");
        }
    });
}



//DELETE FUNCTIONS

/*
Delete note

inputUsername (string) - username of user deleting the thing
id (string) - uuid
callback (function) - function called with err or result
*/
noteSchema.statics.deleteNoteById = function(inputUsername, id, callback) {
    if (inputUsername) {
        var username = inputUsername.toLowerCase();

        //only an author of the note can remove it
        this.remove({author: username, _id: id}, function(err, result) {
            if (err) { //error with query
            	callback(err);
            }

            else if (result.result.n === 0) { //nothing found to delete (check len?)
            	callback("Could not delete");
            }

            else { //success
            	callback(null);
            }
        });
    } 

    else { //no username specified
    	callback("Invalid username");
    }
}

/*
Delete all notes
 */
noteSchema.statics.clearNotes = function() {
    this.remove({}, function() {});
}


var Note = mongoose.model('Note', noteSchema);
module.exports = Note;
