// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaUser, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
        <button onClick={toggleDarkMode} className="btn btn-darkmode">
          {darkMode ? <FaSun className="sun" /> : <FaMoon className="moon" />}
        </button>

        {token ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="btn btn-profile">
              <FaUser className="inline-icon" /> Profile ▼
            </button>
            <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <Link to="/profile" className="dropdown-item">
                <FaUser className="inline-icon" /> View Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
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
