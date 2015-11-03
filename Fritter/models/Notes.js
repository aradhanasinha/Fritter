var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
  creator: String,
  content: String,
});

module.exports = mongoose.model("Note", noteSchema);
