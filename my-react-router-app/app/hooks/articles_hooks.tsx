import { useEffect, useState } from "react";
import { get_article_by_id, get_articles, get_personalized_articles, get_saved_articles, type article_type, type ArticlesType } from "~/utils/Api/Api";
import { useInternalCheckAuth } from "./api_hook";



export const useArticles=()=>{
    const [articles,setArticles]=useState<ArticlesType>([])
    const [error,setError]=useState<string|null>(null)
    const [loading,setLoading]=useState<boolean>(true)
   
    useEffect(()=>{
        async function articles(){
            try{
                const result=await get_articles()
                setArticles(result)
            }catch(err){
                console.log(err)
                setError(err.message)

            }finally{
                setLoading(false)
            }
        }
        articles()
        
    },[])
    return {error,loading,articles}
}


export const useArticle=(article_id:string)=>{
    const [article,setArticle]=useState<article_type>()
    const [error,setError]=useState<string|null>(null)
    const [loading,setLoading]=useState<boolean>(true)
    
    if(!article_id){
        setError('OPPS!Error finding article...')
        return {error}
    }

    useEffect(()=>{
        async function get_article(){
            try{
                const result:article_type=await get_article_by_id(article_id)
                setArticle(result)
            }catch(err){
                console.log(err)
                setError(err.message)
            }finally{
                setLoading(false)
            }
        }
        get_article()
    },[])
    return {loading,error,article}
}


export const useSavedArticles=()=>{
    const [articles,setArticles]=useState<ArticlesType>([])
    const [error,setError]=useState<string|null>(null)
    const [loading,setLoading]=useState<boolean>(true)
    const {api_fetch}=useInternalCheckAuth()
    useEffect(()=>{
        async function articles(){
            try{
                const result=await get_saved_articles(api_fetch)
                setArticles(result)
            }catch(err){
                console.log(err)
                setError(err.message)
            }finally{
                setLoading(false)
            }
        }
        articles()
        
    },[])
    return {error,loading,articles}
}






export const usePersonalizedArticles=()=>{
    const [articles,setArticles]=useState<ArticlesType>([])
    const [error,setError]=useState<string|null>(null)
    const [loading,setLoading]=useState<boolean>(true)
    const {api_fetch}=useInternalCheckAuth()
    useEffect(()=>{
        async function articles(){
            try{
                const result=await get_personalized_articles(api_fetch)
                setArticles(result)
            }catch(err){
                console.log(err)
                setError(err.message)
            }finally{
                setLoading(false)
            }
        }
        articles()
        
    },[])
    return {error,loading,articles}
}
