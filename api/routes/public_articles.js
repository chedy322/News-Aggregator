const express=require('express')
const route=express.Router();
const {get_article,get_articles,create_post}=require('../controllers/articles');
const optionalAuth = require('../middleware/optionalAuth');


route.route('/news').get(optionalAuth,get_articles)
route.route('/news/:id').get(optionalAuth,get_article)


module.exports=route