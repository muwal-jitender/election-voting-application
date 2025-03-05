import "./Navbar.css";

import React, { useEffect, useState } from "react";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";

import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineBars3 } from "react-icons/hi2";
import { setupAxiosInterceptors } from "../services/axios.config";
import Loader from "./layout/Loader";

const Navbar: React.FC = () => {
  const VOTING_APP_THEME = "voting-app-theme";
  const [showNav, setShowNav] = useState(false);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem(VOTING_APP_THEME),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupAxiosInterceptors(setLoading); // ✅ Ensure Interceptors are Set Up Once
  }, [setLoading]);

  // Show or hide nav on page load and window resize
  useEffect(() => {
    showHideNav();
    window.addEventListener("resize", showHideNav);

    return () => {
      window.removeEventListener("resize", showHideNav);
    };
  }, []);

  const showHideNav = () => {
    if (window.innerWidth < 600) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  };

  // Function to toggle theme
  const toggleTheme = () => {
    showHideNav();
  };

  useEffect(() => {
    document.body.className = localStorage.getItem(VOTING_APP_THEME) ?? "";
  }, [darkTheme]);

  // Function to toggle dark theme
  const changeThemeHandler = () => {
    const currentTheme = localStorage.getItem(VOTING_APP_THEME);
    const newTheme = currentTheme === "dark" ? "" : "dark";
    localStorage.setItem(VOTING_APP_THEME, newTheme);
    setDarkTheme(newTheme);
  };
  return (
    <>
      {loading && <Loader />}
      <nav className="nav">
        <div className="container nav__container">
          <Link to="/" className="nav__logo">
            Election Voting App
          </Link>

          <div>
            {showNav && (
              <menu>
                <NavLink to="/elections" onClick={toggleTheme}>
                  Elections
                </NavLink>
                <NavLink to="/results" onClick={toggleTheme}>
                  Results
                </NavLink>
                <NavLink to="/logout" onClick={toggleTheme}>
                  Logout
                </NavLink>
              </menu>
            )}
            <button className="theme__toggle-btn" onClick={changeThemeHandler}>
              {darkTheme ? <IoMdSunny /> : <IoIosMoon />}
            </button>
            <button
              className="nav__toggle-btn"
              onClick={() => setShowNav(!showNav)}
            >
              {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
