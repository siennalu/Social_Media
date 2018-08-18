const commentSchemaModel = require('../models/comment_model.js');
const articleSchemaModel = require('../models/article_model.js');
const formidable = require('formidable');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dzzdz1kvr',
  api_key: '154653594993876',
  api_secret: 'pzNTrLGj6HJkE6QGAUeJ2cyBxAE'
})

module.exports = class Comment {

  commentArticle(req, res, next) {
    let commentForArray = [];
    let commentForObject = {};
    let photoObj = {};
    let videoObj = {};
    let seconds = Math.round(Date.now() / 1000);

    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    let comment = new commentSchemaModel({
      articleID: fields.articleID,
      commenterID: fields.commenterID,
      listOfComment: [],
      likes: [],
      delete: false
    });

      commentForObject.time = seconds;
      commentForObject.content = fields.content;
      commentForArray.push(commentForObject);
      comment.listOfComment = commentForArray;
      comment.numberOfLikes = comment.likes.length;

      //留言圖片及影片
      if (files.image != null && files.video != null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType;
          photoObj.link = resultPhotoUrl.secure_url;
          comment.mediaLink.push(photoObj);

          cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
            videoObj.type = fields.videoType;
            videoObj.link = resultVideoUrl.secure_url;
            comment.mediaLink.push(videoObj);
            comment.save()
              .then(comments => {
                let result = {
                  status: "圖片和影片留言成功",
                  article: comments
                }
                res.json(result)

                articleSchemaModel.findOne({_id: fields.articleID})
                  .then(doc => {
                    console.log(doc)
                    console.log(result.article._id)
                    doc.comment.push(result.article._id)
                    doc.save()
                      .then(value => {
                      })
                      .catch(error => {
                        console.log(error);
                      })
                  })
              })
              .catch(error => res.json(error));
          }, {resource_type: "video"});
        }, {folder: 'Social_Media/mediaLink'});

        //留言圖片
      }else if (files.image != undefined && files.video == null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType;
          photoObj.link = resultPhotoUrl.secure_url;
          comment.mediaLink.push(photoObj);
          comment.save()
            .then(comments => {
              let result = {
                status: "圖片留言成功",
                article: comments
              }
              res.json(result)

              articleSchemaModel.findOne({_id: fields.articleID})
                .then(doc => {
                  console.log(doc)
                  console.log(result.article._id)
                  doc.comment.push(result.article._id)
                  doc.save()
                    .then(value => {
                    })
                    .catch(error => {
                      console.log(error);
                    })
                })

            })
            .catch(error => res.json(error));
        }, {folder: 'Social_Media/mediaLink'});

        //留言影片
      } else if (files.image == null && files.video != null){
        cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
          videoObj.type = fields.videoType; //mp4
          videoObj.link = resultVideoUrl.secure_url;
          comment.mediaLink.push(videoObj);
          comment.save()
            .then(posts => {
              let result = {
                status: "影片留言成功",
                article: posts
              }
              res.json(result)

              articleSchemaModel.findOne({_id: fields.articleID})
                .then(doc => {
                  console.log(doc)
                  console.log(result.article._id)
                  doc.comment.push(result.article._id)
                  doc.save()
                    .then(value => {
                    })
                    .catch(error => {
                      console.log(error);
                    })
                })
            })
            .catch(error => res.json(error));
        }, {resource_type: "video"});

        //只留言文字
      } else if (files.image == null && files.video == null) {
        comment.save()
          .then(posts => {
            let result = {
              status: "留言成功",
              article: posts
            }
            res.json(result)

            articleSchemaModel.findOne({_id: fields.articleID})
              .then(doc => {
                doc.comment.push(result.article._id)
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
    })
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
    let photoObj = {};
    let videoObj = {};
    let seconds = Math.round(Date.now() / 1000);
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      updateObj.time = seconds;
      updateObj.content = fields.content;

      // 修改圖片和影片
      if (files.image != null && files.video != null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType;
          photoObj.link = resultPhotoUrl.secure_url;
          cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
            videoObj.type = fields.videoType;
            videoObj.link = resultVideoUrl.secure_url;

            commentSchemaModel.findOne({_id: fields.commentID})
              .then(doc => {
                doc.listOfComment = updateObj;
                doc.mediaLink = photoObj;
                doc.mediaLink.push(videoObj);
                doc.save().then(value => {
                  let result = {
                    status: "圖片和影片留言修改成功",
                    content: value
                  }
                  res.json(result);
                })
                  .catch(error => {
                    let result = {
                      status: "圖片和影片留言修改失敗",
                      err: "伺服器錯誤，請稍後再試"
                    }
                    res.json(error)
                  })
              })

          }, {resource_type: "video"});
        }, {folder: 'Social_Media/mediaLink'});

        //修改圖片
      } else if (files.image != undefined && files.video == null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType;
          photoObj.link = resultPhotoUrl.secure_url;

          commentSchemaModel.findOne({_id: fields.commentID})
            .then(doc => {
              doc.listOfComment = updateObj;
              doc.mediaLink = photoObj;
              doc.save().then(value => {
                let result = {
                  status: "圖片留言修改成功",
                  content: value
                }
                res.json(result);
              })
                .catch(error => res.json(error));
            })
        }, {folder: 'Social_Media/mediaLink'});

        //修改影片
      } else if (files.image == null && files.video != null){
        cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
          videoObj.type = fields.videoType;
          videoObj.link = resultVideoUrl.secure_url;

          commentSchemaModel.findOne({_id: fields.commentID})
            .then(doc => {
              doc.listOfComment = updateObj;
              doc.mediaLink = videoObj;
              doc.save().then(value => {
                let result = {
                  status: "影片留言修改成功",
                  content: value
                }
                res.json(result);
              })
                .catch(error => res.json(error));
            })
        }, {folder: 'Social_Media/mediaLink'});

        //修改文字
      } else if (files.image == null && files.video == null) {
        commentSchemaModel.findOne({_id: fields.commentID})
          .then(doc => {
            doc.listOfComment = updateObj;
            doc.save().then(value => {
              let result = {
                status: "留言修改成功",
                content: value
              }
              res.json(result);
            })
              .catch(error => res.json(error));
          })
      }
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

