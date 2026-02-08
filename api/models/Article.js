const { default: mongoose } = require("mongoose");

const Article=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    summary:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    url:{
        type:String,
    },
    image:{
        type:String,
    },
    source:{
        type:String,
    },
    category:{
        type:String,
        enum:["technology","sports","politics","science","education"]
    },
    tags:{
        type:[String]
    },
    publishedAt:{
        type:Date,
        default:Date.now,
    },
    scrapedAt:{
        type:Date
    },
    views:{
        type:Number,
        default:0
    },
    number_saved:{
        type:Number,
        default:0,
        min:0
    },
 
},{
    timestamps:true
})

module.exports=mongoose.model("Article",Article)