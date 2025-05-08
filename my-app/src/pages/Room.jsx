import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("roomHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const saveToHistory = (roomId, username) => {
    const newSession = {
      id: uuidv4(),
      roomId,
      username,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newSession, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("roomHistory", JSON.stringify(updatedHistory));
  };

  const handleJoinRoom = () => {
    if (!roomId || !username) {
      toast.error("Please enter both Room ID and your name.");
      return;
    }
    saveToHistory(roomId, username);
    navigate(`/roompage/${roomId}`, { state: { roomId, username } });
    toast.success("Joined Room!");
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    const name = username || localStorage.getItem("name");
    if (!name) {
      toast.error("Please enter your name first.");
      return;
    }
    saveToHistory(newRoomId, name);
    navigate(`/roompage/${newRoomId}`, { state: { roomId: newRoomId, username: name } });
    toast.success("New Room Created!");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">CodeQuest Lobby</h2>

      {/* Input Section */}
      <input
        type="text"
        placeholder="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 p-2 rounded mb-4 w-full"
      />
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="input bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 p-2 rounded mb-4 w-full"
      />
      <div className="w-full flex gap-2">
        <button
          onClick={handleJoinRoom}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-1/2"
        >
          Join Room
        </button>
        <button
          onClick={handleCreateRoom}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-1/2"
        >
          + Create Room
        </button>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Recent Rooms</h3>
          <ul className="space-y-2 max-h-60 overflow-auto">
            {history.map((session) => (
              <li key={session.id} className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm">
                    <strong className="text-blue-600">{session.username}</strong> joined <strong>{session.roomId}</strong>
                  </p>
                  <p className="text-xs text-gray-500">{new Date(session.timestamp).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => navigate(`/roompage/${session.roomId}`, {
                    state: { roomId: session.roomId, username: session.username }
                  })}
                  className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                >
                  Rejoin
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Room;
