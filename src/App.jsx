import React, { useState, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import sortBy from "lodash/sortBy";
import "./App.css";

const HackerNewsAPI = "https://hacker-news.firebaseio.com/v0";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByScore, setSortByScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${HackerNewsAPI}/topstories.json`);
        const storyIds = await response.json();

        const storyPromises = storyIds
          .slice(0, 500)
          .map((id) =>
            fetch(`${HackerNewsAPI}/item/${id}.json`).then((r) => r.json()),
          );

        const stories = await Promise.all(storyPromises);
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = articles.filter(
      (article) => article.title && article.title.toLowerCase().includes(term),
    );
    setFilteredArticles(filtered);
  };

  const handleSort = () => {
    setSortByScore(!sortByScore);

    if (!sortByScore) {
      const sorted = sortBy(filteredArticles, "score").reverse();
      setFilteredArticles(sorted);
    } else {
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
      <div className="hero-section">
        <img
          data-testid="hero-image"
          src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop&q=80"
          alt="News Hero"
          className="hero-image"
          width="1200"
          height="400"
          srcSet="
            https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop&q=80 400w,
            https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=300&fit=crop&q=80 800w,
            https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop&q=80 1200w
          "
          loading="lazy"
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

        <VirtualizedArticleList articles={filteredArticles} />
      </div>
    </div>
  );
}

function VirtualizedArticleList({ articles }) {
  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="article-list"
      data-testid="article-list"
      style={{
        height: "calc(100vh - 400px)",
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ArticleItem article={articles[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

const ArticleItem = React.memo(({ article }) => {
  const formattedDate = useMemo(
    () => dateFormatter.format(new Date(article.time * 1000)),
    [article.time],
  );

  return (
    <div className="article-item" data-testid="article-item">
      <div className="article-header">
        <h3 className="article-title">{article.title}</h3>
        <div className="article-meta">
          <span className="score">Score {article.score}</span>
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
          Read more
        </a>
      )}
    </div>
  );
});

ArticleItem.displayName = "ArticleItem";

export default App;
