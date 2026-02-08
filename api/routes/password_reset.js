const express=require('express')
const router=express.Router()
const {reset_password,request_password_reset,password_token_checker}=require('../controllers/authenticate')
// this route is for resetting the password
router.route('/check_token').get(password_token_checker)
router.route('/request_password').post(request_password_reset)
router.route('/reset_password').post(reset_password)


module.exports=router;