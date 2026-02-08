import React, { useState } from 'react';
import { useParams } from 'react-router'
import Savebtn from '~/components/SaveBtn/savebtn';
import { useInternalCheckAuth } from '~/hooks/api_hook';
import { useArticle } from '~/hooks/articles_hooks';
import { mark_favorite_article } from '~/utils/Api/Api';
// import { useArticle } from '~/hooks/articles_hooks'


/**
 * Formats the ISO string date into a readable format.
 */
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return "Date Unavailable";
    }
};

// --- 3. PURE CSS STYLES ---
// Using modern CSS properties for layout, typography, and responsiveness.

const styles = `
    /* Base Reset and Typography */
    .article-page {
        min-height: 100vh;
        background-color: #f7f7f7;
        padding: 1rem;
        font-family: 'Inter', sans-serif;
        color: #333;
    }

    /* Article Container */
    .article-container {
        max-width: 800px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s ease;
    }

    /* Featured Image */
    .article-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        position: relative;
    }

    /* Image Wrapper for Badge Positioning */
    .image-wrapper {
        position: relative;
    }

    .category-badge {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 9999px; /* Fully rounded */
        background-color: #1a73e8; /* Blue */
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    /* Content Area */
    .content-area {
        padding: 2rem;
    }

    /* Title */
    .article-title {
        font-size: 2.5rem;
        font-weight: 800; /* Extra bold */
        line-height: 1.2;
        margin-bottom: 0.75rem;
        color: #1a1a1a;
    }

    /* Metadata */
    .article-meta {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
    }

    .meta-item {
        margin-right: 1rem;
        padding-right: 1rem;
        border-right: 1px solid #ccc;
    }
    .meta-item:last-child {
        border-right: none;
        margin-right: 0;
        padding-right: 0;
    }
    .meta-source {
        font-weight: 600;
        color: #444;
    }

    /* Summary/Lead-in */
    .article-summary {
        font-size: 1.25rem;
        font-style: italic;
        color: #4a4a4a;
        margin-bottom: 2.5rem;
        padding-left: 1.5rem;
        border-left: 4px solid #1a73e8;
        line-height: 1.6;
    }

    /* Main Content Body */
    .article-body p {
        font-size: 1.125rem; /* Large text for readability */
        line-height: 1.8;
        margin-bottom: 1.5rem;
        text-align: justify;
    }

    /* Footer and Tags */
    .article-footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;
    }

    .tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .tag {
        padding: 0.3rem 0.75rem;
        font-size: 0.85rem;
        font-weight: 500;
        border-radius: 8px;
        background-color: #f0f0f0;
        color: #555;
        transition: background-color 0.2s;
        cursor: pointer;
    }
    .tag:hover {
        background-color: #e0e0e0;
    }

    /* Action Bar */
    .action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: #666;
    }

    .stats-group p {
        margin: 0.2rem 0;
    }

    .source-link {
        display: inline-flex;
        align-items: center;
        padding: 0.6rem 1.2rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        color: white;
        background-color: #1a73e8;
        text-decoration: none;
        transition: background-color 0.2s, box-shadow 0.2s;
    }

    .source-link:hover {
        background-color: #155bb5;
        box-shadow: 0 4px 10px rgba(26, 115, 232, 0.4);
    }
    .source-link span {
        margin-left: 0.5rem;
        font-size: 1.2rem;
        line-height: 1; /* Arrow symbol */
    }
    .msg {
    margin-top: 10px;
    width: 380px;
    border-radius: 6px;
    font-size: 14px;
}

.msg-error {
    // background: #ffe5e5;
    color: #c53030;
}

.msg-success {
    // background: #e6ffed;
    color: #2f855a;
}


    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .article-container {
            border-radius: 0; /* Remove radius on small screen */
            box-shadow: none;
        }
        .content-area {
            padding: 1rem;
        }
        .article-title {
            font-size: 1.75rem;
        }
        .article-image {
            height: 250px;
        }
        .article-summary {
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 1.5rem;
        }
        .article-body p {
            font-size: 1rem;
        }
        .article-meta {
            flex-direction: column;
            align-items: flex-start;
        }
        .meta-item {
            border-right: none;
            margin-right: 0;
            padding-right: 0;
            margin-bottom: 0.5rem;
        }
    }
`;


// --- 4. FULL ARTICLE VIEW COMPONENT ---

/**
 * Renders the complete, single-page view of an article.
 */
interface messageprops{
   type:string;
   message:string;
}
const MessageComponent=({type,message}:messageprops)=>(
  <h6 className={`msg ${type === 'error' ? 'msg-error' : 'msg-success'}`}>
        {message}
    </h6>
)
const Get_article= () => {
    const {id}=useParams()
   const {loading,error,article}=useArticle(id)
   const [isSaved,setIssaved]=useState<boolean>(article?article.article_is_saved:false)
   const [success_save,setSuccessSave]=useState<string|null>(null)
   const [error_save,setErrorSave]=useState<string|null>(null)
   const {api_fetch}=useInternalCheckAuth()
   console.log(article)
    async function handle_favorite_article(){
           // save the prev state of article saved or not in case to roll back in error
           let prev_saved_state=isSaved
           try{
               const result=await mark_favorite_article(article._id,api_fetch)
               if(result){
                   setSuccessSave(result.message)
                     setTimeout(()=>{
             setSuccessSave("")
           },3000)
               }
               if(result.article_is_saved){
                   setIssaved(result.article_is_saved)
               }else{
                   setIssaved(result.article_is_saved)
               }
           }catch(err){
               console.log(err)
               setErrorSave(err.message)
                setTimeout(()=>{
             setErrorSave("")
           },3000)
           setIssaved(prev_saved_state)
           }
       }
   if(loading){
    return <h4>LOADING ...</h4>
   }
    if(!id || !article){
        return <h3>OPPS!SOMETHING WENT WRONG...</h3>
    }
    if(error){
        return <h4>{error}</h4>
    }
    const formattedDate = formatDate(article.publishedAt);
    const paragraphs = article.content.split('\n').filter(p => p.trim() !== '');
    return (
        <div className="article-page">
            {/* Embed the pure CSS styles */}
            <style>{styles}</style>
            
            <div className="article-container">
                
                {/* Featured Image and Header Container */}
                <div className="image-wrapper">
                    {/* Placeholder Image */}
                    <img 
                        src={article.image||`https://placehold.co/800x400/1a73e8/ffffff?text=${article.category.toUpperCase()}+FEATURE`}
                        alt={article.title}
                        className="article-image"
                        onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src = "https://placehold.co/800x400/333/fff?text=Image+Missing"; 
                        }}
                    />
                    {/* Category Badge overlay */}
                    <span className="category-badge">
                        {article.category}
                    </span>
                </div>

                {/* Article Body Content */}
                <div className="content-area">
                    
                    {/* Title */}
                    <h1 className="article-title">
                        {article.title}
                    </h1>
                    
                    {/* Metadata */}
                    <div className="article-meta">
                        <span className="meta-item">
                            By <span className="meta-source">{article.source}</span>
                        </span>
                        <span className="meta-item">
                            Published on: <span className="meta-source">{formattedDate}</span>
                        </span>
                    </div>

                    {/* Summary / Lead-in */}
                    <p className="article-summary">
                        {article.summary}
                    </p>

                    {/* Main Content */}
                    <div className="article-body">
                        {paragraphs.map((p, index) => (
                            <p key={index}>
                                {p}
                            </p>
                        ))}
                    </div>

                    {/* Footer / Tags */}
                    <div className="article-footer">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#444', marginBottom: '1rem' }}>Tags:</h3>
                        <div className="tags-list">
                            {article.tags.map((tag) => (
                                <span 
                                    key={tag}
                                    className="tag"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        
                        {/* Action Bar */}
                        <div className="action-bar">
                            <div className="stats-group">
                                <p>Views: <span style={{ fontWeight: 700 }}>{article.views}</span></p>
                                <p>Saved: <span style={{ fontWeight: 700 }}>{article.number_saved}</span></p>
                                <p>Saved By you: <span style={{ fontWeight: 700 }}>{isSaved?"yes":"no"}</span></p>
                                <Savebtn cb={handle_favorite_article} txtfield={isSaved?"Unsave Article":"Save Article"}/>
                                    {error_save && <MessageComponent type="error" message={error_save}/>}
                                     {success_save && <MessageComponent type="succcess" message={success_save}/>}
                            </div>
                            <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="source-link"
                            >
                                View Original Source <span>&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Get_article;