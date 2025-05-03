// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaUser, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";
import "../styles/Navbar.css";
import { useTheme } from "../context/ThemeContext";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));

  const { darkMode, setDarkMode } = useTheme();
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/landing");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };





  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar sticky-navbar">
      <div className="navbar-logo">
        <Link to="/">CodeQuest</Link>
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      {/* Animated Search Bar */}
      <div className={`navbar-search ${searchFocused ? "focused" : ""} ${menuOpen ? "active" : ""}`}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search companies, jobs..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className={`navbar-buttons ${menuOpen ? "active" : ""}`}>
        {/* Sun/Moon Toggle */}
      <button onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? "☀️" : "🌙"}
          </button>

        {token ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="btn btn-profile">
              <FaUser className="inline-icon" /> Profile ▼
            </button>
            <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <Link to="/dashboard" className="dropdown-item">
                <FaUser className="inline-icon" /> View Profile
              </Link>
              <Link to="/profile" className="dropdown-item">
                <FaCog className="inline-icon" /> Settings
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                <FaSignOutAlt className="inline-icon" /> Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-link">Login</Link>
            <Link to="/auth" className="btn btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
