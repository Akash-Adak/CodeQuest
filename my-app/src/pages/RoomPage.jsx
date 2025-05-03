import React, { useState, useEffect, useRef } from "react";
import WebSocketService from "../services/WebSocketService";
import CodeEditor from "../components/CodeEditor";
import "../styles/RoomPage.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
    const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [participant, setParticipant] = useState("");
  const [connected, setConnected] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [code, setCode] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [output, setOutput] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [participants, setParticipants] = useState([]);
  const codeRef = useRef("");
  const location = useLocation();
  const [username, setUsername] = useState(location?.state?.username || "Admin");
  const roomIdFromState = location?.state?.roomId || "";

  useEffect(() => {
    if (roomIdFromState) {
      setRoomId(roomIdFromState);
      setParticipant(username);
      setConnected(true);
    }
  }, [roomIdFromState, username]);

  useEffect(() => {
    if (connected && roomId && WebSocketService.stompClient?.connected) {
      WebSocketService.connect(
        roomId,
        (participantsList) => setParticipants(participantsList),
        (codeMessage) => {
          setCode(codeMessage);
          codeRef.current = codeMessage;
        },
        () => {
          alert("WebSocket connection failed.");
        }
      );

      WebSocketService.sendMessage(JSON.stringify({ roomId, participant, type: "join" }));

      return () => {
        WebSocketService.sendMessage(JSON.stringify({ roomId, participant, type: "leave" }));
        WebSocketService.disconnect();
      };
    }
  }, [connected, roomId, participant]);

  const handleCircleClick = () => {
    if (timerActive) return;
    const duration = parseInt(prompt("Enter timer duration (in seconds):", "300"), 10);
    if (!isNaN(duration) && duration > 0) {
      setTimer(duration);
      setTimerActive(true);
      if (intervalId) clearInterval(intervalId);
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
    WebSocketService.sendCodeMessage(newCode);
  };

  const handleRunCode = async () => {
    const response = await fetch("http://localhost:8080/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    const data = await response.json();
    setOutput(data.output);
  };

  const handleSubmitCode = () => {
    if (window.confirm("Submit your code?")) {
      WebSocketService.sendMessage(
        JSON.stringify({ participant, content: codeRef.current }),
        `/app/code/${roomId}/submit`
      );
      alert("Code submitted successfully!");
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="room-header">
        <div className="header-left">
          <button className="invite-btn" onClick={() => setShowInvite(true)}>
            Invite Link
          </button>
          <div className="participants-list">
            {participants.map((p, index) => (
              <div key={index} className="participant-name">{p}</div>
            ))}
          </div>
        </div>
        <div className="header-right">
          <span className="timer" onClick={handleCircleClick}>
            ⏱ {formatTime(timer)}
          </span>
        </div>
        <button
          className="end-btn"
          onClick={() => {
            if (window.confirm("Are you sure you want to end this session?")) {
              WebSocketService.sendMessage(
                JSON.stringify({ roomId, participant, type: "leave" })
              );
              WebSocketService.disconnect();
              navigate("/dashboard"); // Or "/rooms" or wherever you want
            }
          }}
        >
          ❌ End Session
        </button>
      </header>

      {/* Invite Popup */}
      {showInvite && (
        <>
          <div className="invite-overlay" onClick={() => setShowInvite(false)}></div>
          <div className="invite-popup">
            <div className="invite-content">
              <h3>🔗 Invite to Room</h3>
              <input
                type="text"
                value={`http://localhost:5173/roompage/${roomId}`}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`http://localhost:5173/roompage/${roomId}`);
                  alert("📋 Link copied to clipboard!");
                }}
              >
                📋 Copy Link
              </button>
              <button className="close-btn" onClick={() => setShowInvite(false)}>
                ❌ Close
              </button>
            </div>
          </div>
        </>
      )}


      {/* Code Editor */}
      <div className="editor-container">
        <CodeEditor code={code} onCodeChange={handleCodeChange} language={language} />
      </div>
    </div>
  );
};

export default RoomPage;
