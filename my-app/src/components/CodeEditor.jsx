import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/CodeEditor.css";
import { useTheme } from "../context/ThemeContext";
import WebSocketService from "../services/WebSocketService"; // ⬅️ Import WebSocket service

const CodeEditor = ({ roomId, participant }) => {
  const { darkMode } = useTheme();
  const [code, setCode] = useState("print('Hello, World!')");
  const [languageId, setLanguageId] = useState("71");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(300);
  const [active, setActive] = useState(false);
  const [participants, setParticipants] = useState([]);
  const codeRef = useRef(code);
const [showInvitePopup, setShowInvitePopup] = useState(false);

// Toggle the popup visibility
const toggleInvitePopup = () => setShowInvitePopup(!showInvitePopup);
  useEffect(() => {
    let interval;
    if (active && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [active, timer]);

  useEffect(() => {
    // Connect to WebSocket room
    WebSocketService.connect(
      roomId,
      () => {
        console.log("Connected to WebSocket room:", roomId);
        WebSocketService.sendMessage(JSON.stringify({ type: "join", participant }), `/app/code/${roomId}`);
      },
      (message) => {
        // Listen for incoming code updates
        if (typeof message === "string") {
          setCode(message);
          codeRef.current = message;
        }
      },
      (participants) => {
        // Update participants list when someone joins or leaves
        setParticipants(participants);
      },
      () => {
        console.error("WebSocket connection error.");
      }
    );

    return () => {
      WebSocketService.sendMessage(JSON.stringify({ type: "leave", participant }), `/app/code/${roomId}`);
      WebSocketService.disconnect();
    };
  }, [roomId, participant]);

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const handleRunCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/execute", {
        code,
        languageId,
        input,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.error || "Execution failed");
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
    WebSocketService.sendCodeMessage(newCode); // ⬅️ Broadcast code
  };

  const handleLanguageChange = (val) => {
    setLanguageId(val);
    const langMap = { 71: "python", 62: "java", 63: "javascript", 54: "cpp", 50: "c" };
    setLanguage(langMap[val]);
  };

  // Generate an invite link to the current room
  const inviteLink = `${window.location.origin}/roompage/${roomId}`;

  // Function to generate a random color for each participant's logo
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className={`editor-container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <div className="header-left">
          <span className="timer" onClick={() => setActive(!active)}>⏱ {formatTime(timer)}</span>
          <select value={languageId} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="71">Python</option>
            <option value="62">Java</option>
            <option value="63">JavaScript</option>
            <option value="54">C++</option>
            <option value="50">C</option>
          </select>
           <button className="run-btn" onClick={handleRunCode}>🚀 Run</button>
        </div>
      </div>
      <div className="main-area">
        <div className="editor-left">
          <Editor
            height="80vh"
            language={language}
            theme={darkMode ? "vs-dark" : "light"}
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
            }}
          />
        </div>

        <div className="editor-right">
          <h3>📤 Output:</h3>
          <pre className="output-box">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
