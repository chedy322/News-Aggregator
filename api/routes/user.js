const express=require('express')
const router=express.Router()
const  {create_refreshtoken,logout}=require('../controllers/authenticate')
const{get_user,update_user_info}=require('../controllers/user')
const { get_users,get_user_for_admin } = require('../controllers/admin')
const authorize = require('../middleware/authorize')
const multer  = require('multer')
const fs=require('fs')
const path=require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const UPLOAD_DIR = path.join(__dirname, '/uploads')
    if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })


// for admin
router.route('/users').get(authorize([1]),get_users)
router.route('/user/:id').get(authorize([1]),get_user_for_admin)
// for both
router.route('/logout').post(authorize([0,1]),logout)
router.route('/me').get(authorize([0,1]),get_user)
router.route('/update_user').post(authorize([0,1]),upload.single('image'),update_user_info)


module.exports=router
