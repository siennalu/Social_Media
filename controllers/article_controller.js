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
    let seconds = Math.round(Date.now() / 1000);
    let article = new articleSchemaModel({
      listOfContent: [],
      delete: false
    });
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      contentForObject.time = seconds;
      contentForObject.content = fields.content;
      contentForArray.push(contentForObject);
      article.listOfContent = contentForArray;
      article.numberOfLikes = article.likes.length;
      //console.log(files.image.path)
      cloudinary.uploader.upload(files.image.path, function (result) {
        article.mediaLink = result.secure_url;
        article.save()
          .then(posts => {
            let result = {
              status: "發文成功",
              article: posts
            }
            res.json(result)
          })
          .catch(error => res.json(error));
      }, {folder: 'Social_Media/mediaLink'});
    })
  }

  updateArticle(req, res, next) {
    let updateObj = {};
    let seconds = Math.round(Date.now() / 1000);
    updateObj.time = seconds;
    updateObj.content = req.body.content;
    articleSchemaModel.findOne({_id: req.body.articleID})
      .then(doc => {
        doc.listOfContent.push(updateObj);
        if(req.body.category !== undefined) doc.category = req.body.category;
        if(req.body.title !== undefined) doc.title = req.body.title;
        doc.save().then(value => {
          let result = {
            status: "發文修改成功",
            content: value
          }
          res.json(result);
        })
          .catch(error => {
            let result = {
              status: "發文修改失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
      })
  }

  async searchArticle(req, res, next) {
    let resultArray = []
    let article = await articleSchemaModel.find({delete: false}).exec();
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

  async searchArticleByID(req, res, next) {
    let articleArray = []
    let articleOne = await articleSchemaModel.findOne({delete: false, _id: req.body.articleID}).exec()
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