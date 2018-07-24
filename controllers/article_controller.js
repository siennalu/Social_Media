const articleSchemaModel = require('../models/article_model.js');

module.exports = class Article {
  postArticle(req, res, next) {
    let contentForArray = [];
    let contentForObject = {};
    let article = new articleSchemaModel({
      author: req.body.name,
      authorID: req.body.authorID,
      title: req.body.title,
      category: req.body.category,
      listOfContent: [onTime(), req.body.content],
      delete: false
    });
    contentForObject.time = onTime();
    contentForObject.content = req.body.content;
    contentForArray.push(contentForObject);
    article.listOfContent = contentForArray;
    article.save()
      .then(posts => {
        let result = {
          status: "發文成功",
          article: posts
        }
        res.json(result)
      })
      .catch(error => res.json(error));
  }
  updateArticle(req, res, next) {
    let updateObj = {};
    updateObj.time = onTime();
    updateObj.content = req.body.content;
    articleSchemaModel.findOne({ _id: req.body.articleID})
      .then(doc => {
        doc.listOfContent.push(updateObj);
        doc.save().then(value => res.json(value));
      })
      .catch(error => {
          let result = {
            status: "發文更新失敗",
            err: "伺服器錯誤，請稍後再試"
          }
          res.json(error)
       })
  }

  searchArticle(req, res, next) {
    articleSchemaModel.find({ delete: false })
      .then(value => {
        res.json(value)
      })
      .catch(error => res.json(error))
  }

  searchArticleByID(req, res, next) {
    articleSchemaModel.findOne({ _id: req.body.articleID })
      .then(value => {
        res.json(value)
      })
      .catch(error => res.json(error))
  }

  deleteArticle(req, res, next) {
    articleSchemaModel.findOne({ _id: req.body.articleID})
      .then(doc => {
        doc.delete = true;
        doc.save().then(value => res.json(value));
      })
      .catch(error => {
        let result = {
          status: "刪除失敗",
          err: "伺服器錯誤，請稍後再試"
        }
        res.json(error)
      })
  }
}

//取得現在時間
const onTime = () => {
  const date = new Date();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();
  const ss = date.getSeconds();

  return [date.getFullYear(), "-" +
  (mm > 9 ? '' : '0') + mm, "-" +
  (dd > 9 ? '' : '0') + dd, " " +
  (hh > 9 ? '' : '0') + hh, ":" +
  (mi > 9 ? '' : '0') + mi, ":" +
  (ss > 9 ? '' : '0') + ss
  ].join('')
}

