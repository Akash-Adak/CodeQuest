import React, { useState } from 'react';
import { Copy, LinkIcon, Play } from 'lucide-react';
import '../styles/MockInterviewSetup.css';

const MockInterviewSetup = () => {
  const [domain, setDomain] = useState('Algorithms');
  const [difficulty, setDifficulty] = useState('Easy');
  const [timeLimit, setTimeLimit] = useState(30);
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteLink = () => {
    const link = `${window.location.origin}/interview/join/${Math.random().toString(36).substr(2, 8)}`;
    setInviteLink(link);
  };

  const handleStartInterview = () => {
    alert(`Starting ${difficulty} ${domain} interview for ${timeLimit} minutes.`);
  };

  return (
    <div className="interview-container">
      <h2 className="interview-title">Mock Interview Setup</h2>

      <div className="form-group">
        <label>Select Domain</label>
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option>Algorithms</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>System Design</option>
        </select>
      </div>

      <div className="form-group">
        <label>Difficulty Level</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div className="form-group">
        <label>Time Limit (minutes)</label>
        <input
          type="number"
          min={5}
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />
      </div>

      <div className="form-group">
        <button className="invite-btn" onClick={generateInviteLink}>
          <LinkIcon size={16} /> Generate Invite Link
        </button>
        {inviteLink && (
          <div className="invite-link">
            <span>{inviteLink}</span>
            <button onClick={() => navigator.clipboard.writeText(inviteLink)}>
              <Copy size={16} />
            </button>
          </div>
        )}
      </div>

      <button className="start-btn" onClick={handleStartInterview}>
        <Play size={18} /> Start Interview
      </button>
    </div>
  );
};

export default MockInterviewSetup;
