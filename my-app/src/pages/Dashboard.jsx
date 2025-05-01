import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ userName = "User" }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <h1>Welcome, {userName} 👋</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <section className="cards-section">
        <Link to="/room" className="dashboard-card">
          <h2>Join/Create Coding Room</h2>
          <p>Collaborate with peers or interviewers in live coding sessions.</p>
        </Link>

        <Link to="/mockInterview" className="dashboard-card">
          <h2>Start Mock Interview</h2>
          <p>Practice with timed coding tasks and mock interviews.</p>
        </Link>

        <Link to="/past-interviews" className="dashboard-card">
          <h2>View Past Interviews</h2>
          <p>Review your previous interviews and analyze your performance.</p>
        </Link>

        <Link to="/performance" className="dashboard-card">
          <h2>Performance Summary</h2>
          <p>Track your growth and view detailed coding statistics.</p>
        </Link>

        <Link to="/profile-settings" className="dashboard-card">
          <h2>Profile & Settings</h2>
          <p>Update your profile, manage account settings, and preferences.</p>
        </Link>
      </section>

      <section className="notifications-section">
        <h2>Recent Activity</h2>
        <ul className="notification-list">
          <li>✅ Completed a mock interview - 2 hours ago</li>
          <li>🆕 New room invitation from Alex</li>
          <li>📈 Performance updated for "Sorting Algorithms"</li>
          <li>🛠️ Profile updated - Yesterday</li>
        </ul>
      </section>

      <footer className="dashboard-footer">
        <p>© 2025 CodeQuest - Happy Coding!</p>
      </footer>
    </div>
  );
};

export default Dashboard;
