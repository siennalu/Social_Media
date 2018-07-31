const articleSchemaModel = require('../models/article_model.js');

module.exports = class Article {
  postArticle(req, res, next) {
    let contentForArray = [];
    let contentForObject = {};
    let seconds = Math.round(Date.now() / 1000);
    let article = new articleSchemaModel({
      author: req.body.name,
      authorID: req.body.authorID,
      title: req.body.title,
      category: req.body.category,
      listOfContent: [seconds, req.body.content],
      delete: false
    });
    contentForObject.time = seconds;
    contentForObject.content = req.body.content;
    contentForArray.push(contentForObject);
    article.listOfContent = contentForArray;

  }

  updateArticle(req, res, next) {
    let updateObj = {};
    var seconds = Math.round(Date.now() / 1000);
    updateObj.time = seconds;
    updateObj.content = req.body.content;
    articleSchemaModel.findOne({_id: req.body.articleID})
      .then(doc => {
        doc.listOfContent.push(updateObj);
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

  searchArticle(req, res, next) {
    articleSchemaModel.find({delete: false})
      .then(value => {
        let sortedArticle = value.sort(function (a, b) {
          return a.listOfContent[a.listOfContent.length-1].time - b.listOfContent[b.listOfContent.length-1].time;
        });
        sortedArticle.map(function(e) {
          console.log(e.listOfContent[e.listOfContent.length-1].time)
        })
        //console.log(sortedArticle);
        res.json(sortedArticle)
      })
      .catch(error => res.json(error))
  }

  searchArticleByID(req, res, next) {
    articleSchemaModel.findOne({_id: req.body.articleID})
      .then(value => {
        res.json(value)
      })
      .catch(error => res.json(error))
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
        let temp = doc.likes.indexOf(req.body.likesPersonID);
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



