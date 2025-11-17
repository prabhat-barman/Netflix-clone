import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./TitleCards.css";

const TitleCards = ({ title = "Popular on Netflix", category = "now_playing" }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef(null);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  }, []);

  const buildTMDB = useCallback((size, path) =>
    `https://image.tmdb.org/t/p/${size}${path}`,
    []
  );

  const buildProxy = useCallback((size, path) => {
    const proxy = import.meta.env.VITE_IMAGE_PROXY;
    return proxy ? `${proxy.replace(/\/$/, '')}/img/${size}${path}` : null;
  }, []);

  const INLINE_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzIzMjMyMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZjdmN2Y3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        const token = import.meta.env.VITE_TMDB_TOKEN;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined
          },
          signal: controller.signal
        };

        const url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1&region=US`;
        console.log("Fetching movies from:", url);

        const response = await fetch(url, options);
        console.log("Response status:", response.status);

        if (!response.ok) {
          console.warn("TMDB API response not OK:", response.status);
          setApiData([]);
          return;
        }

        const data = await response.json();
        console.log("Fetched movies:", data.results?.length);

        if (data.results && data.results.length > 0) {
          setApiData(data.results);
        } else {
          console.warn("No results in API response");
          setApiData([]);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching movies:", err);
          setApiData([]);
        }
      }
    };

    fetchMovies();

    const el = cardsRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      controller.abort();
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
    };
  }, [category, handleWheel]);
  

  return (
    <div className="background-container">
      <div className="titlecards">
        <h2>{title}</h2>
        <div className="card-list" ref={cardsRef}>
          {apiData.length > 0 ? (
            apiData.map((card) => {
              const proxy = import.meta.env.VITE_IMAGE_PROXY;
              const path = card.backdrop_path || card.poster_path;

              return (
                <Link to={`/player/${card.id}`} className="card" key={card.id}>
                  <img
                    loading="lazy"
                    src={
                      !path
                        ? INLINE_FALLBACK
                        : proxy
                        ? buildProxy("w500", path)
                        : buildTMDB("w500", path)
                    }
                    alt={card.original_title || "Movie"}
                    onError={(e) => {
                      const img = e.currentTarget;
                      const proxy = import.meta.env.VITE_IMAGE_PROXY;

                      // If fallback already applied, stop
                      if (img.dataset.fallbackApplied === "true") {
                        img.onerror = null;
                        return;
                      }

                      // Try smaller size
                      if (!img.dataset.small && img.src.includes("/w500")) {
                        img.dataset.small = "1";
                        img.src = proxy
                          ? buildProxy("w300", path)
                          : buildTMDB("w300", path);
                        return;
                      }

                      // If proxy, try direct TMDB
                      if (proxy && !img.dataset.direct && img.src.includes("/img")) {
                        img.dataset.direct = "1";
                        img.src = buildTMDB("w300", path);
                        return;
                      }

                      // Final fallback
                      img.dataset.fallbackApplied = "true";
                      img.onerror = null;
                      img.src = INLINE_FALLBACK;
                    }}
                  />
                  <p>{card.original_title || card.title}</p>
                </Link>
              );
            })
          ) : (
            <p>Loading movies...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleCards;