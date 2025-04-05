import "react-tooltip/dist/react-tooltip.css";
import "./PrivateLayout.css";

import React, { useEffect, useState } from "react";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import logoSmall from "assets/images/logo/logo-small.png";
import logo from "assets/images/logo/logo.svg";
import { useTheme } from "context/ThemeContext";
import { useUser } from "context/UserContext";
import { AiOutlineClose } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import { setupAxiosInterceptors } from "services/axios.config";
import { voterService } from "services/voter.service";
import Loader from "./Loader";

const PrivateLayout: React.FC = () => {
  const [showNav, setShowNav] = useState(false);
  const { name: theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { isAdmin, logout: userLogout, setUser, user } = useUser();

  const navigate = useNavigate();

  // ✅ Set up Axios interceptors on first render
  useEffect(() => {
    setupAxiosInterceptors(setLoading, navigate, user, setUser);
  }, [navigate, user, setUser]);

  // ✅ Show/hide navigation menu on window resize
  useEffect(() => {
    showHideNav();
    window.addEventListener("resize", showHideNav);
    return () => window.removeEventListener("resize", showHideNav);
  }, []);

  const showHideNav = () => {
    if (window.innerWidth < 600) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  };

  const handleNavToggle = () => {
    showHideNav();
  };

  const handleLogout = async () => {
    await voterService.logout();
    userLogout();
    showHideNav();
  };

  return (
    <>
      {/* 🌀 Show loader when loading */}
      {loading && <Loader />}

      {/* 🧭 Navigation Bar */}
      <nav className="nav">
        <div className="container nav__container">
          {/* 🗳️ Logo (responsive via <picture>) */}
          <Link to="/results" className="nav__logo">
            <picture>
              <source media="(max-width: 600px)" srcSet={logoSmall} />
              <img src={logo} alt="Votely Logo" />
            </picture>
          </Link>

          {/* 📋 Navigation Links, Theme Toggle, User Info, and Menu Button */}
          <div>
            {/* 📁 Navigation Menu */}
            {showNav && (
              <menu>
                {/* ✅ Show "Elections" link only for admin users */}
                {isAdmin && (
                  <NavLink
                    to="/elections"
                    onClick={handleNavToggle}
                    // 🔽 Highlight link with white underline when it's active (for admin)
                    className={({ isActive }) =>
                      isActive ? "active-admin" : undefined
                    }
                  >
                    Elections
                  </NavLink>
                )}

                {/* 🗳️ "Results" link is always visible 
                 ✅ Highlight only if user is admin and link is active */}
                <NavLink
                  to="/results"
                  onClick={handleNavToggle}
                  className={({ isActive }) =>
                    isActive && isAdmin ? "active-admin" : undefined
                  }
                >
                  Results
                </NavLink>

                {/* 🚪 "Logout" link – no active styling, simply logs user out */}
                <NavLink to="/" onClick={handleLogout}>
                  Logout
                </NavLink>
              </menu>
            )}

            {/* 🌗 Theme Toggle Button */}
            <button className="theme__toggle-btn" onClick={toggleTheme}>
              {theme === "dark" ? <IoMdSunny /> : <IoIosMoon />}
            </button>

            {/* 👤 User Info */}
            <address className="nav__user">
              <FaUser className="user__icon" />
              <span>{user?.fullName} </span>
            </address>

            {/* 📱 Navigation Toggle Button (Mobile) */}
            <button
              className="nav__toggle-btn"
              onClick={() => setShowNav(!showNav)}
            >
              {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📄 Main Page Content */}
      <Outlet />
    </>
  );
};

export default PrivateLayout;
