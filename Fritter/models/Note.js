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
Delete all notes
 */
noteSchema.statics.clearNotes = function() {
    this.remove({}, function() {});
}


var Note = mongoose.model('Note', noteSchema);
module.exports = Notes;
