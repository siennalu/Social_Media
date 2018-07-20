const express = require('express');
const router = express.Router();
const multer  = require('multer');
const User = require('../controllers/users_controller');
const Article = require('../controllers/article_controller');
const upload = multer({ dest: '../public/uploads/' });

let user = new User();
let article = new Article();
router.post('/insert', user.insertUser); //create(register)

router.post('/login', user.loginUser);  //login

router.get('/search', user.retrieveUser); //read

router.put('/update', user.updateUser); //update

router.post('/upload', upload.any(), user.uploadImage); //upload image

router.post('/article', upload.any(), article.postArticle); //post article


module.exports = router;
