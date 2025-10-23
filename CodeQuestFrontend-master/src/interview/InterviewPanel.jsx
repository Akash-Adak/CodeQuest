import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaUsers,
  FaLink,
  FaClock,
  FaSignOutAlt,
  FaUserCircle,
  FaFileAlt,
  FaDownload,
  FaCode,
  FaChalkboardTeacher,
  FaExpand,
  FaCompress,
  FaCog,
  FaBell,
  FaPalette,
  FaShare,
  FaLock,
  FaCrown,
} from 'react-icons/fa';
import CodeEditor from '../components/CodeEditor';
import WhiteBoard from '../interview/WhiteBoard';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewPanel = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showWhiteBoard, setShowWhiteBoard] = useState(false);
  const [code, setCode] = useState('// Start coding here...');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [joinedSession, setJoinedSession] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [interviewerName, setInterviewerName] = useState('');

  const [videoEnabled1, setVideoEnabled1] = useState(true);
  const [audioEnabled1, setAudioEnabled1] = useState(true);

  const webcamRef1 = useRef(null);
  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);
  const mainContainerRef = useRef(null);
  const location = useLocation();
  const sessionIdFromState = location?.state?.sessionId || '';
  let firstHalfSessionId = '';
  let secondHalfSessionId = '';
  
  if (sessionIdFromState.length === 14) {
    firstHalfSessionId = sessionIdFromState.substring(0, 8);
    secondHalfSessionId = sessionIdFromState.substring(8); 
  } else {
    console.log("session id length is:" + sessionIdFromState.length);
  }

  // Check system preference for dark mode
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (sessionIdFromState) {
      setSessionId(sessionIdFromState);
      setJoinedSession(true);
    }
  }, [sessionIdFromState]);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setInterviewerName(storedName);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => {
      toast.error('Please allow camera and microphone access');
    });
  }, []);

  useEffect(() => {
    const webcam = webcamRef1.current;
    if (webcam && webcam.video && webcam.video.srcObject) {
      const stream = webcam.video.srcObject;
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) videoTrack.enabled = videoEnabled1;
      if (audioTrack) audioTrack.enabled = audioEnabled1;
    }
  }, [videoEnabled1, audioEnabled1]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (joinedSession && sessionId) {
      connectWebSocket();
      fetchUploadedFiles();
      fetchParticipants();
    }
    return () => disconnectWebSocket();
  }, [joinedSession, sessionId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const connectWebSocket = () => {
    const socket = new SockJS(`${baseUrl}/ws`);
    stompClient.current = over(socket);
    stompClient.current.connect(
      {},
      () => {
        stompClient.current.subscribe(`/topic/code/${sessionId}`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            setChatMessages((prev) => [...prev, msg]);
          }
        });
      },
      (err) => {
        console.error('WebSocket connection error:', err);
      }
    );
  };

  const disconnectWebSocket = () => {
    if (stompClient.current?.connected) {
      stompClient.current.disconnect(() => {
        console.log('Disconnected WebSocket');
      });
    }
  };

  const sendMessage = () => {
    if (chatInput.trim() && stompClient.current?.connected && sessionId) {
      const message = {
        from: interviewerName || 'User',
        content: chatInput.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
      stompClient.current.send(`/app/code/${sessionId}`, {}, JSON.stringify(message));
      setChatInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);

    try {
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchUploadedFiles();
        toast.success('File uploaded successfully!');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('File upload failed');
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await fetch(`/api/files/list?sessionId=${sessionId}`);
      if (res.ok) setUploadedFiles(await res.json());
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/interview-rooms/${firstHalfSessionId}/participants`);
      if (response.data) {
        setParticipants(response.data);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Failed to fetch participants.');
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const endSession = () => {
    if (window.confirm('Are you sure you want to end the session?')) {
      disconnectWebSocket();
      toast.info('Session ended', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/InterviewTypes');
    }
  };

  const toggleParticipantsList = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleCopyLink = () => {
    const joinURL = `${window.location.origin}/peer-match`;
    const copyText = `Join the Interview:\nLink: ${joinURL}\nRoom ID: ${firstHalfSessionId}\nAccess Code: ${secondHalfSessionId}`;

    navigator.clipboard.writeText(copyText)
      .then(() => {
        toast.success('Meeting details copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link. Please copy manually.');
      });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div 
      ref={mainContainerRef}
      className={`min-h-screen transition-all duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800"
      }`}
    >
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`p-4 flex items-center justify-between backdrop-blur-lg border-b ${
          darkMode 
            ? "bg-gray-900/80 border-gray-700" 
            : "bg-white/80 border-purple-100"
        }`}
      >
        <div className="flex items-center space-x-6">
          {/* Session Info */}
          <div className={`px-4 py-2 rounded-2xl border ${
            darkMode 
              ? "border-purple-500/30 bg-purple-500/10" 
              : "border-purple-200 bg-purple-50"
          }`}>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Room: {firstHalfSessionId}
            </span>
          </div>

          {/* Participants Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleParticipantsList}
              className={`flex items-center space-x-3 px-4 py-2 rounded-2xl transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-purple-400" 
                  : "bg-white hover:bg-purple-50 text-purple-600"
              } shadow-lg`}
            >
              <FaUsers className="h-5 w-5" />
              <span className="font-bold">{participants.length}</span>
              <span className="text-sm font-medium">Participants</span>
            </motion.button>
            
            <AnimatePresence>
              {isParticipantsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute top-full left-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-64 ${
                    darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-purple-100"
                  }`}
                >
                  <div className={`p-4 border-b ${
                    darkMode ? "border-gray-700" : "border-purple-100"
                  }`}>
                    <h5 className="font-bold text-lg flex items-center gap-2">
                      <FaUsers className="text-purple-500" />
                      Participants ({participants.length})
                    </h5>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {participants.map((participant, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-500/10 transition-colors"
                      >
                        <div className="relative">
                          <FaUserCircle className="h-8 w-8 text-purple-500" />
                          {index === 0 && (
                            <FaLock className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{participant || 'Guest'}</p>
                          <p className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {index === 0 ? "Interviewer" : "Candidate"}
                          </p>
                        </div>
                        {index === 0 && <FaCrown className="text-yellow-500" />}
                      </motion.div>
                    ))}
                    {participants.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No participants yet
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timer */}
          <motion.div 
            className={`flex items-center space-x-4 px-4 py-2 rounded-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
            whileHover={{ scale: 1.02 }}
          >
            <FaClock className={`text-lg ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            <span className={`text-xl font-mono font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              {formatTime(seconds)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? "hover:bg-gray-700 text-purple-400" 
                  : "hover:bg-purple-100 text-purple-600"
              }`}
            >
              {isRunning ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </motion.button>
          </motion.div>

          {/* Copy Link */}
          {sessionId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              <FaShare className="h-4 w-4" />
              <span className="font-semibold">Share Session</span>
            </motion.button>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-3 rounded-2xl transition-colors ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-purple-400" 
                : "bg-white hover:bg-purple-100 text-purple-600"
            } shadow-lg`}
          >
            <FaPalette className="h-5 w-5" />
          </motion.button>

          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className={`p-3 rounded-2xl transition-colors ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-purple-400" 
                : "bg-white hover:bg-purple-100 text-purple-600"
            } shadow-lg`}
          >
            {isFullscreen ? <FaCompress className="h-5 w-5" /> : <FaExpand className="h-5 w-5" />}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl transition-colors ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-purple-400" 
                : "bg-white hover:bg-purple-100 text-purple-600"
            } shadow-lg`}
          >
            <FaCog className="h-5 w-5" />
          </motion.button>

          {/* End Session Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={endSession}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-red-500/30"
          >
            <FaSignOutAlt className="h-4 w-4" />
            <span className="font-semibold">End Session</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col lg:flex-row p-6 gap-6">
        {/* Left Panel - Editor/Whiteboard */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex-1 flex flex-col rounded-3xl shadow-2xl overflow-hidden ${
            darkMode ? "bg-gray-800/50" : "bg-white/80"
          } backdrop-blur-sm border ${
            darkMode ? "border-gray-700" : "border-purple-100"
          }`}
        >
          {/* Panel Header */}
          <div className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-purple-100"
          }`}>
            <div className="flex justify-between items-center">
              <motion.h2 
                className="text-2xl font-bold flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                {showWhiteBoard ? (
                  <>
                    <FaChalkboardTeacher className="text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Interactive Whiteboard
                    </span>
                  </>
                ) : (
                  <>
                    <FaCode className="text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Collaborative Code Editor
                    </span>
                  </>
                )}
              </motion.h2>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWhiteBoard(!showWhiteBoard)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/30"
              >
                {showWhiteBoard ? (
                  <>
                    <FaCode />
                    Switch to Code
                  </>
                ) : (
                  <>
                    <FaChalkboardTeacher />
                    Switch to Whiteboard
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Editor/Whiteboard Content */}
          <div className="flex-grow relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={showWhiteBoard ? 'whiteboard' : 'editor'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {showWhiteBoard ? (
                  <WhiteBoard darkMode={darkMode} />
                ) : (
                  <CodeEditor code={code} onChange={setCode} darkMode={darkMode} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-96 flex flex-col gap-6"
        >
          {/* Webcam */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              darkMode ? "bg-gray-800/50" : "bg-white/80"
            } backdrop-blur-sm border ${
              darkMode ? "border-gray-700" : "border-purple-100"
            }`}
          >
            <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600">
              <h4 className="text-white font-semibold text-center">Your Camera</h4>
            </div>
            <div className="p-4">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-900">
                <Webcam
                  ref={webcamRef1}
                  audio={audioEnabled1}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setVideoEnabled1((prev) => !prev)}
                    className={`p-3 rounded-2xl backdrop-blur-sm ${
                      videoEnabled1 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    } shadow-lg`}
                  >
                    {videoEnabled1 ? <FaVideo className="h-5 w-5" /> : <FaVideoSlash className="h-5 w-5" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAudioEnabled1((prev) => !prev)}
                    className={`p-3 rounded-2xl backdrop-blur-sm ${
                      audioEnabled1 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    } shadow-lg`}
                  >
                    {audioEnabled1 ? (
                      <FaMicrophone className="h-5 w-5" />
                    ) : (
                      <FaMicrophoneSlash className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`flex-1 flex flex-col rounded-3xl shadow-2xl overflow-hidden ${
              darkMode ? "bg-gray-800/50" : "bg-white/80"
            } backdrop-blur-sm border ${
              darkMode ? "border-gray-700" : "border-purple-100"
            }`}
          >
            <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <FaUsers />
                Live Chat
              </h4>
            </div>
            
            <div 
              ref={chatBoxRef}
              className={`flex-1 overflow-y-auto p-4 space-y-3 ${
                darkMode ? "bg-gray-900/50" : "bg-gray-50"
              }`}
            >
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.from === interviewerName ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-xs lg:max-w-md rounded-2xl p-3 ${
                    msg.from === interviewerName
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                      : darkMode
                      ? 'bg-gray-700 text-white rounded-bl-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}>
                    <div className="font-semibold text-sm mb-1">{msg.from}</div>
                    <div className="text-sm">{msg.content}</div>
                    <div className={`text-xs mt-1 ${
                      msg.from === interviewerName ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 border-t bg-gradient-to-r from-purple-600 to-pink-600">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className={`flex-1 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode 
                      ? "bg-gray-800 text-white placeholder-gray-400" 
                      : "bg-white text-gray-800 placeholder-gray-500"
                  }`}
                  placeholder="Type your message..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  className="px-6 py-3 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Files */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              darkMode ? "bg-gray-800/50" : "bg-white/80"
            } backdrop-blur-sm border ${
              darkMode ? "border-gray-700" : "border-purple-100"
            }`}
          >
            <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <FaFileAlt />
                Shared Files
              </h4>
            </div>
            
            <div className="p-4">
              <motion.input
                whileHover={{ scale: 1.02 }}
                type="file"
                onChange={handleFileUpload}
                className="w-full mb-4 text-sm file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 transition-all duration-300"
              />
              
              <div className="max-h-32 overflow-y-auto space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-2xl ${
                      darkMode ? "bg-gray-700/50" : "bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FaFileAlt className={`h-4 w-4 flex-shrink-0 ${
                        darkMode ? "text-purple-400" : "text-purple-600"
                      }`} />
                      <span className="text-sm font-medium truncate">
                        {file.originalFileName}
                      </span>
                    </div>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`/api/files/download/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-xl ${
                        darkMode 
                          ? "bg-gray-600 hover:bg-gray-500 text-purple-400" 
                          : "bg-purple-100 hover:bg-purple-200 text-purple-600"
                      } transition-colors`}
                    >
                      <FaDownload className="h-3 w-3" />
                    </motion.a>
                  </motion.div>
                ))}
                {uploadedFiles.length === 0 && (
                  <div className={`text-center py-4 rounded-2xl ${
                    darkMode ? "text-gray-500 bg-gray-700/30" : "text-gray-500 bg-purple-50"
                  }`}>
                    No files shared yet
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-6 w-full max-w-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-2xl`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCog className="text-purple-500" />
                Session Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video Quality</label>
                  <select className={`w-full p-3 rounded-2xl border ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-purple-200 text-gray-800"
                  }`}>
                    <option>Auto</option>
                    <option>720p</option>
                    <option>1080p</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Audio Input</label>
                  <select className={`w-full p-3 rounded-2xl border ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-purple-200 text-gray-800"
                  }`}>
                    <option>Default Microphone</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enable Notifications</span>
                  <button className={`w-12 h-6 rounded-full ${
                    darkMode ? "bg-purple-600" : "bg-purple-500"
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPanel;