import React, { useState } from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";
import net_image from "../../assets/3d_image.jpg";
import play_btn from "../../assets/play_btn.png";
import info_btn from "../../assets/information-button.png";

import TitleCards from "../../Components/TitleCards/TitleCards";

const Home = () => {
  const [filterQuery, setFilterQuery] = useState("");

  return (
    <div className="home">
      <Navbar onSearch={setFilterQuery} />

      <div className="hero">
        <img src={net_image} alt="Background" className="banner-img" />

        <div className="hero-caption">
          <p>
            <b>
              Discovering his ties to a secret ancient order, a young man living
              in modern Istanbul embarks on a quest to save the city from an
              immortal enemy.
            </b>
          </p>

          <div className="hero-btns">
            <button className="btn">
              <img src={play_btn} alt="" /> Play
            </button>
            <button className="btn dark-btn">
              <img src={info_btn} alt="" /> More Info
            </button>
          </div>
        </div>
      </div>

      <div className="more-cards">
        <TitleCards filterQuery={filterQuery} />
        <TitleCards title={"blockbuster movies"} category={"top_rated"} filterQuery={filterQuery} />
        <TitleCards title={"only on netflix"} category={"popular"} filterQuery={filterQuery} />
        <TitleCards title={"upcoming"} category={"upcoming"} filterQuery={filterQuery} />
        <TitleCards title={"top pics for you"} category={"now_playing"} filterQuery={filterQuery} />
      </div>
    </div>
  );
};

export default Home;
