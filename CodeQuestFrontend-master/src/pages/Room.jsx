import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, PlusCircle, History, Rocket, Users, Star, ChevronRight } from "lucide-react";

const Room = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  console.log("Backend URL:", baseUrl);

  // Fetch session history from backend
  const fetchHistoryFromBackend = async (name) => {
    try {
      const res = await axios.get(`${baseUrl}/api/sessions/${name}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUsername(storedName);
      fetchHistoryFromBackend(storedName);
    }
    setIsVisible(true);
  }, []);

  // Save to backend
  const saveToHistory = async (roomId, name) => {
    const newSession = {
      roomId,
      username: name,
    };

    try {
      await axios.post(`${baseUrl}/api/sessions`, newSession);
      fetchHistoryFromBackend(name);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error("Please enter both Room ID and your name.");
      return;
    }

    localStorage.setItem("name", username);
    saveToHistory(roomId.trim(), username.trim());
    navigate(`/roompage/${roomId}`, { state: { roomId, username } });
    toast.success("Joined Room!");
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter your name first.");
      return;
    }

    const newRoomId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("name", username.trim());
    saveToHistory(newRoomId, username.trim());

    navigate(`/roompage/${newRoomId}`, {
      state: { roomId: newRoomId, username: username.trim() },
    });

    toast.success("New Room Created!");
  };

  const stats = [
    { number: "50K+", label: "Active Developers", icon: <Users className="w-6 h-6" /> },
    { number: "100+", label: "Countries", icon: <Star className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Rocket className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all px-4 py-8 relative">
      {/* Background Elements - FIXED: Added pointer-events-none */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[length:50px_50px]" />
        
        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10 dark:bg-purple-500/20"
            style={{
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Pulse Effects */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.5, 1, 1.5],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content - FIXED: Added relative z-index */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column - Stats and Info */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Rocket className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Join 50,000+ Developers Worldwide
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block text-gray-900 dark:text-white">
              Start Coding
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Together
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Collaborate in real-time with developers worldwide. Practice coding interviews, 
            work on projects, and learn together in interactive rooms.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-2xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="flex justify-center mb-2 text-purple-600 dark:text-purple-400">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Room Form */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-8 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👤 Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-400"
/>
              </motion.div>

              {/* Room ID Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🏷️ Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter room ID to join"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                   className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-400"
/>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={handleJoinRoom}
                  className="group flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 active:scale-95"
                >
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Join Room
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleCreateRoom}
                  className="group flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Create Room
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Recent Rooms Section */}
            {history.length > 0 && (
              <motion.div
                className="mt-8 pt-8 border-t border-purple-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-100 mb-4">
                  <History className="w-5 h-5" /> Recent Rooms
                </h2>
                <div className="space-y-3 max-h-64 overflow-auto pr-2">
                  <AnimatePresence>
                    {history.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/50 dark:bg-gray-700/30 p-4 rounded-2xl border-2 border-purple-50 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-500 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 dark:text-white">
                              <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {session.username}
                              </span>{" "}
                              joined room{" "}
                              <span className="font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-lg">
                                {session.roomId}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(session.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              navigate(`/roompage/${session.roomId}`, {
                                state: {
                                  roomId: session.roomId,
                                  username: session.username,
                                },
                              })
                            }
                            className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl transition-all duration-300 transform group-hover:scale-105 ml-4 active:scale-95"
                          >
                            Rejoin
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Room;