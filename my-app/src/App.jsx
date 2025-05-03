import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useMatch } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import LandingPage from "./pages/LandingPage";
import OAuth2Success from "./components/OAuth2Success";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import MockInterviewSetup from "./components/MockInterviewSetup";
import Navbar from "./pages/Navbar";
import ProblemLibrary from "./pages/ProblemLibrary";
import AdminPanel from "./admin/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import Room from "./pages/Room";
import CodeEditor from "./components/CodeEditor";
import { Toaster } from 'react-hot-toast';
import InterviewTypes from "./interview/InterviewTypes";
import CommunicationPanel from "./communicate/CommunicationPanel";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import InterviewDashboard from "./interview/InterviewDashboard";
import InterviewPanel from "./interview/InterviewPanel";
import RequireAuth from "./services/RequireAuth";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const location = useLocation();

  // useMatch for dynamic routes
  const roomPageMatch = useMatch("/roompage/:roomId");  // Match the dynamic RoomPage route

  // Logic to hide navbar for RoomPage
  const showNavbar = !roomPageMatch;  // If we're on a RoomPage route, hide navbar

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
      {showNavbar && <Navbar token={token} onLogout={handleLogout} />}
      <Routes>
        {/* Default route: Landing Page */}
        <Route path="/" element={<LandingPage onSignInSuccess={handleSignInSuccess} />} />

        {/* Optional separate landing route */}
        <Route path="/landing" element={<LandingPage onSignInSuccess={handleSignInSuccess} />} />

        {/* SignUp Page */}
        <Route path="/auth" element={<SignUp onSignUpSuccess={handleSignUpSuccess} />} />

        {/* Login Page */}
        <Route path="/login" element={<Login onLoginSuccess={(token) => setToken(token)} />} />

        {/* OAuth2 Success Callback */}
        <Route path="/oauth2-success" element={<OAuth2Success onSignInSuccess={handleSignInSuccess} onSignUpSuccess={handleSignUpSuccess} />} />

        {/* Protected Room Page */}
       <Route
         path="/roompage/:roomId"
         element={
           <RequireAuth>
             <RoomPage />
           </RequireAuth>
         }
       />

        <Route path="/room" element={<Room />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/problems" element={<ProblemLibrary />} />
        <Route path="/PerformanceDashboard" element={<PerformanceDashboard />} />
        <Route path="/communication" element={<CommunicationPanel />} />
        <Route path="/InterviewDashboard" element={<InterviewDashboard />} />
        <Route path="/InterviewTypes" element={<InterviewTypes />} />
        <Route path="/InterviewPanel" element={<InterviewPanel />} />
        <Route path="/CodeEditor" element={<CodeEditor />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard onSignInSuccess={handleSignInSuccess} />} />

        {/* Mock Interview Setup Page */}
        <Route path="/mockInterview" element={<ProtectedRoute><MockInterviewSetup /></ProtectedRoute>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
