const mongoose=require('mongoose')

const authToken=new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    }

},{
    timestamps:true
})
authToken.methods.verifytoken=function(){
    const expiryDate=this.expiryDate;
    const currentdate=new Date();
    return  expiryDate.getTime()<currentdate.getTime()
}
module.exports=mongoose.model('authToken',authToken)