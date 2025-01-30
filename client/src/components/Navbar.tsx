import "./Navbar.css";

import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";

import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineBars3 } from "react-icons/hi2";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="nav">
      <div className="container nav__container">
        <Link to="/" className="nav__logo">
          Election Voting App
        </Link>

        <div>
          <menu>
            <NavLink to="/elections" className="nav-link">
              Elections
            </NavLink>
            <NavLink to="/results" className="nav-link">
              Results
            </NavLink>
            <NavLink to="/logout" className="nav-link">
              Logout
            </NavLink>
          </menu>
          <button className="theme__toggle-btn">
            <IoIosMoon />
          </button>
          <button className="nav__toggle-btn">
            <HiOutlineBars3 />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
