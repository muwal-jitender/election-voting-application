import "react-tooltip/dist/react-tooltip.css";
import "./PrivateLayout.css";

import React, { useEffect, useState } from "react";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import ConfirmModal from "components/modals/ConfirmModal";
import Enable2FAModal from "components/modals/Enable2FAModal";
import { LogoIcon } from "components/ui";
import { useTheme } from "context/ThemeContext";
import { useUser } from "context/UserContext";
import { useWindowWidth } from "hooks/useWindowWidth";
import { AiOutlineClose } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import { toast } from "react-toastify";
import { setupAxiosInterceptors } from "services/axios.config";
import { voterService } from "services/voter.service";
import { RootState } from "store/store";
import { UiActions } from "store/ui-slice";
import { IErrorResponse } from "types";
import Loader from "./Loader";

const PrivateLayout: React.FC = () => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 600;
  const [showNav, setShowNav] = useState(!isMobile);
  const { name: theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { isAdmin, logout: userLogout, setUser, user, fetchUser } = useUser();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Set up Axios interceptors on first render
  useEffect(() => {
    setupAxiosInterceptors(setLoading, navigate, user, setUser);
  }, [navigate, user, setUser]);

  // ✅ Update showNav reactively on screen size change
  useEffect(() => {
    setShowNav(!isMobile);
  }, [isMobile]);

  const showHideNav = () => {
    if (isMobile) {
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
  const open2FAModal = () => {
    showHideNav();
    // 🌀 Dispatch action to open 2FA modal
    dispatch(UiActions.open2FAAuthenticationModal());
  };
  const show2FAModal = useSelector(
    (state: RootState) => state.ui.enable2FAModalShowing,
  );
  const applyActiveClass = (isActive: boolean) => {
    if (!isActive) return undefined;
    return windowWidth > 600 ? "active-link" : undefined;
  };

  /** ✅ Open the confirm vote modal */
  const handleCastingVote = () => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Turn Off Two-Factor Authentication?",
        callback: async () => {
          try {
            const response = await voterService.disable2FA();
            toast.success(
              response.message ||
                "Two-Factor Authentication has been disabled successfully.",
            );

            user && setUser({ ...user, is2FAEnabled: false });

            showHideNav();
          } catch (error: unknown) {
            toast.error((error as IErrorResponse).errorMessages);
          }
        },
      }),
    );
  };

  return (
    <>
      {/* 🌀 Show loader when loading */}
      {loading && <Loader />}

      {/* 🧭 Navigation Bar */}
      <nav className="nav" role="navigation">
        <div className="container nav__container">
          <Link to="/results" className="nav__logo">
            <LogoIcon />
          </Link>

          {/* 📋 Navigation Links, Theme Toggle, User Info, and Menu Button */}
          <div>
            {/* 📁 Navigation Menu */}
            {showNav && (
              <menu>
                {!user?.is2FAEnabled && (
                  <NavLink to="#" onClick={open2FAModal}>
                    Enable Two-Factor Authentication
                  </NavLink>
                )}
                {user?.is2FAEnabled && (
                  <NavLink to="#" onClick={handleCastingVote}>
                    Disable Two-Factor Authentication
                  </NavLink>
                )}
                {/* ✅ Show "Elections" link only for admin users */}
                {isAdmin && (
                  <NavLink
                    to="/elections"
                    onClick={handleNavToggle}
                    // 🔽 Highlight link with white underline when it's active (for admin)
                    className={({ isActive }) => applyActiveClass(isActive)}
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
                    isAdmin ? applyActiveClass(isActive) : undefined
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
            <button
              className="theme__toggle-btn"
              onClick={toggleTheme}
              title="Toggle theme"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
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
              title={showNav ? "Close menu" : "Open menu"}
              aria-label={
                showNav ? "Close navigation menu" : "Open navigation menu"
              }
            >
              {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📄 Main Page Content */}
      <Outlet />
      {/* 🛑 Global Confirmation Modal */}
      <ConfirmModal />
      {show2FAModal && <Enable2FAModal />}
    </>
  );
};

export default PrivateLayout;
