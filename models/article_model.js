const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let articleSchema = new Schema({
  Title: String,
  Category: String,
  Content: String,
  Images: Object,
  Date: String,
  Location : { type: {type:String}, coordinates: [Number]},
  Likes: Number,
  LikesPeople: String,
  CommentPerson: String,
  CommentContent: String,
  CommentTime: String
}, { versionKey: false });

articleSchema.index({loc: '2dsphere'});

let article_schema = mongoose.model('Article', articleSchema);

module.exports = article_schema;