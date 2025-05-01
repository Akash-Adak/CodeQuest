import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import LandingPage from "./pages/LandingPage";
import OAuth2Success from "./components/OAuth2Success";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import MockInterviewSetup from "./components/MockInterviewSetup";
import './styles/global.css';
import Navbar from "./pages/Navbar";
import { Toaster } from 'react-hot-toast';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
// index.js or App.jsx
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

  const handleSignInSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const handleSignUpSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // ProtectedRoute component to restrict access
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
    <Router>
      <Navbar token={token} onLogout={handleLogout} />
      <Routes>
        {/* Default route: Landing Page */}
        <Route path="/" element={<LandingPage onSignInSuccess={handleSignInSuccess} />} />

        {/* Optional separate landing route */}
        <Route path="/landing" element={<LandingPage onSignInSuccess={handleSignInSuccess} />} />

        {/* SignUp Page */}
        <Route path="/auth" element={<SignUp onSignUpSuccess={handleSignUpSuccess} />} />

        {/* Login Page */}
        <Route path="/login" element={<Login onSignInSuccess={handleSignInSuccess} />} />

        {/* OAuth2 Success Callback */}
        <Route path="/oauth2-success" element={<OAuth2Success onSignInSuccess={handleSignInSuccess} onSignUpSuccess={handleSignUpSuccess} />} />

        {/* Protected Room Page */}
        <Route
          path="/room"
          element={
            <ProtectedRoute>
              <RoomPage token={token} />
            </ProtectedRoute>
          }
        />

        {/* Alternative Room Route without protection (for testing) */}
        {/* <Route path="/room" element={<RoomPage token={token} />} /> */}

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard onSignInSuccess={handleSignInSuccess} />} />

        {/* Mock Interview Setup Page */}
        <Route path="/mockInterview" element={<MockInterviewSetup />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
    </div>
  );
}

export default App;
