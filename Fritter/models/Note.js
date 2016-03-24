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


/*
Add a note to store; asssumes valid username

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
module.exports = Notes;
