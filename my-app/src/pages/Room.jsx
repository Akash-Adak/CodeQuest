// src/components/Room.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Room.css";
import toast from "react-hot-toast";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!roomId || !username) {
      toast.error("Please enter both Room ID and your name.");
      return;
    }

    navigate(`/roompage/${roomId}`, { state: { roomId,username } });
    toast.success("Joined Room!");
  };

  const handleCreateRoom = () => {

    const newRoomId = Math.random().toString(36).substring(2, 10);
   const name = localStorage.getItem('name');
   console.log(localStorage);
    navigate(`/roompage/${newRoomId}`, { state: { roomId: newRoomId,username: name } });
    toast.success("New Room Created!");
  };

  return (
    <div className="join-room">
      <h2>Join a Room</h2>
      <input
        type="text"
        className="input"
        placeholder="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        className="input"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button className="btn join-btn" onClick={handleJoinRoom}>
        Join Room
      </button>
      <hr />
      <button className="btn btn-share" onClick={handleCreateRoom}>

        + Create New Room
      </button>
    </div>
  );
};

export default Room;
