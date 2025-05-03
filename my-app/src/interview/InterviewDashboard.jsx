import React, { useState, useEffect } from "react";
import "../styles/InterviewDashboard.css";

const InterviewDashboard = () => {
  const [pastInterviews, setPastInterviews] = useState([
    {
      id: 1,
      name: "Practice Interview",
      time: "2025/05/03 08:41:08",
    },
  ]);

  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("dark")
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  // Handle Create Interview click
  const handleCreateInterview = () => {
    alert("Navigate to create interview page!");
    // Example: navigate("/interview/create") if using React Router
  };

  // Handle delete past interview
  const handleDeleteInterview = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this interview?");
    if (confirmed) {
      setPastInterviews((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="dashboard">


      {/* Main Content */}
      <div className="main-content">
        {/* Create Interview Card */}
        <div className="card create-card" onClick={handleCreateInterview}>
          <img src="/static/create-icon.png" alt="Create" className="create-icon" />
          <div className="card-title">Create an interview</div>
        </div>

        {/* Past Interviews */}
        <div className="card past-card">
          <h2 className="card-title">Past Interviews</h2>
          {pastInterviews.length === 0 ? (
            <p>No interviews yet.</p>
          ) : (
            pastInterviews.map((interview) => (
              <div className="interview-item" key={interview.id}>
                <div>
                  <div className="interview-name">{interview.name}</div>
                  <div className="interview-time">{interview.time}</div>
                </div>
                <button
                  className="interview-action"
                  onClick={() => handleDeleteInterview(interview.id)}
                >
                  ➖
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Monthly Usage */}
      <div className="usage-card">
        <div className="usage-header">
          <span>Month's usage</span>
          <span className="usage-count">{pastInterviews.length}/10 used</span>
        </div>
        <div className="usage-bar-background">
          <div
            className="usage-bar"
            style={{ width: `${(pastInterviews.length / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDashboard;
