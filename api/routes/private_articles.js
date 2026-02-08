// ------><------
const express=require('express')
const route=express.Router();
const {save_article,get_saved_articles,get_article,get_articles,save_preference,get_personalized_article}=require('../controllers/articles');
const authorize = require('../middleware/authorize');
const { create_post, delete_post } = require('../controllers/admin');
const multer  = require('multer')
const path=require('path');
const fs=require('fs')
// adding multer for image upload by the admin while creating posts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const UPLOAD_DIR = path.join(__dirname,"..", '/articles_images');
    if(!fs.existsSync(UPLOAD_DIR)){
        fs.mkdirSync(UPLOAD_DIR,{recursive:true});
    }
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

route.route('/bookmarks').get(authorize([0]),get_saved_articles).post(authorize([0]),save_article)
route.route('/preference').post(authorize([0]),save_preference)
// route.route('/preference').get(save_preference)
route.route('/personalized').get( authorize([0]),get_personalized_article)
// for admin
route.route('/create_post').post(authorize([1]),upload.single('articleImage'),create_post)
route.route('/delete_post/:id').delete(authorize([1]),delete_post)
module.exports=route