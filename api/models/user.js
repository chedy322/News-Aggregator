const { default: mongoose } = require("mongoose");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
// to do make saved documents as subdoc
const User=new mongoose.Schema({
    google_id:{
        type:String,
        unique:true,
        sparse:true,
        required:function(){
            return this.provider==="google"
        }
    },
    // 0 for user and 1 for admin
    role:{
        type:Number,
        enum:[0,1],
        default:0
    },
    username:{
        type:String,
        required:true,
        trim:true,
    },
    provider:{
        type:[String],
        required:true,
        default:["email"],
        enum:["google","email"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:function(){
            return this.provider==="email"
        },
    },
    preferences:{
        type:[String],
        default:[],
    },
    savedArticles:[
        {
            articleId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Article"
            },
            savedAt:{
                type:Date,
                default:Date.now
                // probably add default here
            }
        }
    ],
    image:{
        type:String,
    },
  
// tihinking about adding viewed articles and how many times
// viewed_articles:[
//     {
//         articleId:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"Article"
//         },
//         number_of_time:{
//             type:Number,
//             default:0
//         },
//         viewed_at:{
//             type:Date,
//             default:Date.now
//         }
//     }
// ]

},{
    timestamps:true
})




// bcryting the password before registering it in he db 
User.pre('save',async function(next){
    try {
        // Only hash the password if it has been modified (or is new)
        if (!this.password||!this.isModified('password')) return next();
    
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
})


User.methods.compare_password=async function(password){
    const match=await bcrypt.compare(password,this.password)
    return match
}

User.methods.createjwt=function(){
    var token=jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        role:this.role
    },process.env.PRIVATE_KEY,{
        expiresIn:'15m'
    })
    return token
}
User.methods.createRefreshToken=async function(){
    const refreshToken=jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
         role:this.role
        },process.env.PRIVATE_KEY,{
            expiresIn:'1d'
    })
    return refreshToken
}
module.exports=mongoose.model('User',User)