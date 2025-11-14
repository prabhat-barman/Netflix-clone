// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Player from "./Pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { ToastContainer } from "react-toastify";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Firebase user =", user);

      if (user) {
        // If user is logged in and tries to go to login page
        if (location.pathname === "/" || location.pathname === "/login") {
          navigate("/home");
        }
      } else {
        // If NOT logged in → always go to login page
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <div>
      <ToastContainer theme="dark" />

      <Routes>
        <Route path="/" element={<Login />} />     {/* Default page = Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </div>
  );
};

export default App;
