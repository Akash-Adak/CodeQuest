import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';


const LandingPage = () => {
//   const [darkMode, setDarkMode] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  return (
    <div className={`page-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <h1 className="title">Welcome to CodeQuest</h1>
        <p className="subtitle">Your platform for collaborative coding interviews and mock sessions</p>

      </header>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3 className="feature-title">Real-Time Coding Interviews</h3>
            <p className="feature-description">
              Collaborate in real-time with interviewers or peers on coding tasks. Write and test code within the platform.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-title">Mock Interviews</h3>
            <p className="feature-description">
              Simulate real-world interviews with timed tasks and predefined questions.
            </p>
          </div>
          <Link to="/mockInterview" >
          <div className="feature-item">
            <h3 className="feature-title">Collaborative Coding</h3>
            <p className="feature-description">
              Work with others in virtual rooms on coding challenges, ideal for pair programming.
            </p>
          </div>
          </Link>
          <div className="feature-item">
            <h3 className="feature-title">Performance Tracking</h3>
            <p className="feature-description">
              Receive feedback and track your progress through coding challenges and mock interviews.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-text">© 2025 CodeQuest - All rights reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;
