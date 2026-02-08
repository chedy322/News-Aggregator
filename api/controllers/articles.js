const AppError=require('../src/Error')
const user=require('../models/user')
const Articles=require('../models/Article');
const { retreive_articles } = require('../js_ai/ai_suggestions');
// to be deleted and added to the admin route only for test purpose(talking about creating post)
// ------------------------>Attention:should handle the diff from min/maj in some cases<--------------------------------

// public routes
// get all articles
// now i should make articles search based on user most viewed articles 
// algorithm:for showing articles;
// Formula:AVG=VIEWS*1.5+save*2-Age_penalty*0.1
// to do fix aggregate and find not together
// test the aggregate function

const check_saved_article=async(article_id,user_id,next)=>{
    try{
        const saved_article=await user.findOne({
            _id:user_id,
            'savedArticles.articleId':article_id
        }).select("_id").lean()
        return !!saved_article
    }catch(err){
        console.log(err)
        next(err)
    }
}
// this  function returns all_saved_articles_ids as an array of object of key "articleId"
const get_saved_articles_ids=async(user_id,next)=>{
    try{
         const saved_articles_ids=await user.findOne({
            _id:user_id,
        }).select("savedArticles.articleId").lean()
        let articles_ids=[]
        for (let article_data of saved_articles_ids.savedArticles){
            articles_ids.push(article_data.articleId.toString())
        }
        return articles_ids;
    }catch(err){
        console.log(err)
        next(err)

    }
}
// add article saved status to seing all articles as well
const get_articles=async(req,res,next)=>{
    try{
        // get the filter for category from url
        const {category}=req.query;
        const query={}
        if(category){
            query.category=category
        }
        // add the aggreagate by making the formula then sort them
        // the aggregate will operate the algorithm,return the field we make them 1
        // add the category field if the user specified it
        let articles=await Articles.aggregate([
            // first stage
            {
            $project:{
                title:1,
                summary:1,
                category:1,
                publishedAt: 1,
                views:1,
                number_saved:1,
                image:1,
            },
        },
        // filter stage
        {
            $match:query,
        },
        // third stage
        {
            $addFields:{
                trending_score: {
                                    $add: [
                                        { $multiply: ["$views", 1.5] },
                                        { $multiply: ["$number_saved", 2] },
                                        { $multiply: [{ $subtract: ["$$NOW", "$publishedAt"] }, -0.1] }
                                    ]
                                },
                age_penalty:{
                    $divide:[
                    {
                        $subtract: ["$$NOW", "$publishedAt"]
                    },
                1000*60*60*24]
                }
            }
        },
        // forth stage and age_penalty
        {
            $sort:{
                trending_score: -1,
            }
        }
    ])
    // return all articles saved by the user
    if(req?.user){
        // return all saved articles ids
        let saved_articles_ids=await get_saved_articles_ids(req.user._id,next)
        // loop through all articles and check saved_article and return it with article _data
        articles=articles.map((article)=>{
            let article_is_saved=false
           if(saved_articles_ids.includes(article._id.toString())){
                article_is_saved=true
           }
           let  {number_saved,views,trending_score,age_penalty,...article_data}=article
           return{
            ...article_data,
            article_is_saved
           }
        })
         return res.status(200).json({
            articles
        })
       
    }
    // return all articles_data with exluding mentioned fields
    articles=articles.map((article)=>{
        let article_is_saved=false;
        let  {number_saved,views,trending_score,age_penalty,...article_data}=article
        return {
            ...article_data,
            article_is_saved
        }
    })
  
        return res.status(200).json({
            articles
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

const get_saved_articles_helper=async(user_id,next)=>{
    try{
        let articles=await user.findOne({
               _id:user_id
           })
           .populate(
               {
               path:'savedArticles.articleId',
               select:'title category summary image publishedAt '
               }
           ).sort({
               createdAt:-1
           }).lean()
           return articles.savedArticles
    }catch(err){
        console.log(err)
        next(err)
    }
}


// private and public
// get articles by id
// since this route is before middleware req.user won't work
const get_article=async(req,res,next)=>{
    try{
        const {id}=req.params;
        // const article=await Articles.findOne({
        //     _id:id,
        // })
        const article=await Articles.findOneAndUpdate({
            _id:id
        },{
            $inc:{
                views:1
            }
        },{
            new:true
        }).lean()
        if(!article){
            return next(new AppError('Article not found',404))
        }
        let article_is_saved=false;
        if(req?.user){
            article_is_saved=await check_saved_article(id,req.user._id,next)
        }
        // return the article and the status of it:saved or not
        return res.status(200).json({
            ...article,
            article_is_saved
        })
    }catch(err){
        console.log(err)
        next(err)
    }
}
// private route
// get request:get saved articles
const get_saved_articles=async(req,res,next)=>{
    try{
        // get the user id
        const {_id:user_id}=req.user;
        if(!user_id){
            return next(new AppError('User not found',400))
        }
        // get the saved articles
        let articles=await get_saved_articles_helper(user_id,next)
        articles=articles.map((article)=>{
            return{
                ...article.articleId,
                article_is_saved:true
        }
        })
        // look for articles
        return res.status(201).json({
            articles
        })
    }catch(err){
        console.log(err)
        next(err)
    }
}
// private route
// get personalized articles based on preferences with ai
const get_personalized_article=async (req,res,next)=>{
    try{
        // get user id
        const {_id:user_id}=req.user
        console.log(user_id)
        if(!user_id){
            return next(new AppError('Unauthorized',400))
        }
        // get user preferences from db then fetch the articles based on that even if it s an array
        const user_preferences_result=await user.findOne({
            _id:user_id
        }).select('preferences')
        // be carefull in frontend for this ,need to be handled seperately so when if we want to render msg
        // otherwise send back empty array and handle the message in the frontend just like i did
        if(!user_preferences_result.preferences){
            return res.status(404).json({
                articles:[]
            })
        }
        const user_preferences=user_preferences_result.preferences;
        // fetch all the articles based on the prefenerces with sorting from new to old
        // here we return with the same items as general so the frontend component can be reused in this get req
        const suggested_articles=await retreive_articles(user_preferences)
        // check for all saved articles ids 
        let saved_articles_ids=await get_saved_articles_ids(user_id,next)
        const filtered_suggested_articles=suggested_articles.map((article)=>{
            // check if the article is saved by user
            article_is_saved=false
            if(saved_articles_ids.includes(article._id.toString())){
                article_is_saved=true
            }
            return{
        _id:article._id,
                title:article.title,
                summary:article.summary,
                category:article.category,
                publishedAt:article.publishedAt,
                image:article.image,
                article_is_saved
            }
        })
            // return the articles
            return res.status(200).json({
                articles:filtered_suggested_articles
            })
    }catch(err){
        console.log(err)
        next(err)
    }
}
// private route
// post request:save articles
// to do here save article
const save_article=async(req,res,next)=>{
    try{
        const{_id}=req.user
        if(!_id){
            return next(new AppError('User not found',400))
        }
        const articleId=req.body.articleId
        console.log("article Id",articleId)
        if(!articleId){
            return next(new AppError('Article Id missing',400))
        }
        // add to check if article exists in db or no
        // --to do   the above remark
        // check if article is already saved then unsave it
        // check the logic for the find one
        const article=await user.findOne({
            _id,
            savedArticles:{
                $elemMatch:{
                    articleId
                }
                }
        })
        // const article=await check_saved_article(articleId,_id,next)
        console.log("The article ",article )
        if(!article){
            // save the article
            await user.findOneAndUpdate({
                _id
            },{
                $push:{
                    savedArticles:
                    {
                        articleId
                    }
                }
            },{
                new:true
            })
            // update number_saved of people to this article
            // here i only decrease the article if it is number_saved>0
            // so it won't be negative value
            // because if it is 0 it is already mi, value
            await Articles.findOneAndUpdate({
                _id:articleId,
                number_saved:{$gt:0}
            },{
               $inc:{
                number_saved:-1   
            } 
            })
            return res.status(201).json({
                message:'Article saved successfully',
                article_is_saved:true
            })
        }
        
        await user.findOneAndUpdate({
            _id
        },{
            $pull:{
                savedArticles:{
                    articleId
                }
            }
        },{
            new:true
        })
        // increase the value of number_saved by one
            await Articles.findOneAndUpdate({
                _id:articleId,
            },{
               $inc:{
                number_saved:1
            } 
            })
            return res.status(201).json({
                message:'Article unsaved successfully',
                article_is_saved:false
            })
    }catch(err){
        console.log(err)
        next(err)
    }
}

// POST:save user preferences(sport,politics,etc...)
const save_preference=async(req,res,next)=>{
    try{
        const {_id:user_id}=req.user
        if(!user_id){
            return next(new AppError('User not found',400))
        }
        // should be an array 
        let {preference}=req.body
        // set the array if not an array
        if(!Array.isArray(preference)){
            preference=[preference]
        }
        if(!preference){
            return next(new AppError('Preference not specified',400))
        }
        // make all fields lower case
        preference=preference.map(item=>item.toLowerCase())
        // now update the preferences status in user db
        await user.findOneAndUpdate({
            _id:user_id
        },{
            $set:{
                preferences:[...preference]
            }
        },{
            new:true
        })
        return res.status(200).json({
            message:'Preferences saved successfully',
        })
    }catch(err){
        console.log(err)
        next(err)
    }
}

// const get_preference
module.exports={save_article,get_saved_articles,get_article,get_articles,save_preference,get_personalized_article}