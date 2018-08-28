const userSchemaModel = require('../models/user_model.js');
const articleSchemaModel = require('../models/article_model.js');
const profileSchemaModel = require('../models/profile_model.js');
const formidable = require('formidable');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dzzdz1kvr',
  api_key: '154653594993876',
  api_secret: 'pzNTrLGj6HJkE6QGAUeJ2cyBxAE'
})



module.exports = class Profile {
  searchProfileByUserID(req, res, next) {
    profileSchemaModel.findOne({userID: req.body.userID})
      .then(data => {
        data.totalOfFollowings = data.following.length
        data.totalOfFans = data.fans.length
        res.json(data)
       })
      .catch(error => {
        let result = {
          status: "個人頁面搜尋失敗",
          err: "伺服器錯誤，請稍後再試"
        }
        res.json(error)
      })
  }

  searchArticleByUserID(req, res, next) {
    articleSchemaModel.find({authorID: req.body.userID})
      .then(data => {
        let result = {
          totalOfArticle: data.length, //文章數
          contentOfArticle: data, //所有文章
        }
        res.json(result)
      })
      .catch(error => {
        let result = {
          status: "文章搜尋失敗",
          err: "伺服器錯誤，請稍後再試"
        }
        res.json(error)
      })
  }


 profileSetting(req, res, next) {
   profileSchemaModel.findOne({userID: req.body.userID})
     .then(data => {
       if (req.body.userName != null) {
         data.userName = req.body.userName  //暱稱
         userSchemaModel.findOne({_id: req.body.userID})
           .then(doc => {
             doc.userName = req.body.userName
             doc.save()
               .then (doc => {
                  console.log("modified")
               })
               .catch(error => console.log(error));
           })
           .catch(error => console.log(error));
       }
       if (req.body.aboutMe != null) data.aboutMe = req.body.aboutMe //內文
       //data.authorityOfArticle = req.body.authorityOfArticle //public or private
       if (req.body.colorOfTheme != null) data.colorOfTheme = req.body.colorOfTheme //主題顏色設定
       data.save()
        .then(doc => {
          let result = {
            status: "個人頁面修改成功",
            content: doc
          }
         res.json(result)
        })
        .catch(error => {
          console.log(error)
        })
     })
     .catch(error => {
       let result = {
         status: "個人頁面修改失敗",
         err: "伺服器錯誤，請稍後再試"
       }
       res.json(error)
     })
 }


  friendsFollowing(req, res, next){
    profileSchemaModel.findOne({userID: req.body.userID_followed})  //被追蹤的人
      .then(data => {
        console.log(data)
        //確認是否已存在ID
        if (data.fans.indexOf(req.body.userID_following) == -1) data.fans.push(req.body.userID_following)
        data.save()
          .then(value => {
            console.log("fans created")
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    profileSchemaModel.findOne({userID: req.body.userID_following})   //追蹤的人
          .then(doc => {
            console.log(doc)
            //確認是否已
           if (doc.following.indexOf(req.body.userID_followed) == -1) doc.following.push(req.body.userID_followed)
            doc.save()
              .then(result => {
                console.log("following created")
              })
              .catch(error => console.log(error));
              let result = {
                status: "追蹤成功",
                content: doc
              }
                res.json(result)
          })

          .catch(error => {
            let result = {
              status: "追蹤失敗",
              err: "伺服器錯誤，請稍後再試"
            }
            res.json(error)
          })
  }
  
  //上傳大頭照
  uploadAvatar(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      cloudinary.uploader.upload(files.image.path, function (result) {
        if (!result.secure_url) {
          let result = {
            status: "大頭貼上傳失敗",
            err: "伺服器錯誤，請稍後再試"
          }
          res.json(result);
        }
        else {
          profileSchemaModel.findOne({userID: fields.userID})
            .then(data => {
              data.avatarLink = result.secure_url;
              data.save()
                .then(value => {
                  let result = {
                    status: "大頭貼上傳成功",
                    content: value
                  }
                  res.json(result)
                })
                .catch(error => {
                  let result = {
                    status: "大頭貼上傳失敗",
                    err: "伺服器錯誤，請稍後再試"
                  }
                  res.json(error)
                })
            })
            .catch(error => {
              let result = {
                status: "大頭貼上傳失敗",
                err: "伺服器錯誤，請稍後再試"
              }
              res.json(error)
            })
        }
      }, {folder: 'Social_Media/avatar'});
    })
  }

  //上傳背景照
  uploadBackgroundPhoto(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      cloudinary.uploader.upload(files.image.path, function (result) {
        if (!result.secure_url) {
          let result = {
            status: "背景照上傳失敗",
            err: "伺服器錯誤，請稍後再試"
          }
          res.json(result);
        }
        else {
          profileSchemaModel.findOne({userID: fields.userID})
            .then(data => {
              console.log(data)
              data.backgroundLink = result.secure_url;
              console.log(data)
              data.save()
                .then(value => {
                  let result = {
                    status: "背景照上傳成功",
                    content: value
                  }
                  res.json(result)
                })
                .catch(error => {
                  let result = {
                    status: "背景照上傳失敗",
                    err: "伺服器錯誤，請稍後再試"
                  }
                  res.json(error)
                })
            })
        }
      }, {folder: 'Social_Media/backGroundPhoto'});
    })
  }
}

