import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useInternalCheckAuth } from '~/hooks/api_hook';
import { mark_favorite_article } from '~/utils/Api/Api';



/**
 * Defines the structure of the data passed to the ArticleCard component.
 * We include the core fields provided in the query.
 */
interface ArticleProps {
    _id: string;
    title: string;
    summary: string;
    image: string; // URL or path
    category: string;
    publishedAt: string; // ISO 8601 Date String
    article_is_saved?: boolean; // Optional flag
}

// --- 2. Helper Functions ---

/**
 * Formats the ISO string date into a readable format.
 * @param {string} dateString - The ISO date string (e.g., "2025-11-05T20:01:34.233Z")
 * @returns {string} Formatted date (e.g., "Nov 5, 2025")
 */
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return "Date Unavailable";
    }
};


const styles = `
    /* Base for the Page (Mocking 'mx-auto mb-6 max-w-4xl') */
    // .article-list-container {
    //     padding: 1rem;
    //     background-color: #f7f7f7;
    //     min-height: 100vh;
    //     font-family: 'Inter', sans-serif;
    // }

    /* Article Card Container (Replacing multiple Tailwind classes) */
    .article-card {
        display: flex;
        flex-direction: column; /* flex-col (mobile default) */
        background-color: white; /* bg-white */
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
        border-radius: 12px; /* rounded-xl */
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* transition-all duration-300 */
        cursor: pointer;
        max-width: 900px; /* max-w-4xl */
        margin: 24px auto; /* mx-auto mb-6 */
        border: 1px solid #f3f4f6; /* border border-gray-100 */
    }

    /* Hover effects (Replacing hover:shadow-2xl hover:scale-[1.01]) */
    .article-card:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
        transform: scale(1.01);
    }

    /* Media Query for Desktop (Replacing md:flex-row) */
    @media (min-width: 768px) {
        .article-card {
            flex-direction: row; /* md:flex-row */
        }
        .card-image-section {
            width: 33.333333%; /* md:w-1/3 */
            height: auto !important; /* md:h-auto */
        }
        .card-content-section {
            width: 66.666667%; /* md:w-2/3 */
        }
    }

    /* Image Section */
    .card-image-section {
        overflow: hidden;
    }

    .card-image-section img {
        width: 100%; /* w-full */
        height: 100%; /* h-full */
        object-fit: cover;
        transition: opacity 0.5s;
        opacity: 0.9;
    }

    .article-card:hover .card-image-section img {
        opacity: 1; /* hover:opacity-100 */
    }

    /* Content Section */
    .card-content-section {
        padding: 1.5rem; /* p-6 */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    /* Category Badge */
    .category-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem; /* px-3 py-1 */
        font-size: 0.75rem; /* text-xs */
        font-weight: 600; /* font-semibold */
        text-transform: uppercase;
        letter-spacing: 0.05em; /* tracking-wider */
        border-radius: 9999px; /* rounded-full */
        background-color: #dbeafe; /* bg-blue-100 */
        color: #2563eb; /* text-blue-600 */
        margin-bottom: 0.5rem; /* mb-2 */
    }

    /* Title */
    .article-title {
        font-size: 1.25rem; /* text-xl */
        font-weight: 800; /* font-extrabold */
        color: #1f2937; /* text-gray-900 */
        margin-bottom: 0.5rem; /* mb-2 */
        line-height: 1.375; /* leading-snug */
    }

    /* Summary (Using webkit line clamp for fidelity) */
    .article-summary {
        color: #4b5563; /* text-gray-600 */
        margin-bottom: 1rem; /* mb-4 */
        font-size: 1rem;
        line-height: 1.5;

        /* line-clamp-3 equivalent */
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    /* Footer/Metadata */
    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem; /* text-sm */
        color: #6b7280; /* text-gray-500 */
        margin-top: 0.5rem; /* mt-2 */
    }

    .footer-left {
        display: flex;
        align-items: center;
        gap: 0.5rem; /* space-x-2 */
    }


    /* Read More Button */
    .read-more-btn {
        color: #2563eb; /* text-blue-600 */
        font-weight: 500; /* font-medium */
        border: none;
        background: none;
        cursor: pointer;
        transition: color 0.2s;
    }

    .read-more-btn:hover {
        color: #1e40af; /* hover:text-blue-800 */
    }
         .icon-bookmark {
        width: 1.5rem;  
        height: 1.5rem; 
        transition: color 0.2s;
    }

    /* Color for the SAVED (filled) icon */
    .icon-saved {
        color: #f59e0b; /* Yellow/Amber */
    }

    /* Color for the NOT SAVED (outline) icon */
    .icon-unsaved {
        color: #9ca3af; /* Medium Gray */
    }
`;


const ArticleCard: React.FC<ArticleProps> = ({ 
    title, 
    _id,
    summary, 
    image, 
    category, 
    publishedAt,
    article_is_saved=false
}) => {
    const formattedDate = formatDate(publishedAt); 
    const [error,setError]=useState<string|null>(null)
    const [success,setSuccess]=useState<string|null>(null)
    const [isSaved,setIssaved]=useState<boolean>(article_is_saved)
    const {api_fetch}=useInternalCheckAuth()
    const navigate=useNavigate()
    async function handle_favorite_article(){
        // save the prev state of article saved or not in case to roll back in error
        let prev_saved_state=isSaved
        try{
            const result=await mark_favorite_article(_id,api_fetch)
            if(result){
                setSuccess(result.message)
                  setTimeout(()=>{
          setSuccess("")
        },3000)
            }
            if(result.article_is_saved){
                setIssaved(result.article_is_saved)
            }else{
                setIssaved(result.article_is_saved)
            }
        }catch(err){
            console.log(err)
            setError(err.message)
             setTimeout(()=>{
          setError("")
        },3000)
        setIssaved(prev_saved_state)
        }
    }
       return (
        <div className="article-card" >
            {/* Image Section */}
            <style>{styles}</style>
            <div className="card-image-section">
                <img
                    src={image||`https://placehold.co/600x400/3B82F6/ffffff?text=${category.toUpperCase()}`}
                    alt={title}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://placehold.co/600x400/6B7280/ffffff?text=Image+Missing";
                    }}
                />
            </div>

            {/* Content Section */}
            <div className="card-content-section">
                <div>
                    {/* Category Badge */}
                    <span className="category-badge">
                        {category}
                    </span>

                    {/* Title */}
                    <h2 className="article-title">
                        {title}
                    </h2>

                    {/* Summary */}
                    <p className="article-summary">
                        {summary}
                    </p>
                </div>

                {/* Footer/Metadata */}
                <div className="card-footer">
                    <div className="footer-left">
                        <span>
                            {formattedDate}
                        </span>
                     
                          {isSaved ?(
                            // State 1: SAVED (Filled, Yellow)
                            <svg 
                                className="icon-bookmark icon-saved" 
                                fill="currentColor" 
                                viewBox="0 0 24 24" // <-- Standardized ViewBox
                                onClick={handle_favorite_article}
                            >
                                <path d="M7 3h10a2 2 0 012 2v14l-7-3.5-7 3.5V5a2 2 0 012-2z" />
                            </svg>
                        ) 
                        : (
                            // State 2: NOT SAVED (Outline, Grey)
                            <svg 
                                className="icon-bookmark icon-unsaved" 
                                fill="none" 
                                viewBox="0 0 24 24" // <-- Standardized ViewBox
                                stroke="currentColor" 
                                strokeWidth="2"
                                onClick={handle_favorite_article}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        )
                        }
                        <span>{error}</span>
                        <span>{success}</span>
                    </div>
                    
                    <Link
                        className="read-more-btn"
                       to={`/news/${_id}`}
                        >
                        Read More &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};



export default ArticleCard ;
