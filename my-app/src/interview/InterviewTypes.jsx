// src/pages/InterviewTypes.jsx
import React from "react";
import "../styles/InterviewTypes.css";
import { Link } from "react-router-dom";

const InterviewTypes = () => {
  const types = [
    {
      title: "Mock Interviews",
      description: "Simulated interviews with AI or mentor. Auto-evaluated and timed sessions.",
      action: "Start Mock Interview",
      route: "/mock-interview",
    },
    {
      title: "Peer Interviews",
      description: "Pair up with other users for real-time coding practice.",
      action: "Find Peer",
      route: "/peer-match",
    },
    {
      title: "Mentor Interviews",
      description: "Book paid/live sessions with industry experts for in-depth guidance.",
      action: "Book Mentor",
      route: "/mentor-interview",
    },
    {
      title: "Custom Interview Rooms",
      description: "Create private rooms and share invite links for custom sessions.",
      action: "Create Room",
      route: "/room",
    },
  ];

  return (
    <div className="interview-types-container">
      <h2>Interview Types</h2>
      <div className="interview-grid">
        {types.map((type, index) => (
          <div className="interview-card" key={index}>
            <h3>{type.title}</h3>
            <p>{type.description}</p>
            <Link to={type.route} className="btn">{type.action}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewTypes;
