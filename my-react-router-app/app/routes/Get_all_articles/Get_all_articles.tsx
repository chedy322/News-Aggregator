import React from 'react'
import { useNavigate } from 'react-router'
import ArticleCard from '~/components/article_card/article_card'
import { useArticles } from '~/hooks/articles_hooks'

function Get_all_articles() {
    const {error,loading,articles}=useArticles()
    console.log(articles)
    if(loading){
      return <h4>Loading Articles...</h4>
    }
    if(error){
      return <h5>{error}</h5>
    }
    if(!articles || articles.length==0){
      return <h3>Opps!No articles are avaible yet...</h3>
    }
  
  return (
    <div>
      {

        articles.map(
          (article)=>
        (
          <>
        <ArticleCard
           key={article._id}
           _id={article._id}
           title={article.title}
           image={article.image}
           category={article.category}
           publishedAt={article.publishedAt}
           summary={article.summary}
         article_is_saved={article.article_is_saved}
           />
           </>
      )
        )
      }
    </div>
  )
}

export default Get_all_articles
