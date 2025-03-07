import "./PrivateLayout";

import React, { useEffect, useState } from "react";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, Outlet } from "react-router-dom";
import { getTheme, setTheme } from "../../utils/theme.utils";

import { setupAxiosInterceptors } from "../../services/axios.config";
import Loader from "./Loader";

const PublicLayout: React.FC = () => {
  const VOTING_APP_THEME = "voting-app-theme";

  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem(VOTING_APP_THEME),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupAxiosInterceptors(setLoading); // ✅ Ensure Interceptors are Set Up Once
  }, []);

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
          <Link to="/" className="nav__logo">
            Election Voting App
          </Link>

          <div>
            <button className="theme__toggle-btn" onClick={changeThemeHandler}>
              {darkTheme ? <IoMdSunny /> : <IoIosMoon />}
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default PublicLayout;
