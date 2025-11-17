import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Search.css";

const INLINE_FALLBACK =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzIzMjMyMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZjdmN2Y3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

const buildTMDB = (size, path) => `https://image.tmdb.org/t/p/${size}${path}`;
const buildProxy = (size, path) => {
  const proxy = import.meta.env.VITE_IMAGE_PROXY;
  return proxy ? `${proxy.replace(/\/$/, "")}/img/${size}${path}` : null;
};

const useQuery = () => new URLSearchParams(useLocation().search);

export default function Search() {
  const q = useQuery().get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(
    async (query, signal) => {
      if (!query) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const v4 = import.meta.env.VITE_TMDB_TOKEN;
        const v3 = import.meta.env.VITE_TMDB_API_KEY;
        let url = `https://api.themoviedb.org/3/search/movie?language=en-US&page=1&include_adult=false&query=${encodeURIComponent(
          query
        )}`;

        if (v3 && !v4) url += `&api_key=${encodeURIComponent(v3)}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            ...(v4 ? { Authorization: `Bearer ${v4}` } : {}),
          },
          signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`TMDB ${res.status} ${txt}`);
        }

        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchResults(q, controller.signal);
    return () => controller.abort();
  }, [q, fetchResults]);

  return (
    <div className="search-page">
      <Link to="/" className="back-btn">
        ← Back to All Movies
      </Link>

      <h2>Search results for “{q}”</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="search-grid">
        {results.map((m) => {
          const path = m.poster_path || m.backdrop_path;
          const proxy = import.meta.env.VITE_IMAGE_PROXY;
          const src = !path ? INLINE_FALLBACK : proxy ? buildProxy("w300", path) : buildTMDB("w300", path);

          return (
            <Link to={`/player/${m.id}`} key={m.id} className="search-card">
              <img
                src={src}
                alt={m.title || m.name}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.dataset.fallback) return;
                  img.dataset.fallback = "1";
                  img.src = INLINE_FALLBACK;
                }}
              />
              <div className="meta">
                <h3>{m.title || m.name}</h3>
                <p className="release">{m.release_date || "—"}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {!loading && results.length === 0 && !error && <p>No results.</p>}
    </div>
  );
}