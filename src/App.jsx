import React, { useState, useEffect } from "react";
import _ from "lodash"; // Anti-pattern: importing entire lodash library
import "./App.css";

const HackerNewsAPI = "https://hacker-news.firebaseio.com/v0";

/**
 * SLOW VERSION - Phase 1
 * This version contains intentional anti-patterns:
 * 1. Sequential (N+1) fetching of stories
 * 2. No list virtualization - renders all 500+ items
 * 3. Full lodash import
 * 4. Expensive computations in render (date formatting)
 * 5. Unoptimized hero image
 * 6. No code splitting
 */

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByScore, setSortByScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Anti-pattern: N+1 sequential fetching
  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        setLoading(true);
        // Fetch top story IDs
        const response = await fetch(`${HackerNewsAPI}/topstories.json`);
        const storyIds = await response.json();

        const stories = [];

        // Anti-pattern: Sequential loop - fetch one by one
        for (const id of storyIds.slice(0, 500)) {
          const storyResp = await fetch(`${HackerNewsAPI}/item/${id}.json`);
          const storyData = await storyResp.json();
          stories.push(storyData);
        }

        setArticles(stories);
        setFilteredArticles(stories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllStories();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Anti-pattern: Filter entire list on every keystroke
    const filtered = articles.filter(
      (article) => article.title && article.title.toLowerCase().includes(term),
    );
    setFilteredArticles(filtered);
  };

  // Handle sort
  const handleSort = () => {
    setSortByScore(!sortByScore);

    // Anti-pattern: Using _.sortBy on entire list
    if (!sortByScore) {
      const sorted = _.sortBy(filteredArticles, "score").reverse();
      setFilteredArticles(sorted);
    } else {
      // Reset to search filtered
      const term = searchTerm.toLowerCase();
      const filtered = articles.filter(
        (article) =>
          article.title && article.title.toLowerCase().includes(term),
      );
      setFilteredArticles(filtered);
    }
  };

  return (
    <div className="app">
      {/* Large unoptimized hero image - Anti-pattern */}
      <div className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop"
          alt="News Hero"
          className="hero-image"
        />
      </div>

      <div className="container">
        <h1>HackerNews Aggregator</h1>
        <p className="subtitle">Top 500 Stories from HackerNews</p>

        <div className="controls">
          <input
            type="text"
            placeholder="Search articles by title..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button onClick={handleSort} className="sort-btn">
            {sortByScore ? "Unsort" : "Sort by Score"}
          </button>
        </div>

        {loading && <div className="loading">Loading articles...</div>}
        {error && <div className="error">Error: {error}</div>}

        {/* Anti-pattern: Render all 500+ items directly into DOM */}
        <div className="article-list" data-testid="article-list">
          {filteredArticles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Anti-pattern: Component without React.memo, expensive date formatting in every render
function ArticleItem({ article }) {
  // Anti-pattern: Expensive date formatting on every single render
  const formattedDate = new Date(article.time * 1000).toLocaleString();

  return (
    <div className="article-item" data-testid="article-item">
      <div className="article-header">
        <h3 className="article-title">{article.title}</h3>
        <div className="article-meta">
          <span className="score">Score: {article.score}</span>
          <span className="author">by {article.by}</span>
          <span className="date">{formattedDate}</span>
        </div>
      </div>
      {article.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="article-link"
        >
          Read more →
        </a>
      )}
    </div>
  );
}

export default App;
