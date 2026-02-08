import type { LargeNumberLike } from "node:crypto";
import ArticleCard from "~/components/article_card/article_card";

let url="http://localhost:3800/"
// this is for public routes
// articles object
          //  "_id": "690bad1ed69fff6d651ff6e8",
          //   "title": "The Shifting Landscape of Global Energy Diplomacy",
          //   "summary": "How climate goals and energy transition are reshaping alliances and driving geopolitical competition over critical resources like lithium and rare earths.",
          //   "image": "/images/energy-geopolitics.jpg",
          //   "category": "politics",
          //   "publishedAt": "2025-11-05T20:01:34.233Z",
// this for {articles:[]}
interface Article {
  _id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  article_is_saved: boolean;
  publishedAt: string;
}

// Defines the object containing a list of those items
interface ArticlesData {
  articles: Article[];
}

interface articles_type{
  _id:string;
  title:string;
  summary:string;
  image:string;
  category:string;
  article_is_saved:boolean;
  publishedAt:string;
}
export type ArticlesType=articles_type[]
export const get_articles=async():Promise<ArticlesType>=>
{
try{
const response=await fetch(url+"news",{
    method:"GET",
  headers: {
    "Content-Type": "application/json",
  },
 credentials:"include",
})
if(!response.ok){
  const result=await response.json()
  throw new Error(result.message)
}
let result:ArticlesData=await response.json()
console.log("news get req",result)
return result.articles
}catch(err){
    console.log(err)
    throw new Error(err.message)
}
}
// one article example object 
// PLease note that "x" is for identifying the common fields with articles_type
// _id x
      //   "number_saved": 0,
      //   "title": "The Future of AI", x
      //   "summary": "AI is transforming the world.", x
      //   "content": "Artificial Intelligence (AI) is rapidly evolving...",
      //   "url": "https://example.com/ai-news",
      //   "image": "https://example.com/ai.jpg", x
      //   "source": "Tech News",
      //   "category": "Technology", x
      //   "tags": [
      //       "AI",
      //       "Machine Learning",
      //       "Future"
      //   ],
      //   "publishedAt": "2024-03-04T12:00:00.000Z", x
      //   "scrapedAt": "2025-03-04T22:29:05.993Z",
      //   "views": 124,
      //   "recommended": true,
      //   "createdAt": "2025-03-04T22:29:06.018Z",
      //   "updatedAt": "2025-11-11T16:59:55.544Z",
export interface article_type extends articles_type{
        number_saved: number;
        content: string;
        url: string;
        source:string;
        tags:string[];
        scrapedAt: string;
        views: number;
        recommended: boolean;
        createdAt: string;
        updatedAt: string;
      article_is_saved:boolean;
}
export const get_article_by_id=async(id:string):Promise<article_type>=>
{
try{
const response=await fetch(url+"news/"+id,{
    method:"GET",
  headers: {
    "Content-Type": "application/json",
  },
   credentials:"include",
})
if(!response.ok){
  const result=await response.json()
  throw new Error(result.message)
}
let result:article_type=await response.json()
return result
}catch(err){
    console.log(err)
    throw new Error(err.message)
}
}

// these function for private route
interface save_article_interface{
  message:string;
  article_is_saved:boolean;
}

export const mark_favorite_article=async(article_id:string,api_fetch):Promise<save_article_interface>=>{
  try{
const response=await api_fetch(url+"bookmarks",{
    method:"POST",
  headers: {
    "Content-Type": "application/json",
  },
  body:JSON.stringify({
    articleId:article_id
  }),
  credentials:"include",
})
if(!response.ok){
  const result=await response.json()
  throw new Error(result.message)
}
let result=await response.json()
return result
  }catch(err){
    console.log(err)
    throw new Error(err.message)
  }
}

// get personalized articles

export const get_personalized_articles=async(api_fetch)=>{
  try{
const response=await api_fetch(url+"personalized",{
    method:"GET",
  headers: {
    "Content-Type": "application/json",
  },
 credentials:"include",
})
if(!response.ok){
  const result=await response.json()
  throw new Error(result.message)
}
let result:ArticlesData=await response.json()
return result.articles
  }catch(err){
    console.log(err)
    throw new Error(err.message)
  }
}
// reutrn saved articles
export const get_saved_articles=async(api_fetch):Promise<ArticlesType>=>{
  try{
    const response=await api_fetch(url+'bookmarks',{
         method:"GET",
  headers: {
    "Content-Type": "application/json",
  },
 credentials:"include",
    })
    if(!response.ok){
      const result=await response.json()
      throw new Error(result.message)
    }
    const result:ArticlesData=await response.json()
    return result.articles
  }catch(err){
    console.log(err)
    throw new Error(err.message)
  }
}

// save user preferences lie sport,politics etc
export const save_preferences=async(user_preference:string[],api_fetch):Promise<save_article_interface>=>{
  try{
const response=await api_fetch(url+"preference",{
    method:"POST",
  headers: {
    "Content-Type": "application/json",
  },
  body:JSON.stringify({
    preference:user_preference
  }),
  credentials:"include",
})
if(!response.ok){
  const result=await response.json()
  throw new Error(result.message)
}
let result=await response.json()
return result.message
  }catch(err){
    console.log(err)
    throw new Error(err.message)
  }
}


// // store preference in databse
// export const save_preference=async(user_preference_list:string[]):Promise<string>=>{
//   try{

//   }catch(err)
//   {
//     console.log(err)
//     throw new Error(err.message)
//   }
// }