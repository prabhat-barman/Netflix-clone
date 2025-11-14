import React, { useState, useEffect } from "react";
import "./Player.css";
import back_arrow from "../../assets/BackArrow.png";
import { useParams } from "react-router-dom";

const Player = () => {
  console.log("player");

  const { id } = useParams();

  const [apiData, setApiData] = useState({
    name: "Jack Black Gives Us a Deep Dive into Bowser's Traits",
    key: "RrrxSvWJllg",
    published_at: "2024-05-24T16:00:15.000Z",
    type: "Featurette",
  });

  useEffect(() => {
    if (!id) return;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTk3NzZhYzc2ZDZjNWUyZGRkOTdkZjYzNTI2YzkxZSIsIm5iZiI6MTc2MjQxMTk2Ny45NzUwMDAxLCJzdWIiOiI2OTBjNDViZjg0Y2EyYTAzYzNkNzM4MDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.iTip_MpiJ052f6gvzyhyhhFUV4OKacHPA6QyF5XzZQo",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setApiData(data.results[0]);
        } else {
          console.warn("No video data found for this movie ID:", id);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow}
        alt="Back"
        // onClick={()=>{Navigate(-2)}}
        className="back-arrow"
        onClick={() => window.history.back()}
      />

      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
        src={`https://www.youtube.com/embed/${apiData.key}?autoplay=0&controls=1`}
        title="Trailer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="player-info">
        <p>
          {apiData.published_at ? apiData.published_at.slice(0, 10) : "N/A"}
        </p>
        <p>{apiData.name || "Unknown Title"}</p>
        <p>{apiData.type || "N/A"}</p>
      </div>
    </div>
  );
};

export default Player;
