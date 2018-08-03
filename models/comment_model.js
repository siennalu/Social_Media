const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = new Schema({
  articleID: String,
  commenterID: String,
  listOfComment: Array,
  likes: Array,
  numberOfLikes: Number,
  delete: Boolean
}, { versionKey: false });

let commenter_schema = mongoose.model('Commenter', commentSchema);

module.exports = commenter_schema;