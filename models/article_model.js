const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articleSchema = new Schema({
  authorID: String,
  author: String,
  title: String,
  category: String,
  listOfContent: Array,
  likes: Array,
  numberOfLikes: Number,
  commentPerson: String,
  commentContent: String,
  commentTime: String,
  delete: Boolean
}, { versionKey: false });

let article_schema = mongoose.model('Article', articleSchema);

module.exports = article_schema;