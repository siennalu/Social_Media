const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let articleSchema = new Schema({
  Author: String,
  Title: String,
  Category: String,
  Content: Array,
  Likes: Number,
  LikesPeople: String,
  CommentPerson: String,
  CommentContent: String,
  CommentTime: String,
  Delete: Boolean
}, { versionKey: false });

let article_schema = mongoose.model('Article', articleSchema);

module.exports = article_schema;