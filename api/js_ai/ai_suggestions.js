// this file for suggesting data to user based on his preferences
// read data from db mongoose and arrange it
// Nb data already cleaned to be stored in db
// ---To do add filtering option by score and published at
// To do make api for this
// migrate to weviate
const Articles=require('../models/Article')
// importing tools for storing embeddings
const {Chroma}=require('@langchain/community/vectorstores/chroma')
// const { connect_to_db } = require('../db/db')
// import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
const  { HuggingFaceTransformersEmbeddings } =require("@langchain/community/embeddings/huggingface_transformers");
const { getClient } = require('../db/vectordb');


const model = new HuggingFaceTransformersEmbeddings({
model: "Xenova/all-MiniLM-L6-v2",
});
// to do fix the embedding function and use hg embeding
//fix the recommendation function also
async function highlevelembeddging(article){
    try{

    }catch(err){
        console.log(err)
        return null
    }
}

async function get_articles(){
    try{
        const articles=await Articles.find({})
        return articles
    }catch(err){
        console.log(err)
        return null
    }
}


//  let client=getClient();
// console.log("weviate client ",client)
// const news = client?.collections.use('News_Articles');


// vector embedding the data 
// use huggingface to vectorize the data articles
// npm i  @xenova/transformers
// nb since i have many docs in db ,i can run the index on it s own first
const index_articles=async ()=>{
    try{
        const articles=await get_articles();
        let client=getClient();
        const news = client.collections.use('News_Articles');

        const documents = articles.map(article => {
            // Combine all relevant text fields for a robust embedding
            const pageContent = `${article.title}. ${article.summary}. ${article.content}`;
            
            return {
                pageContent: pageContent,
                title: article.title,
                summary: article.summary,
                metadata: { 
                    id: article._id.toString(), 
                    source: article.source,
                    category: article.category
                }
            };
        });
            // store in vectordb
            const result = await news.data.insertMany(documents);
            if (result.hasErrors) {
            console.error("Some documents failed to index", result.errors);
            }
            console.log('Insertion response: ', result);
            let ids=result.allResponses;
            // to unconmment in future 
            console.log(`Successfully indexed ${ids.length} documents.`);
            console.log(`Orignal articles count: ${articles.length}`);
            return ids
    }catch(err){
        console.log(err)
        return null
    }
}
// index by one article
// whenever a post is created the doc is indexed 
const index_article=async(given_article)=>{
    try{
        let client=getClient();
console.log("weviate client ",client)
const news = client?.collections.use('News_Articles');
        // Combine all relevant text fields for a robust embedding
            const pageContent = `${given_article.title}. ${given_article.summary}. ${given_article.content}`;
            
            const document={
                 pageContent: pageContent,
                title: given_article.title,
                summary: given_article.summary,
                metadata: { 
                    id: given_article._id.toString(), 
                    source: given_article.source,
                    category: given_article.category
                }
            };
            // store in vectordb
            // NB : we added hgface to vector_store which will call the hgface for embdedding the doc
            // const id = await vector_store.addDocuments([document]); 
            const result = await news.data.insertMany(document);
            console.log('Insertion response: ', result);
            console.log(`Successfully indexed ${id.length} documents.`);
            let id=result.allResponses[0].id
            return id
    }catch(err){
        console.log(err)
        return null
    }
}


const retreive_articles=async(user_preferences)=>{
    try{
        let client=getClient();
        const news = client.collections.use('News_Articles');
        if(!Array.isArray(user_preferences)){
            user_preferences=[user_preferences]
        }
         const list_of_promises=user_preferences.map((user_preference)=>news.query.nearText(user_preference, {
        limit: 10,
        alpha: 0.5,
        filter:{
             path: ["metadata", "category"],
        operator: "Equal",
        valueText: user_preference
        }
        }))
        const result=await Promise.all(list_of_promises)
        
        // we need to flatten the array
        const all_docs=result.flat()
        let unique_ids=new Set()
        all_docs.forEach((item) => {
            item.objects.forEach((obj) => {
                let mongoId=obj.properties.metadata.id
                if (mongoId) unique_ids.add(mongoId);
            }
        )
        });
        const articles=await Articles.find({
        _id: { $in: Array.from(unique_ids) }
        })
        return articles
    }catch(err){
    console.log(err)
}
}


 async function recommend_articles(user_preference){
     
     const indexed_ids=await index_articles()
    if (indexed_ids && indexed_ids.length > 0){
        similar_articles=await retreive_articles(user_preference)
        return similar_articles
    }
}


module.exports={index_articles,retreive_articles,index_article,recommend_articles}
// recommend_articles("politics")