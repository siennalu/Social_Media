const articleSchemaModel = require('../models/article_model.js');
const commentSchemaModel = require('../models/comment_model.js');
const formidable = require('formidable');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dzzdz1kvr',
  api_key: '154653594993876',
  api_secret: 'pzNTrLGj6HJkE6QGAUeJ2cyBxAE'
})

module.exports = class Article {
  postArticle(req, res, next) {
    let contentForArray = [];
    let contentForObject = {};
    let photoObj = {};
    let videoObj = {};
    let seconds = Math.round(Date.now() / 1000);
    let article = new articleSchemaModel({
      listOfContent: [],
      delete: false
    });
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      article.authorID = fields.authorID;
      article.author = fields.author;
      article.title = fields.title;
      article.category = fields.category;
      article.privacy = fields.privacy;
      contentForObject.time = seconds;
      contentForObject.content = fields.content;
      contentForArray.push(contentForObject);
      article.listOfContent = contentForArray;
      article.numberOfLikes = article.likes.length;
      article.hashTags = fields.hashTags;

      //上傳圖片及照片
      if (files.image != null && files.video != null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType; //png
          photoObj.link = resultPhotoUrl.secure_url;
          article.mediaLink.push(photoObj);

          cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
            videoObj.type = fields.videoType;
            videoObj.link = resultVideoUrl.secure_url;
            article.mediaLink.push(videoObj);
            article.save()
              .then(posts => {
                let result = {
                  status: "圖片和影片發文成功",
                  article: posts
                }
                res.json(result)
              })
              .catch(error => res.json(error));
          }, {resource_type: "video"});
        }, {folder: 'Social_Media/mediaLink'});

        //上傳圖片
      } else if (files.image != null && files.video == null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType; //png
          photoObj.link = resultPhotoUrl.secure_url;
          article.mediaLink.push(photoObj);

          article.save()
            .then(posts => {
              let result = {
                status: "圖片發文成功",
                article: posts
              }
              res.json(result)
            })
            .catch(error => res.json(error));
        }, {folder: 'Social_Media/mediaLink'});

        //上傳影片
      } else if (files.image == null && files.video != null){
        cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
          videoObj.type = fields.videoType; //mp4
          videoObj.link = resultVideoUrl.secure_url;
          article.mediaLink.push(videoObj);

          article.save()
            .then(posts => {
              let result = {
                status: "影片發文成功",
                article: posts
              }
              res.json(result)
            })
            .catch(error => res.json(error));
        }, {resource_type: "video"});
        //只上傳文字
      } else if (files.image == null && files.video == null) {
        article.save()
          .then(posts => {
           // posts.author = fields.author;
            let result = {
              status: "發文成功",
              article: posts
            }
            res.json(result)
          })
          .catch(error => res.json(error));
      }
    })
  }

  updateArticle(req, res, next) {
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
          videoObj.type = fields.videoType; //mp4
          videoObj.link = resultVideoUrl.secure_url;
            articleSchemaModel.findOne({_id: fields.articleID})
              .then(doc => {
                console.log(doc)
                doc.listOfContent.push(updateObj);
                doc.mediaLink.push(photoObj);
                doc.mediaLink.push(videoObj);
                if (fields.privacy != null)  doc.privacy = fields.privacy //文章權限
                doc.save()
                .then(posts => {
                  let result = {
                    status: "圖片和影片修改成功",
                    article: posts
                  }
                  res.json(result)
                })
                .catch(error => res.json(error));
              })
              .catch(error => res.json(error));
          }, {resource_type: "video"});
        }, {folder: 'Social_Media/mediaLink'});

       //修改圖片
      } else if (files.image != null && files.video == null) {
        cloudinary.uploader.upload(files.image.path, function (resultPhotoUrl) {
          photoObj.type = fields.photoType;
          photoObj.link = resultPhotoUrl.secure_url;
        articleSchemaModel.findOne({_id: fields.articleID})
          .then(doc => {
            doc.listOfContent.push(updateObj);
            doc.mediaLink.push(photoObj);
            if (fields.privacy != null)  doc.privacy = fields.privacy //文章權限
            doc.save()
            .then(posts => {
              let result = {
                status: "圖片修改成功",
                article: posts
              }
              res.json(result)
            })
            .catch(error => res.json(error));
          })
          .catch(error => res.json(error));
        }, {folder: 'Social_Media/mediaLink'});

        //修改影片
      } else if (files.image == null && files.video != null) {
        cloudinary.uploader.upload_large(files.video.path, function (resultVideoUrl) {
          videoObj.type = fields.videoType;
          videoObj.link = resultVideoUrl.secure_url;
        articleSchemaModel.findOne({_id: fields.articleID})
            .then(doc => {
              doc.listOfContent.push(updateObj);
              doc.mediaLink.push(videoObj);
              if (fields.privacy != null)  doc.privacy = fields.privacy //文章權限
              doc.save()
                .then(posts => {
                  let result = {
                    status: "影片修改成功",
                    article: posts
                  }
                  res.json(result)
                })
                .catch(error => res.json(error));
            })
            .catch(error => res.json(error));
        }, {folder: 'Social_Media/mediaLink'});

        //修改文字
      } else if (files.image == null && files.video == null) {
        articleSchemaModel.findOne({_id: fields.articleID})
          .then(doc => {
            doc.listOfContent.push(updateObj);
            if (fields.privacy != null)  doc.privacy = fields.privacy //文章權限
            doc.save().then(value => {
              let result = {
                status: "發文修改成功",
                content: value
              }
              res.json(result);
            })
          .catch(error => res.json(error));
          })
      }
    })
  }

  async searchArticle(req, res, next) {
    let resultArray = []
    let article = await articleSchemaModel.find({delete: false, privacy: "public"}).exec();
    for(let i = 0; i <= article.length-1; i++){
      let commentOfArticle = await findComment(article[i].comment);
      let temp = [];
      temp.push(article[i]);
      let articleAndComment = temp.concat(commentOfArticle);
      resultArray.push(articleAndComment);
    }
    let sortedArticle = resultArray.sort(function (b, a) {
      return a[0].listOfContent[a[0].listOfContent.length-1].time - b[0].listOfContent[b[0].listOfContent.length-1].time;
    });
    res.json(sortedArticle);
  }

  async searchArticleByArticleID(req, res, next) {
    let articleArray = []
    let articleOne = await articleSchemaModel.findOne({delete: false, _id: req.body.articleID, privacy: "public"}).exec()
    articleArray.push(articleOne);

    let commentOfArticle = await findComment(articleOne.comment);
    let articleAndComment = articleArray.concat(commentOfArticle);
    res.json(articleAndComment)
  }

  deleteArticle(req, res, next) {
    articleSchemaModel.findOne({_id: req.body.articleID})
      .then(doc => {
        doc.delete = true;
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

  likesArticle(req, res, next) {
    articleSchemaModel.findOne({ _id: req.body.articleID})
      .then(doc => {
        doc.likes.push(req.body.likesPersonID);
        doc.numberOfLikes = doc.likes.length;
        doc.save().then(value => {
          let result = {
            status: "已按讚",
            content: value
          }
          res.json(result);
        })
        .catch(error => {
          let result = {
            status: "按讚失敗",
            err: "伺服器錯誤，請稍後再試"
          }
          res.json(error)
        })
      })
  }

  dislikesArticle(req, res, next) {
    articleSchemaModel.findOne({ _id: req.body.articleID})
      .then(doc => {
        let temp = doc.likes.indexOf(req.body.dislikesPersonID);
        doc.likes.splice(temp, 1);
        doc.numberOfLikes = doc.likes.length;
        doc.save().then(value => {
          let result = {
            status: "收回讚成功",
            content: value
          }
          res.json(result);
        })
          .catch(error => {
            let result = {
              status: "收回讚失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
      })
  }

}

async function findComment(commentArray){
  let result = [];
  for(let e of commentArray){
    let commentItem = await commentSchemaModel.findOne({delete: false, _id: e}).exec();
    result.push(commentItem);
  }
  let sortedComment = result.sort(function (b, a) {
    return a.listOfComment[a.listOfComment.length-1].time - b.listOfComment[b.listOfComment.length-1].time;
  });
  return sortedComment
}