import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaHome,
  FaDoorOpen,
  FaComments,
  FaInfoCircle,
  FaTimes,
  FaBars,
  FaRocket
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const NavLink = memo(({ to, label, icon, onClick, className = "" }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 ${className}`}
  >
    {icon}
    <span>{label}</span>
  </Link>
));

NavLink.displayName = "NavLink";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("profile");
    onLogout();
    navigate("/landing");
  }, [onLogout, navigate]);

  const toggleDropdown = useCallback(() => setShowDropdown((prev) => !prev), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const toggleDarkMode = useCallback(() => setDarkMode(!darkMode), [darkMode, setDarkMode]);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  if (location.pathname.startsWith("/interviewPanel")) return null;

  const navItems = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/room", label: "Rooms", icon: <FaDoorOpen /> },
    { to: "/InterviewTypes", label: "Interview", icon: <FaComments /> },
    { to: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaRocket className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CodeQuest
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <motion.div
              animate={{
                scale: searchFocused ? 1.02 : 1,
              }}
              className="hidden lg:flex items-center flex-1 max-w-md mx-8"
            >
              <div className={`w-full flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl transition-all duration-300 ${
                searchFocused ? "ring-2 ring-purple-500 shadow-lg" : "shadow-md"
              }`}>
                <FaSearch className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies, jobs, interviews..."
                  className="bg-transparent focus:outline-none text-sm text-gray-700 dark:text-white w-full placeholder-gray-500 dark:placeholder-gray-400"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map(({ to, label, icon }) => (
                <NavLink key={to} to={to} label={label} icon={icon} />
              ))}

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                whileTap={{ rotate: 180, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-xl p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-300 hover:shadow-lg"
                aria-label="Toggle theme"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </motion.button>

              {/* Profile Dropdown or Auth Buttons */}
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    aria-expanded={showDropdown}
                  >
                    <FaUser className="text-sm" />
                    <span className="hidden lg:inline font-medium">Profile</span>
                    <motion.span
                      animate={{ rotate: showDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl py-3 z-50 border border-gray-200 dark:border-gray-700 backdrop-blur-lg"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:scale-105"
                        >
                          <FaUser className="mr-3 text-purple-500" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:scale-105"
                        >
                          <FaCog className="mr-3 text-purple-500" />
                          View Profile
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-105"
                        >
                          <FaSignOutAlt className="mr-3" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-all duration-300"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className={`flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl transition-all duration-300 ${
              searchFocused ? "ring-2 ring-purple-500 shadow-lg" : "shadow-md"
            }`}>
              <FaSearch className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, jobs..."
                className="bg-transparent focus:outline-none text-sm text-gray-700 dark:text-white w-full placeholder-gray-500 dark:placeholder-gray-400"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden overflow-y-auto border-l border-gray-200 dark:border-gray-800"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={closeMenu}
                  className="absolute top-6 right-6 text-2xl p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-all duration-300"
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 pt-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaRocket className="text-white text-xl" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    CodeQuest
                  </span>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-2">
                  {navItems.map(({ to, label, icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      label={label}
                      icon={icon}
                      onClick={closeMenu}
                      className="px-4 py-4 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 text-base font-medium"
                    />
                  ))}

                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      closeMenu();
                    }}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 transition-all duration-300 text-base font-medium"
                  >
                    {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-purple-500" />}
                    <span>Toggle Theme</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                  {/* Auth Section */}
                  {token ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 transition-all duration-300 text-base font-medium"
                      >
                        <FaUser className="text-purple-500" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 transition-all duration-300 text-base font-medium"
                      >
                        <FaCog className="text-purple-500" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all duration-300 text-base font-medium"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex items-center justify-center px-6 py-4 rounded-2xl border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-base font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMenu}
                        className="flex items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg text-base font-medium"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;