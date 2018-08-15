const userSchemaModel = require('../models/user_model.js');
const verify = require('./service/users_verification.js');
const jwt =require('jsonwebtoken');
const formidable = require('formidable');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dzzdz1kvr',
  api_key: '154653594993876',
  api_secret: 'pzNTrLGj6HJkE6QGAUeJ2cyBxAE'
})




//判斷email格式
const Check = require('./service/users_checks.js');

let check = new Check();

module.exports = class User {
  insertUser(req, res, next) {
    let user = new userSchemaModel({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });

    //檢查是否有重複的使用者
    userSchemaModel.find({email: user.email}, function (err, docs) {
      if (!docs.length) {
            //判斷email格式
            const checkEmail = check.checkEmail(user.email);
            //不符合email格式
            if (checkEmail === false) {
              let result = {
                status: "註冊失敗",
                err: "請輸入正確的Email格式。(如1234@email.com)"
              }
              res.json(result)

              //符合email格式
            } else if (checkEmail === true) {
              user.save()
                .then(value => {
                  let result = {
                    status: "註冊成功",
                    content: value
                  }
                  res.json(result)
                })
                .catch(error => res.json(error));
            }
      } else {
        res.json({
          result: {
            status: "註冊失敗",
            err: "已有重複的Username或Email"
          }
        })
        next(new Error("Email exists!"));
      }
    });
  }

  loginUser(req, res, next) {
    //get client's data
    let user = new userSchemaModel({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });

    userSchemaModel.findOne({email: user.email}, function(err, foundUser) {
      if (!foundUser) {
          res.json({
            result: {
              status: "登入失敗",
              content:"請輸入正確的帳號或密碼"
            }
          })
        }
      else {
        //使用者輸入的密碼與資料庫加密的密碼做比對
          user.comparePassword(req.body.password, foundUser.password,function (err, isMatch) {
            if (isMatch && !err) {
              // Create token if the password matched and no error was thrown
              const token = jwt.sign({
                algorithm: 'HS256',
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                // token一分鐘後過期
                data: foundUser.id
              }, 'secret');
              res.json({
                result: {
                  status: "登入成功",
                  loginMember: "歡迎 " + foundUser.name + " 的登入",
                  token: token
                }
              })
            } else {
              res.json({
                result: {
                  status: "登入失敗",
                  err: "您輸入的帳號或密碼有誤！'"
                }
              })
            }
          });
         }
    });
  }

  retrieveUser(req, res, next) {
    userSchemaModel.find()
    .then(value => res.json(value))
    .catch(error => res.json(error))
  }

  updateUser(req, res, next) {
    const token = req.headers['token'];
    //確定token是否有輸入
    if(check.checkNull(token) === true) {
      res.json({
        err: '請輸入token'
      })
    } else if(check.checkNull(token) === false) {
        verify(token).then(tokenResult => {
            if(tokenResult === false) {
              res.json({
                result: {
                  status: 'token錯誤。',
                  err: '請重新登入。'
              }
            })
          } else {
              const id = tokenResult;
              //console.log(id);
              const userUpdate = new userSchemaModel({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
              });
              userSchemaModel.findOne({ name: userUpdate.name })
                .then(doc => {
                  doc.password = userUpdate.password;
                  doc.email = userUpdate.email;
                  doc.save()
                    .then(value => {
                    let result = {
                      status: "更新資料成功",
                      content: value
                    }
                    res.json(result)
                  })
                    .catch(error => {
                     let result = {
                          status: "更新失敗",
                          err: "伺服器錯誤，請稍後再試"
                        }
                        res.json(error)
                      })
                    })
                }
            })
      }
  }

  uploadImg(req, res, next) {
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
          userSchemaModel.findOne({_id: fields.userID})
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
        }
      }, {folder: 'Social_Media/avatar'});
    })
  }

  uploadBgImg(req, res, next) {
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
          userSchemaModel.findOne({_id: fields.userID})
            .then(data => {
              data.backGroundLink = result.secure_url;
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





