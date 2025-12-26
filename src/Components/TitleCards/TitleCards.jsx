import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./TitleCards.css";

const TitleCards = ({ title = "Popular on Netflix", category = "now_playing", filterQuery = "" }) => {
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

  const MOCK_CARDS_DATA = [
    { id: 101, original_title: "Stranger Things", poster_path: "https://placehold.co/500x750/222/FFF/png?text=Stranger+Things" },
    { id: 102, original_title: "The Witcher", poster_path: "https://placehold.co/500x750/222/FFF/png?text=The+Witcher" },
    { id: 103, original_title: "Spider-Man: No Way Home", poster_path: "https://placehold.co/500x750/800/FFF/png?text=Spider-Man" },
    { id: 104, original_title: "Money Heist", poster_path: "https://placehold.co/500x750/900/FFF/png?text=Money+Heist" },
    { id: 105, original_title: "Squid Game", poster_path: "https://placehold.co/500x750/066/FFF/png?text=Squid+Game" },
    { id: 106, original_title: "Lucifer", poster_path: "https://placehold.co/500x750/600/FFF/png?text=Lucifer" },
    { id: 107, original_title: "Dark", poster_path: "https://placehold.co/500x750/333/FFF/png?text=Dark" },
    { id: 108, original_title: "Breaking Bad", poster_path: "https://placehold.co/500x750/060/FFF/png?text=Breaking+Bad" },
    { id: 109, original_title: "Peaky Blinders", poster_path: "https://placehold.co/500x750/444/FFF/png?text=Peaky+Blinders" },
    { id: 110, original_title: "Narcos", poster_path: "https://placehold.co/500x750/840/FFF/png?text=Narcos" },
    { id: 111, original_title: "Wednesday", poster_path: "https://placehold.co/500x750/000/FFF/png?text=Wednesday" },
    { id: 112, original_title: "Black Mirror", poster_path: "https://placehold.co/500x750/111/FFF/png?text=Black+Mirror" },
    { id: 113, original_title: "The Crown", poster_path: "https://placehold.co/500x750/D4AF37/FFF/png?text=The+Crown" },
    { id: 114, original_title: "Ozark", poster_path: "https://placehold.co/500x750/004/FFF/png?text=Ozark" },
    { id: 115, original_title: "Mindhunter", poster_path: "https://placehold.co/500x750/300/FFF/png?text=Mindhunter" }
  ];

  useEffect(() => {
    // Pure Mock Mode: Shuffle data slightly based on category/title to make sections look different
    const shuffled = [...MOCK_CARDS_DATA].sort(() => 0.5 - Math.random());
    setApiData(shuffled);

    const el = cardsRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
    };
  }, [category, handleWheel]);

  const filteredData = apiData.filter(card => {
    if (!filterQuery) return true;
    const title = card.original_title || card.title || "";
    return title.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <div className="background-container">
      <div className="titlecards">
        <h2>{title}</h2>
        <div className="card-list" ref={cardsRef}>
          {filteredData.length > 0 ? (
            filteredData.map((card) => {
              // Direct mock usage
              const imgSrc = card.poster_path;

              return (
                <Link to={`/player/${card.id}`} className="card" key={card.id}>
                  <img
                    loading="lazy"
                    src={imgSrc}
                    alt={card.original_title || "Movie"}
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