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
Delete all notes
 */
noteSchema.statics.clearNotes = function() {
    this.remove({}, function() {});
}


var Freet = mongoose.model('Note', noteSchema);
module.exports = Notes;
