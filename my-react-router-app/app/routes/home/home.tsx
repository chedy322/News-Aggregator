
import type { Route } from "../+types/home";
// import { Welcome } from "../welcome/welcome";
import Nav from "~/components/Nav/Nav";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import React, { useContext, useEffect } from 'react';
import { Link } from "react-router";
import { ThemeContext } from "~/utils/context";

// import { Link } from 'react-router-dom'; 

export default function Home() {
  const {userData}=useContext(ThemeContext)
  return (
    <>
      {/* Styles are placed here for easy viewing, move to a .css file for production */}
      <style>{`
        /* Global Reset/Base */
        .ai-news-main {
          min-height: 100vh;
          background-color: #f9fafb; /* Light background */
          font-family: Arial, sans-serif;
          color: #1f2937;
        }

        /* === 1. Hero Section === */
        .hero-section {
          padding: 6rem 1rem; /* py-24 */
          text-align: center;
          background-color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .hero-content {
          max-width: 64rem; /* max-w-4xl */
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3rem; /* text-5xl */
          font-weight: 800; /* font-extrabold */
          color: #111827; /* gray-900 */
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.25rem; /* text-xl */
          color: #4b5563; /* gray-600 */
          margin-bottom: 2rem;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #ffffff;
          background-color: #4f46e5; /* indigo-600 */
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background-color 0.3s ease;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .cta-button:hover {
          background-color: #4338ca; /* indigo-700 */
        }

        /* === 2. Feature Highlights === */
        .features-section {
          padding: 5rem 1rem;
          text-align: center;
        }

        .features-grid {
          max-width: 72rem; /* max-w-6xl */
          margin: 10px auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem; /* gap-10 */
        }
        
        @media (min-width: 768px) { /* md:grid-cols-3 */
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          padding: 1.5rem;
          background-color: #ffffff;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }

        .feature-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          color: #6366f1; /* indigo-500 */
          font-size: 1.875rem;
          margin-bottom: 0.75rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-text {
          color: #4b5563;
        }

        /* === 3. Secondary CTA === */
        .secondary-cta {
          background-color: #6366f1; /* indigo-500 */
          color: #ffffff;
          padding: 4rem 1rem;
          margin-top: 2.5rem;
          text-align: center;
        }

        .secondary-cta-content {
            max-width: 64rem;
            margin: 0 auto;
        }
        
        .secondary-cta-button {
          display: inline-block;
          padding: 0.75rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #4f46e5; /* indigo-600 */
          background-color: #ffffff;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }
      `}</style>

      <main className="ai-news-main">
          <section className="hero-section">
              <div className="hero-content">
                  <h1 className="hero-title">
                      Intelligence, Not Noise.
                  </h1>
                  <p className="hero-subtitle">
                      Your **AI-powered news aggregator** that cuts through the clutter to deliver personalized, summarized, and trend-analyzed stories.
                  </p>
                  <Link to="/news" className="cta-button">
                      Start Reading Now
                  </Link>
                  <p className="text-sm text-gray-500 mt-4">Sign-up takes less than a minute.</p>
              </div>
          </section>
          <section className="features-section">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12" >How We Transform Your News Feed</h2>
              <div className="features-grid">

                  <div className="feature-card">
                      <div className="feature-icon">📰</div>
                      <h3 className="feature-title">AI Summaries</h3>
                      <p className="feature-text">Get the core facts of any article in seconds. No more endless scrolling—just **concise, AI-generated summaries.**</p>
                  </div>

                  <div className="feature-card">
                      <div className="feature-icon">🧠</div>
                      <h3 className="feature-title">Personalized Curation</h3>
                      <p className="feature-text">Our machine learning models understand your interests and filter out irrelevant noise, showing you **only what matters to you.**</p>
                  </div>

                  <div className="feature-card">
                      <div className="feature-icon">📈</div>
                      <h3 className="feature-title">Emerging Trend Detection</h3>
                      <p className="feature-text">Identify the topics that are rapidly gaining momentum, giving you a **competitive edge** in knowledge and timing.</p>
                  </div>

              </div>
          </section>

          <section className="secondary-cta">
              <div className="secondary-cta-content">
                  <h2 className="text-3xl font-bold mb-4">Ready for Smarter News?</h2>
                  <p className="text-lg mb-8 opacity-90">Stop wasting time searching. Let the intelligence come to you.</p>
                { !userData &&
                 <Link to="/register" className="secondary-cta-button">
                      Create Free Account
                  </Link>}
              </div>
          </section>

      </main>
    </>
  );
}

const main={
  display:"flex",
  
}
