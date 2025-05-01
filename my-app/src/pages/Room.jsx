// src/components/Room.jsx
import React, { useEffect, useState, useRef } from "react";
import WebSocketService from "../services/WebSocketService";
import { Editor } from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Room.css"; // ✅ Create this new CSS file
import toast from 'react-hot-toast'; // 👈 Import this at the top

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    WebSocketService.connect(roomId, (newCode) => {
      if (editorRef.current && newCode !== code) {
        isRemoteChange.current = true;
        const editor = editorRef.current;
        const model = editor.getModel();
        const fullRange = model.getFullModelRange();
        editor.executeEdits(null, [
          {
            range: fullRange,
            text: newCode,
            forceMoveMarkers: true,
          },
        ]);
        isRemoteChange.current = false;
      }
      setCode(newCode);
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, [roomId, code]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (!isRemoteChange.current) {
      WebSocketService.sendMessage(value);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

const handleCreateRoom = () => {
  const newRoomId = Math.random().toString(36).substring(2, 10);
  navigate(`/room/${newRoomId}`);
  toast.success('New Classroom Created!');
};


  return (
    <div className="room-container">
      <div className="room-header">
        <h2>Classroom ID: <span className="room-id">{roomId}</span></h2>
       <button onClick={handleJoin} className="btn btn-join">Join Room</button>
          + Create New Classroom
        </button>
      </div>

      <div className="editor-container">
        <Editor
          height="80vh"
          language="javascript"
          value={code}
          onChange={handleEditorChange}
          theme={document.documentElement.classList.contains('dark') ? "vs-dark" : "light"}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default Room;
