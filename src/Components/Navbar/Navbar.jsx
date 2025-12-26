import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import "../../Pages/Login/Login.css";

import logo from "../../assets/nlogo.png";
import search from "../../assets/searchiconn.png";
import bell from "../../assets/BellIcon.png";
import player from "../../assets/R.png";

import { logout } from "../../Firebase";

const Navbar = ({ onSearch }) => {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add("nav-dark");
      } else {
        navRef.current.classList.remove("nav-dark");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQ(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (!onSearch) {
      const term = (q || "").trim();
      if (!term) return;
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <img className="logo" src={logo} alt="Netflix Logo" />
        <ul>
          <li id="homeSelect"><b>Home</b></li>
          <li><b>TV Shows</b></li>
          <li><b>Movies</b></li>
          <li><b>New & Popular</b></li>
          <li><b>My List</b></li>
          <li><b>Browse by Languages</b></li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <form className="nav-search-form" onSubmit={submitSearch} role="search">
            <input
              className="nav-search-input"
              aria-label="Search movies"
              placeholder="Search movies..."
              value={q}
              onChange={handleInputChange}
            />
            <button type="submit" className="nav-search-button" aria-label="Search">
              <img src={search} alt="Search Icon" className="icon" />
            </button>
          </form>
        </div>

        <p><b>Children</b></p>
        <img src={bell} alt="Notification Icon" className="icons" />

        <div className="navbar-profile">
          <img src={player} alt="User Profile" className="profile" />

          <div className="dropdown">
            <p onClick={() => { logout(); navigate("/login"); }}>Sign Out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
