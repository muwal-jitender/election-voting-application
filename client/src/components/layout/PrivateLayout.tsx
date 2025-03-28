import "./PrivateLayout.css";

import React, { useEffect, useState } from "react";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { getTheme, setTheme } from "../../utils/theme.utils";

import { useUser } from "context/UserContext";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineBars3 } from "react-icons/hi2";
import { logout } from "services/voter.service";
import { setupAxiosInterceptors } from "../../services/axios.config";
import Loader from "./Loader";

const PrivateLayout: React.FC = () => {
  const [showNav, setShowNav] = useState(false);
  const [darkTheme, setDarkTheme] = useState(getTheme());
  const [loading, setLoading] = useState(false);
  const { isAdmin, logout: userLogout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(setLoading, navigate); // ✅ Ensure Interceptors are Set Up Once
  }, [navigate]);

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

  // Logout user
  const handleLogout = async () => {
    await logout();
    userLogout();
    showHideNav();
  };

  useEffect(() => {
    document.body.className = getTheme();
  }, [darkTheme]);

  // Function to toggle dark theme
  const changeThemeHandler = () => {
    setTheme(setDarkTheme);
  };
  return (
    <>
      {loading && <Loader />}
      <nav className="nav">
        <div className="container nav__container">
          <Link to="/results" className="nav__logo">
            Election Voting App
          </Link>

          <div>
            {showNav && (
              <menu>
                {isAdmin && (
                  <NavLink to="/elections" onClick={toggleTheme}>
                    Elections
                  </NavLink>
                )}
                <NavLink to="/results" onClick={toggleTheme}>
                  Results
                </NavLink>
                <NavLink to="/" onClick={handleLogout}>
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
      <Outlet />
    </>
  );
};

export default PrivateLayout;
