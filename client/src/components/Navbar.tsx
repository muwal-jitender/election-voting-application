import "./Navbar.css"; // Assuming you have some CSS for styling

import { Link } from "react-router-dom";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Election Voting App</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">
            About
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
