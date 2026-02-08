const User=require('../models/user')
const Password_token=require('../models/reset_password')
const authToken=require('../models/authToken')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const AppError=require('../src/Error')
const passport=require('passport')
const GoogleStrategy = require('passport-google-oidc');
// to do : add google sign in 
// to do :fix the refresh token and access token in google authentication
const {main}=require('../service/email')
const crypto=require('crypto')
const { frontend_url } = require('../src/variables')

// function for validating password
function validate_password_error(given_password){
    
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (given_password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
            }
if (!PASSWORD_REGEX.test(given_password)) {
    return "Password must include uppercase, lowercase, number, and a special character.";
}
return null;
}


const register=async (req,res,next)=>{
    try{
        const {email,password,username}=req.body
        if(!email||!password||!username){
            return next(new AppError(400,"Please fill the form"))
            // return res.status(400).json({message:'Please fill the form'})
        }
        // Password security check
        const not_valid_password=validate_password_error(password)
        if(not_valid_password){
             return next(new AppError(400,not_valid_password))
        }
        // check if user already registered
        const existingUser=await User.findOne({email})
        if(existingUser){
            return next(new AppError(400,"Email already exists.Please login."))
            // return res.status(400).json({message:'Email already in use'})
        }
        // register user
        await User.create({email,password,username})
        return res.status(201).json({message:'User created successfully'})
    }catch(err){
        console.log(err)
        next(err)
    }
}
const login=async (req,res,next)=>{
    try{

        const {email,password}=req.body
        if(!email||!password){
            return next(new AppError(400,"Please enter both email and password"))
            // return res.status(400).json({message:'Please enter both email and password'})
        }
        // check if user doesn't exist
        const existing_user=await User.findOne({email})
        if(!existing_user){
            return next(new AppError(400,"Email does not exist"))
            // return res.status(400).json({message:'Email does not exist'})
        }
        // check if user signed in with third party
        if(!existing_user.password){
            return next(new AppError(400,"You use third party authentication"))
        }
        // check if password is correct/incorrect
        const isMatch=await existing_user.compare_password(password)
        if(!isMatch){
            return next(new AppError(400,"Incorrect email or password"))
            // return res.status(400).json({message:'Incorrect email or password'})
        }
        // sending back user metadata to store in LocalStorage
        const user_data={
            id:existing_user._id,
            email:existing_user.email,
            username:existing_user.username,
             role:existing_user.role
        }
        // create access token and store it in the cookie
        const token=await existing_user.createjwt();
        // create refresh token related to the user_id
        const refresh_token_data=await existing_user.createRefreshToken()
        //store the refresh token in the db 
        await authToken.create({
            user_id:existing_user._id,
            token:refresh_token_data,
            expiryDate:new Date(Date.now()+24*60*60*1000)
        })
        res.cookie('refreshtoken',refresh_token_data,{maxAge:24*60*60*1000,httpOnly:true})
        res.cookie('access_token',token,{maxAge:15*60*1000,httpOnly:true})
        // adding secure in production to secure send cookie as HTTPS
        return res.status(200).json({user_data})
    }catch(err){
        console.log(err)
        next(err)
    }
}
// would be better to organize this function by adding middleware insteead of all in the function
const create_refreshtoken=async (req,res,next)=>{
    try{
const refreshtoken=req.cookies.refreshtoken;
console.log("refresh token",refreshtoken)

// const {_id:user_id}=req.user
// console.log('user id',user_id)
if(!refreshtoken){
    return next(new AppError(400,"Unauthorized"))
    // return res.status(400).json({message:'Unauthorized1'})
}
// look for the user based on his refreshtoken from the db
const token_info=await authToken.findOne({
    token:refreshtoken
})
if(!token_info){
    return next(new AppError(400,"Unauthorized"))
}
const user_id=token_info.user_id;
// const exisitng_token=await authToken.findOne({token:refreshtoken,user_id})
// if(!exisitng_token){
//     console.log('1')
//     return next(new AppError(400,"Unauthorized"))
//     // return res.status(400).json({message:'Unauthorized2'})
// }
const unvalid_token=await token_info.verifytoken()
// error here change to this !unvalid_token
// ---------------check for this part after 15 min
if(unvalid_token){
    console.log('2')
    return next(new AppError(400,"Token expired"))
    // return res.status(400).json({message:'Token expired'})
}
jwt.verify(refreshtoken,process.env.PRIVATE_KEY,async (err,decoded)=>{
    // return next(new AppError(400,"Unauthorized"))
    if(err) return next(new AppError(400,"Unauthorized"))
    // create new access token
// check this 
// console.log(decoded)
// change decoded-->_id:decoded._id etc...
console.log("decoded",decoded)
   const new_accesstoken=jwt.sign({ _id:decoded._id,
    username:decoded.username,
     role:decoded.role,
    email:decoded.email},process.env.PRIVATE_KEY,{
    expiresIn:"15m"
   })
//    create new refresh token
   const new_refreshtoken=jwt.sign({ _id:decoded._id,
    username:decoded.username,
     role:decoded.role,
    email:decoded.email},process.env.PRIVATE_KEY,{
    expiresIn:'1d'})
    // store it db 
    await authToken.create({
        token:new_refreshtoken,
        user_id:user_id,
        expiryDate:new Date(Date.now()+24*60*60*1000)
    })
   res.cookie('access_token',new_accesstoken,{
       maxAge:15*60*1000,httpOnly:true
   })
   res.cookie('refreshtoken',new_refreshtoken,{
    maxAge:24*60*60*1000,httpOnly:true
   })
   return res.status(201).json({message:"Token refreshed successfully"})
})
    }catch(err){
        console.log(err)
        next(err)
    }
}
const logout =async (req,res,next)=>{
    try{
        const {_id:user_id}=req.user
        if(!user_id){
            return next(new AppError(400,"Unauthorized"))
            // return res.status(400).json({message:"Unauthorized"})
        }
        const {refreshtoken,access_token}=req.cookies;
        console.log(req.user)
        if(!refreshtoken ||!user_id||!access_token){
            return next(new AppError(400,"Unauthorized"))
            // return res.status(400).json({message:'Unauthorized'})
        }
        await authToken.findOneAndDelete({token:refreshtoken,user_id})
        res.clearCookie('access_token')
        res.clearCookie('refreshtoken')
        res.status(200).json({message:"Logged out successfully"})
    }catch(err){
        console.log(err)
        next(err)
    }
}
// google token generator controller
const token_generator=async(req,res,next)=>{
    try{
        // getting the token
        const {refresh_token,access_token}=req.user
        console.log("google user token",access_token) 
        // getting user _id
        let {_id:user_id}=req.user.user_data
        console.log("user id from res",req.user)
        // const existing_user=await User.findOne({_id:user_id,provider:"google"})
        const existing_user=await User.findOne({_id:user_id,
              provider:{
                $in:["google"]
              }  
        })
        console.log('exisiting user for token generator', existing_user)
        if(!existing_user){
            return next(new AppError(400,"Unauthorized 12"))
        }
        // here it was commented
        // -----------------------
        // const token=await existing_user.createjwt();
        // // create refresh token related to the user_id
        // const refresh_token_data=await existing_user.createRefreshToken()
        // const refreshToken=await authToken.create({
        //     user_id:existing_user._id,
        //     token:refresh_token_data,
        //     expiryDate:new Date(Date.now()+24*60*60*1000)
        // })
        // -------------------------
        res.cookie('refreshtoken',refresh_token,{maxAge:24*60*60*1000,httpOnly:true})
        res.cookie('access_token',access_token,{maxAge:15*60*1000,httpOnly:true})
        res.redirect(`${frontend_url}/auth/callback`)
        // return res.status(200).json({message:"Token generated for google login"})
    }catch(err){
        console.log(err)
        next(err)
    }
}


// request resetting password for users
const request_password_reset=async(req,res,next)=>{
try{
  const {email}=req.body
    // looking for user data in db
    // NB:For security reason, sending email anyways evenemail doesnt exists
    const existing_user=await User.findOne({email})
    if(!existing_user){
        return res.status(201).json({
        message:"Email sent for resetting password"
    })
    }
    // For security reasons i will let the email being sent even user doesn't exist
    // if(!existing_user){
    //     return next(new AppError(400,"User not found,please register"))
    // }
    // check if user is authenticated with any oAuth and unauthorize him for doing so
    // if(existing_user.provider!="email"){
    //     return next(new AppError(400,"Unauthorized,You use third party authentication"))
    // }
    // sending email to user for resetting password
    // make call for email function
    // ......
    // generate token and saving it
    const reset_token=crypto.randomBytes(64).toString('hex')
    const reset_expires=Date.now() + 3600000;
    await Password_token.replaceOne({user_id:existing_user._id},{
        user_id:existing_user._id,
        token:reset_token,
        expiresAt:reset_expires
    },{
        upsert:true
    })
    // send email
    await main(email,reset_token);
    return res.status(201).json({
        message:"Email sent for resetting password"
    })
}catch(err){
    next(err)
}
}
// this gt request for checking the validity of token and render the page
const password_token_checker=async(req,res,next)=>{
    try{
        const {token}=req.query
        console.log("token",token)
        if(!token){
            return next(new AppError(400,"Token is required"))
        }
        const exisiting_token_data=await Password_token.findOne({
            token,
            expiresAt:{
                $gt:Date.now()
            }
        })
        console.log(exisiting_token_data)
        if(!exisiting_token_data){
            next(new AppError(400,"Invalid Token"))
        }
        return res.status(200).json({
            message:"Authorized to reset password"
        })
    }catch(err){
        console.log(err);
        next(err);
    }
}
// function to hash password
// async function hash_password(given_password){
//     try{
//         const salt=await bcrypt.genSalt(10)
//         const hashed_password=await bcrypt.hash(given_password,salt)
//         return hashed_password  
//     }catch(err){
//         return null
//     }
// }

// to do finish resetting password and sending email with link to reset
// resetting password based on request
// NB:-------------I have to sanitize password before storing in db
const reset_password=async(req,res,next)=>{
    try{
//  take from the url the token in frontend and send it to backend through url endpoint
const {token}=req.query
// send user id with the body
const {new_password}=req.body

if(!token){
    return next(new AppError(400,"Token is required"))
}
// validate security check
const password_error_check=validate_password_error(new_password)
if(password_error_check){
    return next(new AppError(400,password_error_check))
}
// check if token is valid
const exisitng_token_data=await Password_token.findOne({token,expiresAt:{$gt:Date.now()}})
// const user=await User.findOne({reset_token:token,reset_expires:{$gt:Date.now()},user_id})
if(!exisitng_token_data){
    return next(new AppError(400,"Invalid token"))
}
// if token is valid, we can reset password
// user.password=new_password;
// bcrypt the password
const hashed_password=await hash_password(new_password)
if(!hashed_password){
   return next(new AppError(400,"Opps!Something went wrong"))
}
// await User.findOneAndUpdate({_id:exisitng_token_data.user_id},{
//     password:hashed_password
// },{
//     new:true
// })
let existing_user=await User.findOne({_id:exisitng_token_data.user_id})
existing_user.password=hashed_password
await existing_user.save()
return res.status(201).json({
    message:"Password reset successfully"
})

}catch(err){
        console.log(err)
        next(err)
    }
}
// ---------------------------------------
// note:
// concerning the reset form,i have to make the link href same as the frontned url


module.exports={register,login,create_refreshtoken,logout,token_generator,reset_password,request_password_reset,reset_password,password_token_checker}