import "./PrivateLayout.css";

import React, { useEffect, useState } from "react";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import logoSmall from "assets/images/logo/logo-small.png";
import logo from "assets/images/logo/logo.png";
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

  useEffect(() => {
    setupAxiosInterceptors(setLoading, navigate, user, setUser); // ✅ Ensure Interceptors are Set Up Once
  }, [navigate, user, setUser]);

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
  const handleNavToggle = () => {
    showHideNav();
  };

  // Logout user
  const handleLogout = async () => {
    await voterService.logout();
    userLogout();
    showHideNav();
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
                  <NavLink to="/elections" onClick={handleNavToggle}>
                    <picture>
                      <source media="(max-width: 600px)" srcSet={logoSmall} />
                      <img src={logo} alt="Votely Logo" className="nav__logo" />
                    </picture>
                  </NavLink>
                )}
                <NavLink to="/results" onClick={handleNavToggle}>
                  Results
                </NavLink>
                <NavLink to="/" onClick={handleLogout}>
                  Logout
                </NavLink>
              </menu>
            )}
            <button className="theme__toggle-btn" onClick={toggleTheme}>
              {theme === "dark" ? <IoMdSunny /> : <IoIosMoon />}
            </button>
            <div>
              <p>
                <FaUser /> {user?.fullName}{" "}
              </p>
            </div>
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
