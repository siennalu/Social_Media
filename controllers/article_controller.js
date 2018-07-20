const articleSchemaModel = require('../models/article_model.js');

module.exports = class Article {
  postArticle(req, res, next) {
    const images = req.files;
    let article = new articleSchemaModel({
      Title: req.body.title,
      Category: req.body.category,
      Content: req.body.content,
      Sender: req.body.name,
      Images: images,
      Date: onTime(),
    });

    article.save()
      .then(article => {
        article.image = images;
        let result = {
          status: "發文成功",
          content: article
        }
        res.json(result)
      })
      .catch(error => res.json(error));
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

