import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/landing");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
    <nav className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        <Link to="/">CodeQuest</Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
        ☰
      </div>

      {/* Search Bar */}
      <div
        className={`hidden md:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full transition ${
          searchFocused ? "ring-2 ring-blue-400" : ""
        }`}
      >
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search companies, jobs..."
          className="bg-transparent focus:outline-none text-sm text-gray-700 dark:text-white"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Navbar Buttons */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:flex items-center gap-4 px-4 py-4 md:py-0 md:px-0 transition-all duration-300 ease-in-out ${
          menuOpen ? "block" : "hidden"
        } md:flex-row`}
      >
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-xl hover:text-yellow-500 dark:hover:text-yellow-300 transition"
          title="Toggle theme"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Auth Buttons or Profile Dropdown */}
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaUser /> Profile ▼
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaUser className="mr-2" /> View Profile
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaCog className="mr-2" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
