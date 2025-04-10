import "./PrivateLayout";

import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getTheme, setTheme } from "../../utils/theme.utils";

import Loader from "./Loader";
import LogoIcon from "components/ui/LogoIcon";
import { setupAxiosInterceptors } from "../../services/axios.config";
import { useUser } from "context/UserContext";

const PublicLayout: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(getTheme());
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useUser();
  const navigate = useNavigate();

  // ✅ Set up Axios interceptors on mount
  useEffect(() => {
    setupAxiosInterceptors(setLoading, navigate, user, setUser);
  }, [navigate, user, setUser]);

  // ✅ Update document body class when theme changes
  useEffect(() => {
    document.body.className = getTheme();
  }, [darkTheme]);

  // 🌗 Toggle theme handler
  const changeThemeHandler = () => {
    setTheme(setDarkTheme);
  };

  return (
    <>
      {/* 🌀 Show loader while loading */}
      {loading && <Loader />}

      {/* 🧭 Public Navigation Bar */}
      <nav className="nav">
        <div className="container nav__container">
          {/* 🗳️ Logo (responsive) */}
          <Link to="/" className="nav__logo">
            <LogoIcon />
          </Link>

          {/* 🌗 Theme Toggle Button */}
          <div>
            <button
              className="theme__toggle-btn"
              onClick={changeThemeHandler}
              title="Toggle theme"
              aria-label={
                darkTheme ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkTheme ? <IoMdSunny /> : <IoIosMoon />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📄 Main Content for Public Routes */}
      <Outlet />
    </>
  );
};

export default PublicLayout;
