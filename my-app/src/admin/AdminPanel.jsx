// AdminPanel.jsx
import React, { useState } from "react";

const AdminPanel = () => {
  const [problem, setProblem] = useState({
    title: "",
    category: "DSA",
    difficulty: "Easy",
    tags: [],
    description: "",
  });

  const handleSubmit = async () => {
    // POST or PUT to backend API
    // await axios.post("/api/problems", problem);
  };

  return (
    <div className="admin-panel">
      <h2>Add / Update Problem</h2>
      <input type="text" placeholder="Title" onChange={(e) => setProblem({ ...problem, title: e.target.value })} />
      <textarea placeholder="Description" onChange={(e) => setProblem({ ...problem, description: e.target.value })} />
      <select onChange={(e) => setProblem({ ...problem, category: e.target.value })}>
        <option value="DSA">DSA</option>
        <option value="System Design">System Design</option>
        <option value="DB Queries">DB Queries</option>
        <option value="Frontend">Frontend</option>
      </select>
      <select onChange={(e) => setProblem({ ...problem, difficulty: e.target.value })}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <input
        type="text"
        placeholder="Tags (comma separated)"
        onChange={(e) => setProblem({ ...problem, tags: e.target.value.split(",") })}
      />
      <button onClick={handleSubmit}>Save Problem</button>
    </div>
  );
};

export default AdminPanel;
