// ProblemLibrary.jsx
import React, { useState, useEffect } from "react";
import "../styles/ProblemLibrary.css";

const ProblemLibrary = () => {
  const [problems, setProblems] = useState([]);
  const [filters, setFilters] = useState({ category: "", difficulty: "", tag: "" });

  useEffect(() => {
    // Fetch filtered problems from API (mocked)
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    // Call your backend with filter query
    // setProblems(response.data);
  };

  return (
    <div className="library-container">
      <h2>Problem Library</h2>
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="DSA">DSA</option>
          <option value="System Design">System Design</option>
          <option value="DB Queries">DB Queries</option>
          <option value="Frontend">Frontend</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          type="text"
          placeholder="Tag (e.g. arrays, react)"
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        />
      </div>
      <div className="problem-list">
        {problems.map((problem) => (
          <div key={problem.id} className="problem-card">
            <h3>{problem.title}</h3>
            <p>Category: {problem.category}</p>
            <p>Difficulty: {problem.difficulty}</p>
            <p>Tags: {problem.tags.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemLibrary;
