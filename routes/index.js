const express = require('express');
const router = express.Router();
const User = require('../controllers/users_controller');
const Article = require('../controllers/article_controller');

let user = new User();
let article = new Article();

router.post('/insert', user.insertUser); //create(register)

router.post('/login', user.loginUser);  //login

router.get('/search', user.retrieveUser); //read

router.put('/update', user.updateUser); //update

router.post('/add_article', article.postArticle); //post article

router.put('/update_article', article.updateArticle); //update article

router.get('/search_article', article.searchArticle); //get all of the article

router.post('/search_articleByID', article.searchArticleByID); //get the article by ID

router.put('/delete_article', article.deleteArticle); //delete


module.exports = router;
