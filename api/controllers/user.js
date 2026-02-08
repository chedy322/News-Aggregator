const fs=require('fs')
const User=require("../models/user")
const AppError=require('../src/Error')
const path=require('path')
const { handle_image_upload } = require('../src/helper')
// this for getting user information

const get_user=async (req,res,next)=>{
    try{
        const {_id}=req.user;
        const user_info=await User.findOne({_id}).lean()
        // delete the password nad any private data
        const{password,savedArticles,provider,createdAt,updatedAt,...user_data}=user_info
        console.log('chedkkk',user_data)
        return res.status(200).json({
            user_data
        })
    }catch(err){
        console.log(err);
        next(err);
    }
}


// this for updating user information based on information(meta data:email,preference etc...)
const update_user_info=async(req,res,next)=>{
try{
    const{_id:user_id}=req.user
    const{username,email}=req.body
    let form={}
    if(username){
        form.username=username
    }
    if(email){
        form.email=email
    }
    if(req.file){
        // // change file name
        // // destruction of req.file
        // const { path:filePath,filename ,originalname } = req.file;
        // // get the ext of image exp jpg etc
        // const original = originalname.split('.');
        // const ext = original[original.length - 1];
        // // defining the new_path name for the image exp image-1252.jpg in uploads
        // // getting the absolute file path to rename
        // const UPLOAD_DIR = path.join(__dirname,"..", 'uploads');
        // const finalAbsoluteFilepath = path.join(UPLOAD_DIR, `${filename}.${ext}`);
        // fs.renameSync(filePath, finalAbsoluteFilepath);
        // // store the path in db
        // // This is the path the BROWSER will use, starting from the static route prefix.
        // const new_path = `uploads/${filename}.${ext}`;
        // form.image=new_path
        image_name=req.file.path.split('/').pop()
        public_id=req.file.filename
        // upload image to cloudinary
        const image_url=await handle_image_upload(image_name,public_id)
        form.image=image_url
        
    }
   

    if(!user_id){
        return next(new AppError("Unauthorized",400))
    }
    // security for not modifying the passworod 
    // if(form.password!=="undefined"){
    //     return next(new AppError('forbidden request',400))
    // }
    // update fields from the form 
   
    await User.findOneAndUpdate({
        _id:user_id
    },{
        $set:{
            ...form
        }
    },{
        new:true
    })
    return res.status(200).json({
       message: "updated succesfully"
    })
}catch(err){
    console.log(err)
    next(err)
}
}




module.exports={get_user,update_user_info}