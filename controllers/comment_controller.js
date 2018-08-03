const commentSchemaModel = require('../models/comment_model.js');
const articleSchemaModel = require('../models/article_model.js');

module.exports = class Comment {

  commentArticle(req, res, next) {
    let commentForArray = [];
    let commentForObject = {};
    let seconds = Math.round(Date.now() / 1000);
    let comment = new commentSchemaModel({
      articleID: req.body.articleID,
      commenterID: req.body.commenterID,
      listOfComment: [],
      likes: [],
      delete: false
    });
    commentForObject.time = seconds;
    commentForObject.content = req.body.content;
    commentForArray.push(commentForObject);
    comment.listOfComment = commentForArray;
    comment.numberOfLikes = comment.likes.length;

    comment.save()
      .then(comments => {
        let result = {
          status: "留言成功",
          comment: comments
        }
        res.json(result)
        console.log(req.body.articleID)
        articleSchemaModel.findOne({ _id: req.body.articleID})
          .then(doc => {
            doc.comment.push(result.comment._id)
            doc.save()
              .then(value => {
              })
              .catch(error => {
                console.log(error);
              })
          })
      })
      .catch(error => res.json(error));
  }

  likesComment(req, res, next) {
    commentSchemaModel.findOne({ _id: req.body.commentID})
      .then(doc => {
        doc.likes.push(req.body.likesPersonID);
        doc.numberOfLikes = doc.likes.length;
        doc.save().then(value => {
          let result = {
            status: "留言已按讚",
            content: value
          }
          res.json(result);
        })
          .catch(error => {
            let result = {
              status: "留言按讚失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
      })
  }

  dislikesComment(req, res, next) {
    commentSchemaModel.findOne({ _id: req.body.commentID})
      .then(doc => {
        console.log(doc)
        let temp = doc.likes.indexOf(req.body.dislikesPersonID);
        doc.likes.splice(temp, 1);
        doc.numberOfLikes = doc.likes.length;
        doc.save().then(value => {
          let result = {
            status: "留言收回讚成功",
            content: value
          }
          res.json(result);
        })
          .catch(error => {
            let result = {
              status: "留言收回讚失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
      })
  }
  updateComment(req, res, next) {
    let updateObj = {};
    let seconds = Math.round(Date.now() / 1000);
    updateObj.time = seconds;
    updateObj.content = req.body.content;
    commentSchemaModel.findOne({_id: req.body.commentID})
      .then(doc => {
        doc.listOfComment.push(updateObj);
        doc.save().then(value => {
          let result = {
            status: "留言修改成功",
            content: value
          }
          res.json(result);
        })
          .catch(error => {
            let result = {
              status: "留言修改失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
      })
  }

  deleteComment(req, res, next) {
    commentSchemaModel.findOne({_id: req.body.commentID})
      .then(doc => {
        doc.delete = true;
        articleSchemaModel.findOne({_id: doc.articleID})
          .then(val => {
            let temp = val.comment.indexOf(req.body.commentID);
            val.comment.splice(temp, 1);
            val.save().then(value => {
              let result = {
                status: "刪除成功",
                content: value
              }
              res.json(result);
            })
              .catch(error => {
                let result = {
                  status: "刪除失敗",
                  err: "伺服器錯誤，請稍後再試"
                }
                res.json(error)
              })
          })
        doc.save().then(value => {
          let result = {
            status: "刪除成功",
            content: value
          }
          res.json(result);
        })
          .catch(error => {
            let result = {
              status: "刪除失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
      })
  }
}

