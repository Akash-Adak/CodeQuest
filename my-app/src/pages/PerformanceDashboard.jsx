// src/components/PerformanceDashboard.jsx
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../styles/PerformanceDashboard.css";

const skillData = [
  { name: "Week 1", DSA: 40, SystemDesign: 20 },
  { name: "Week 2", DSA: 55, SystemDesign: 35 },
  { name: "Week 3", DSA: 70, SystemDesign: 50 },
  { name: "Week 4", DSA: 80, SystemDesign: 65 },
];

const activityData = Array.from({ length: 100 }).map((_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  count: Math.floor(Math.random() * 3),
}));

const PerformanceDashboard = () => {
  return (
    <div className="performance-dashboard">
      <h2>Analytics & Performance</h2>

      {/* Summary Metrics */}
      <div className="metrics">
        <div className="metric-box">
          <h3>Success Rate</h3>
          <p>78%</p>
        </div>
        <div className="metric-box">
          <h3>Interviews Taken</h3>
          <p>24</p>
        </div>
        <div className="metric-box">
          <h3>Avg. Score</h3>
          <p>82/100</p>
        </div>
      </div>

      {/* Skill Improvement */}
      <div className="chart-section">
        <h3>Skill-wise Improvement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skillData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="DSA" stroke="#6366f1" />
            <Line type="monotone" dataKey="SystemDesign" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Heatmap */}
      <div className="heatmap-section">
        <h3>Activity Heatmap</h3>
        <CalendarHeatmap
          startDate={new Date(Date.now() - 90 * 86400000)}
          endDate={new Date()}
          values={activityData}
          classForValue={(val) =>
            !val ? "color-empty" : `color-scale-${val.count}`
          }
        />
      </div>
    </div>
  );
};

export default PerformanceDashboard;
