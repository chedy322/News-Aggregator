const express=require('express')
const router=express.Router()
const passport=require('passport')
const {login,register,logout,token_generator,request_password}=require('../controllers/authenticate')
const  {create_refreshtoken}=require('../controllers/authenticate')

router.route('/login').post(login)
router.route('/register').post(register)
// router.route('/logout').post(logout)
// router.route('/request_password').post(request_password)
router.route('/refresh_token').post(create_refreshtoken)
// google login route
router.get('/login/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ],session:false}
));
router.get('/google/callback', passport.authenticate( 'google', {
     session:false
  }),token_generator);
module.exports=router
