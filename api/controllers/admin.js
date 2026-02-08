// admin responsible for creating post and seing all users and deleting/banning them
// ai will make the categorazation for the admin /with extra feature which is aggreagtaion for him from website

const { index_article } = require('../js_ai/ai_suggestions')
const classify_article  = require('../js_ai/classify')
const Articles = require('../models/Article')
const User=require('../models/user')
const AppError = require('../src/Error')
const { handle_image_upload } = require('../src/helper')
// -------To Do: Next is create the ai for categorazation
// -------Check for 0 for user and 1 for admin in the middleware and stategy to impliment it 
// adming creating post and clssify them
// seeing users and deleting them
// ------------To do in the future for deleting user and permanently banning them
const get_users=async (req,res,next)=>{
 try{
    const users=await User.find({})
    return res.status(201).json({
        users
    })
 }catch(err){
    console.log(err)
    next(err)
 }
}

const get_user_for_admin=async(req,res,next)=>{
    try{
        const {id}=req.params
        if(!id){
            next(AppError(400,"Id is required"))
        }
        const user=await User.findOne({
            _id:id
        })
        return res.status(201).json({
            user
        })
    }catch(err){
        console.log(err)
        next(err)
    }
}

// creating post
const create_post=async(req,res,next)=>{
    try {
        const {
            title,
            summary,
            content,
            url,
            source,
            tags,
            publishedAt,
            scrapedAt,
            views,
        } = req.body;
       console.log(req.file)
        let image=null
        if (!title || !summary || !content) {
            return res.status(400).json({ message: "Title, summary, and content are required." });
        }
        if(req.file){
            // substract the image name from path 
            image_name=req.file.path.split('/').pop()
            public_id=req.file.filename
            // upload image to cloudinary
            const image_url=await handle_image_upload(image_name,public_id)
            image=image_url
        }
    console.log("image url",image)
        // use the llm created to create category here
        const generated_category=await classify_article(content)
        console.log("category",generated_category)
        category=generated_category.toLowerCase()
        const newArticle = new Articles({
            title,
            summary,
            content,
            url,
            image,
            source,
            category,
            tags,
            publishedAt: publishedAt || new Date(),
            scrapedAt: scrapedAt || new Date(),
            views: views || 0, 
        });
        await newArticle.save();
        // index the post so we can add to vector db
        await index_article(newArticle)
        
        // return response
        return res.status(201).json({
            message: "Article created successfully",
            article: newArticle
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
// deleting posts
// to do add deleting for vectorized articles
const delete_post=async(req,res,next)=>{
    try{
        const {id}=req.params
        console.log(req.params)
        if(!id){
            next(AppError(500,"Id is required"))
        }
        await Articles.findOneAndDelete({
            _id:id
        })
        return res.status(204).json({
            messgae:"Post deleted succesfully"
        })
    }catch(err){
        console.log(err)
        next(err)
    }
}

module.exports={get_user_for_admin,get_users,create_post,delete_post}