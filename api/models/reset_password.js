const mongoose=require("mongoose")


const password_token=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    token:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})


module.exports=mongoose.model("Password_token",password_token)