import "./Navbar.css";

import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineBars3 } from "react-icons/hi2";

const Navbar: React.FC = () => {
  const VOTING_APP_THEME = "voting-app-theme";
  const [showNav, setShowNav] = useState(false);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem(VOTING_APP_THEME)
  );

  // Function to close nav on small screens when a link is clicked
  const closeNavMenuHandler = () => {
    if (window.innerWidth < 600) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  };

  useEffect(() => {
    document.body.className = localStorage.getItem(VOTING_APP_THEME) ?? "";
  }, [darkTheme]);
  // Function to toggle dark theme
  const changeThemeHandler = () => {
    if (localStorage.getItem(VOTING_APP_THEME) === "dark") {
      localStorage.setItem(VOTING_APP_THEME, "");
    } else {
      localStorage.setItem(VOTING_APP_THEME, "dark");
    }
    setDarkTheme(localStorage.getItem(VOTING_APP_THEME));
  };
  return (
    <nav className="nav">
      <div className="container nav__container">
        <Link to="/" className="nav__logo">
          Election Voting App
        </Link>

        <div>
          {showNav && (
            <menu>
              <NavLink to="/elections" onClick={closeNavMenuHandler}>
                Elections
              </NavLink>
              <NavLink to="/results" onClick={closeNavMenuHandler}>
                Results
              </NavLink>
              <NavLink to="/logout" onClick={closeNavMenuHandler}>
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
  );
};

export default Navbar;
