import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WebSocketService from "../services/WebSocketService";
import CodeEditor from "../components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Square, 
  Share2, 
  Users, 
  Clock, 
  LogOut, 
  Copy, 
  X,
  Code,
  Video,
  Download,
  Send
} from "lucide-react";

const RoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const codeRef = useRef("");
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const username = location?.state?.username || "Admin";
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
        () => alert("WebSocket connection failed.")
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
    try {
      const response = await fetch(`${baseUrl}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error executing code");
    }
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

  const handleStartRecording = () => {
    setRecordedChunks([]);
    setIsRecording(true);
    // Recording logic would go here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Stop recording logic
  };

  const handleDownload = () => {
    if (recordedChunks.length === 0) return;
    // Download logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[length:50px_50px]" />
        
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10 dark:bg-purple-500/20"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center mb-8 p-6 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-6">
          {/* Room Info */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Room: <span className="font-mono text-purple-600 dark:text-purple-400">{roomId}</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, <span className="font-semibold text-green-600 dark:text-green-400">{username}</span>
              </p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div className="flex -space-x-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                  title={participant}
                >
                  {participant.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {participants.length} online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <motion.button
            onClick={handleCircleClick}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              timerActive 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clock className="w-5 h-5" />
            <span className="font-mono">{formatTime(timer)}</span>
          </motion.button>

          {/* Invite Button */}
          <motion.button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5" />
            Invite
          </motion.button>

          {/* End Session */}
          <motion.button
            onClick={() => {
              if (window.confirm("Are you sure you want to end this session?")) {
                WebSocketService.sendMessage(
                  JSON.stringify({ roomId, participant, type: "leave" })
                );
                WebSocketService.disconnect();
                navigate("/room");
              }
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            End
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor Section */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-xl overflow-hidden">
            {/* Editor Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 rounded-2xl bg-white dark:bg-gray-700 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={handleRunCode}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  Run
                </motion.button>
                
                <motion.button
                  onClick={handleSubmitCode}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                  Submit
                </motion.button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="h-[600px]">
              <CodeEditor 
                code={code} 
                onCodeChange={handleCodeChange} 
                language={language} 
              />
            </div>
          </div>

          {/* Output Section */}
          {output && (
            <motion.div 
              className="mt-6 p-6 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Output</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl text-gray-800 dark:text-gray-200 overflow-auto">
                {output}
              </pre>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Recording Panel */}
          <div className="p-6 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Recording
            </h3>
            
            <div className="space-y-3">
              {!isRecording ? (
                <motion.button
                  onClick={handleStartRecording}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                  Start Recording
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleStopRecording}
                  className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white py-3 rounded-2xl font-semibold hover:bg-gray-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Square className="w-4 h-4" />
                  Stop Recording
                </motion.button>
              )}

              {recordedChunks.length > 0 && (
                <motion.button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
              )}
            </div>
          </div>

          {/* Active Participants */}
          <div className="p-6 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Participants ({participants.length})
            </h3>
            
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-gray-700/50 border border-purple-100 dark:border-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {participant.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {participant}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 shadow-2xl w-full max-w-md p-6"
            >
              <button
                onClick={() => setShowInvite(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                Invite to Room
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Share this link with others to join your coding session
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={`${window.location.origin}/roompage/${roomId}`}
                    readOnly
                    className="w-full p-4 pr-12 rounded-2xl bg-white dark:bg-gray-700 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <motion.button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/roompage/${roomId}`);
                      alert("📋 Link copied to clipboard!");
                    }}
                    className="absolute right-2 top-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>

                <motion.button
                  onClick={() => setShowInvite(false)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomPage;