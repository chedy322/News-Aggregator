// this collection is for recommended articles
const mongoose=require('mongoose')
const Recommended=new mongoose.Schema({
UserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
Articled:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Article",
    required:true

},
score:{
    type:Number,
    required:true
},
reason:{
    type:String,
}
},{
    timestamps:true
})


module.exports=mongoose.model('Recommended',Recommended)