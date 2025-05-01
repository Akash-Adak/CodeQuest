// src/components/CommunicationPanel.jsx
import React, { useState } from "react";
import "../styles/CommunicationPanel.css";

const CommunicationPanel = ({ onBookmark }) => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [notes, setNotes] = useState("");

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { text: chatInput, sender: "You" }]);
    setChatInput("");
  };

  return (
    <div className="communication-panel">
      <h3>Live Chat</h3>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <hr />

      <h3>Code Notes</h3>
      <textarea
        rows={4}
        placeholder="Add notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <hr />

      <div className="actions">
        <button onClick={onBookmark}>🔖 Bookmark Question</button>
        <button disabled title="Coming Soon">🎥 Start Video Call (WebRTC)</button>
      </div>
    </div>
  );
};

export default CommunicationPanel;
