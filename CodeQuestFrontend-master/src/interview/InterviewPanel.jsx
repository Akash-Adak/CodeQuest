import React, { useState, useRef, useEffect } from 'react';
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
  FaComment,
  FaEllipsisV,
  FaClosedCaptioning,
  FaUserPlus,
  FaShieldAlt,
  FaRecordVinyl,
  FaStop,
  FaCopy,
  FaPhone,
  FaPhoneSlash,
  FaRegWindowRestore,
  FaRegCopy,
  FaUser,
  FaUserTie,
  FaEye,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaGripHorizontal,
} from 'react-icons/fa';
import CodeEditor from '../components/CodeEditor';
import WhiteBoard from './WhiteBoard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoCall } from '../hooks/useVideoCall';
import VideoCall from '../components/VideoCall';

const InterviewPanel = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { sessionId: urlSessionId } = useParams();
  
  // State management
  const [code, setCode] = useState('// Start coding here...\nfunction solution(input) {\n  // Your code here\n  return input;\n}');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [isRecording, setIsRecording] = useState(false);
  const [layout, setLayout] = useState('split'); // 'split', 'editor', 'whiteboard', 'video'

  const [joinedSession, setJoinedSession] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [interviewerName, setInterviewerName] = useState('Interviewer');
  const [userRole, setUserRole] = useState('interviewer');

  // Refs
  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);
  const mainContainerRef = useRef(null);

  const location = useLocation();
  const sessionIdFromState = location?.state?.sessionId || urlSessionId;

  // Video call hook
  const videoCall = useVideoCall(sessionId, stompClient.current, {
    id: 'local-user',
    name: interviewerName,
    role: userRole
  });

  // WebRTC message handling
  useEffect(() => {
    if (stompClient.current?.connected) {
      const subscription = stompClient.current.subscribe(`/topic/webrtc/${sessionId}`, (message) => {
        const data = JSON.parse(message.body);
        
        switch (data.type) {
          case 'OFFER':
            videoCall.handleOffer(data.offer, data.from);
            break;
          case 'ANSWER':
            videoCall.handleAnswer(data.answer, data.from);
            break;
          case 'ICE_CANDIDATE':
            videoCall.handleIceCandidate(data.candidate, data.from);
            break;
        }
      });
      
      return () => subscription.unsubscribe();
    }
  }, [stompClient.current, sessionId]);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      if (sessionIdFromState) {
        setSessionId(sessionIdFromState);
        
        try {
          const response = await axios.get(`${baseUrl}/api/sessions/${sessionIdFromState}`);
          const sessionData = response.data;
          
          setParticipants(sessionData.participants || []);
          setChatMessages(sessionData.chatHistory || []);
          setUploadedFiles(sessionData.files || []);
          
          setJoinedSession(true);
          
          const localUser = {
            id: 'local-user',
            name: localStorage.getItem('name') || 'Interviewer',
            role: sessionData.userRole || 'interviewer',
            isYou: true,
            videoEnabled: true,
            audioEnabled: true,
            connection: 'connected'
          };
          
          setUserRole(sessionData.userRole);
          setInterviewerName(localUser.name);
          setParticipants(prev => [localUser, ...prev.filter(p => p.id !== 'local-user')]);
          
          toast.success('Session joined successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          
        } catch (error) {
          console.error('Failed to fetch session details:', error);
          toast.error('Failed to load session', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    };

    initializeSession();
  }, [sessionIdFromState]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // WebSocket connection
  useEffect(() => {
    if (joinedSession && sessionId) {
      connectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [joinedSession, sessionId]);

  // Chat auto-scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const connectWebSocket = () => {
    const socket = new SockJS(`${baseUrl}/ws`);
    stompClient.current = over(socket);
    stompClient.current.connect(
      {},
      () => {
        stompClient.current.subscribe(`/topic/code/${sessionId}`, (message) => {
          if (message.body) {
            const codeUpdate = JSON.parse(message.body);
            setCode(codeUpdate.content);
          }
        });
        
        stompClient.current.subscribe(`/topic/chat/${sessionId}`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            setChatMessages(prev => [...prev, msg]);
          }
        });
        
        stompClient.current.subscribe(`/topic/participants/${sessionId}`, (message) => {
          if (message.body) {
            const participantUpdate = JSON.parse(message.body);
            setParticipants(prev => 
              prev.map(p => 
                p.id === participantUpdate.id ? { ...p, ...participantUpdate } : p
              )
            );
          }
        });

        stompClient.current.subscribe(`/topic/whiteboard/${sessionId}`, (message) => {
          // Handle whiteboard updates
        });

        const joinMessage = {
          type: 'USER_JOINED',
          user: {
            id: 'local-user',
            name: interviewerName,
            role: userRole,
          },
          timestamp: new Date().toISOString()
        };
        stompClient.current.send(`/app/participants/${sessionId}`, {}, JSON.stringify(joinMessage));
        
        toast.info('Connected to session', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
      (err) => {
        console.error('WebSocket connection error:', err);
        toast.error('Connection error - attempting to reconnect...', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    );
  };

  const disconnectWebSocket = () => {
    if (stompClient.current?.connected) {
      const leaveMessage = {
        type: 'USER_LEFT',
        user: { id: 'local-user' },
        timestamp: new Date().toISOString()
      };
      stompClient.current.send(`/app/participants/${sessionId}`, {}, JSON.stringify(leaveMessage));
      
      stompClient.current.disconnect(() => {
        console.log('Disconnected WebSocket');
      });
    }
  };

  const sendMessage = () => {
    if (chatInput.trim() && stompClient.current?.connected && sessionId) {
      const message = {
        from: interviewerName,
        content: chatInput.trim(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'CHAT_MESSAGE'
      };
      stompClient.current.send(`/app/chat/${sessionId}`, {}, JSON.stringify(message));
      setChatInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await axios.post(`${baseUrl}/api/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFiles(prev => [...prev, response.data.file]);
      toast.success(`${file.name} uploaded successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${baseUrl}/api/files/download/${fileId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const endSession = async () => {
    if (window.confirm('Are you sure you want to end the session for all participants?')) {
      try {
        if (userRole === 'interviewer') {
          await axios.post(`${baseUrl}/api/sessions/${sessionId}/end`);
        }
        disconnectWebSocket();
        toast.info('Session ended', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/interview');
      } catch (error) {
        console.error('Error ending session:', error);
        toast.error('Failed to end session', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await mainContainerRef.current?.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  const handleCopyLink = () => {
    const joinURL = `${window.location.origin}/join/${sessionId}`;
    navigator.clipboard.writeText(joinURL)
      .then(() => {
        toast.success('Meeting link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    toast.info(`${!darkMode ? 'Dark' : 'Light'} mode activated`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        await axios.post(`${baseUrl}/api/sessions/${sessionId}/recording/start`);
        setIsRecording(true);
        toast.info('Recording started', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error('Failed to start recording', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      try {
        await axios.post(`${baseUrl}/api/sessions/${sessionId}/recording/stop`);
        setIsRecording(false);
        toast.info('Recording stopped', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error('Failed to stop recording', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleVideoToggle = () => {
    videoCall.toggleVideo();
    toast.info(`Camera ${videoCall.videoEnabled ? 'enabled' : 'disabled'}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAudioToggle = () => {
    videoCall.toggleAudio();
    toast.info(`Microphone ${videoCall.audioEnabled ? 'enabled' : 'disabled'}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const toggleScreenShare = () => {
    videoCall.toggleScreenShare();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'interviewer': return 'text-blue-400';
      case 'candidate': return 'text-green-400';
      case 'observer': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'interviewer': return <FaUserTie className="w-3 h-3" />;
      case 'candidate': return <FaUser className="w-3 h-3" />;
      case 'observer': return <FaEye className="w-3 h-3" />;
      default: return <FaUser className="w-3 h-3" />;
    }
  };

  // Render different layouts based on current layout state
  const renderMainContent = () => {
    switch (layout) {
      case 'split':
        return (
          <div className="flex h-full gap-4">
            {/* Collaboration Area */}
            <div className="flex-1 flex flex-col">
              <div className={`rounded-xl overflow-hidden flex-1 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-2xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="h-full">
                  {activeTab === 'editor' && (
                    <CodeEditor 
                      code={code} 
                      onChange={(newCode) => {
                        setCode(newCode);
                        if (stompClient.current?.connected) {
                          stompClient.current.send(
                            `/app/code/${sessionId}`, 
                            {}, 
                            JSON.stringify({ content: newCode, type: 'CODE_UPDATE' })
                          );
                        }
                      }}
                      darkMode={darkMode}
                      height="100%"
                    />
                  )}
                  
                  {activeTab === 'whiteboard' && (
                    <WhiteBoard 
                      darkMode={darkMode}
                      sessionId={sessionId}
                      stompClient={stompClient.current}
                    />
                  )}
                  
                  {activeTab === 'files' && (
                    <div className="p-6 h-full overflow-y-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg">Shared Files</h3>
                        <label className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                          darkMode 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}>
                          <FaFileAlt className="inline w-4 h-4 mr-2" />
                          Upload File
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.png"
                          />
                        </label>
                      </div>
                      
                      {uploadedFiles.length === 0 ? (
                        <div className="text-center py-12">
                          <FaFileAlt className={`w-16 h-16 mx-auto mb-4 ${
                            darkMode ? "text-gray-600" : "text-gray-400"
                          }`} />
                          <p className={`text-lg mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            No files shared yet
                          </p>
                          <p className={darkMode ? "text-gray-500" : "text-gray-500"}>
                            Upload a file to get started
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {uploadedFiles.map((file, index) => (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-center justify-between p-4 rounded-lg ${
                                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                              } transition-colors`}
                            >
                              <div className="flex items-center space-x-4 min-w-0 flex-1">
                                <FaFileAlt className={`w-6 h-6 flex-shrink-0 ${
                                  darkMode ? "text-blue-400" : "text-blue-500"
                                }`} />
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium truncate">{file.originalFileName}</div>
                                  <div className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}>
                                    {file.fileSize && `${(file.fileSize / 1024 / 1024).toFixed(2)} MB`}
                                    {file.uploadedAt && ` • ${new Date(file.uploadedAt).toLocaleDateString()}`}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => downloadFile(file.id, file.originalFileName)}
                                className={`p-3 rounded-lg transition-colors ${
                                  darkMode 
                                    ? "bg-gray-600 hover:bg-gray-500 text-gray-300" 
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                                } flex-shrink-0 ml-4`}
                              >
                                <FaDownload className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Collaboration Tabs */}
              <div className={`mt-4 rounded-xl overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className={`flex border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}>
                  {['editor', 'whiteboard', 'files'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : darkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {tab === 'editor' && <FaCode className="inline w-4 h-4 mr-2" />}
                      {tab === 'whiteboard' && <FaChalkboardTeacher className="inline w-4 h-4 mr-2" />}
                      {tab === 'files' && <FaFileAlt className="inline w-4 h-4 mr-2" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Area - USING REAL VIDEO CALL COMPONENT */}
            <div className="w-1/3 flex flex-col">
              <VideoCall
                participants={participants}
                localStream={videoCall.localStream}
                remoteStreams={videoCall.remoteStreams}
                videoEnabled={videoCall.videoEnabled}
                audioEnabled={videoCall.audioEnabled}
                screenShare={videoCall.screenShare}
                localVideoRef={videoCall.localVideoRef}
                getRoleIcon={getRoleIcon}
                getRoleColor={getRoleColor}
                darkMode={darkMode}
              />
            </div>
          </div>
        );

      case 'editor':
        return (
          <div className="h-full">
            <div className={`rounded-xl overflow-hidden h-full ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-2xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <CodeEditor 
                code={code} 
                onChange={(newCode) => {
                  setCode(newCode);
                  if (stompClient.current?.connected) {
                    stompClient.current.send(
                      `/app/code/${sessionId}`, 
                      {}, 
                      JSON.stringify({ content: newCode, type: 'CODE_UPDATE' })
                    );
                  }
                }}
                darkMode={darkMode}
                height="100%"
              />
            </div>
          </div>
        );

      case 'whiteboard':
        return (
          <div className="h-full">
            <div className={`rounded-xl overflow-hidden h-full ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-2xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <WhiteBoard 
                darkMode={darkMode}
                sessionId={sessionId}
                stompClient={stompClient.current}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="h-full">
            <VideoCall
              participants={participants}
              localStream={videoCall.localStream}
              remoteStreams={videoCall.remoteStreams}
              videoEnabled={videoCall.videoEnabled}
              audioEnabled={videoCall.audioEnabled}
              screenShare={videoCall.screenShare}
              localVideoRef={videoCall.localVideoRef}
              getRoleIcon={getRoleIcon}
              getRoleColor={getRoleColor}
              darkMode={darkMode}
              fullScreen={true}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={mainContainerRef}
      className={`h-screen transition-all duration-500 overflow-hidden ${
        darkMode 
          ? "bg-gray-900 text-gray-100" 
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Main Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`h-16 flex items-center justify-between px-6 border-b ${
          darkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        } shadow-lg`}
      >
        <div className="flex items-center space-x-6">
          {/* Session Info */}
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-lg ${
              darkMode ? "bg-blue-600" : "bg-blue-500"
            } text-white text-sm font-medium flex items-center space-x-2 shadow-md`}>
              <FaClock className="w-3 h-3" />
              <span>{formatTime(seconds)}</span>
            </div>
            <div className="text-sm">
              <div className="font-semibold">Interview Session</div>
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {sessionId}
              </div>
            </div>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 px-3 py-1 bg-red-500 rounded-lg shadow-md"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">REC</span>
            </motion.div>
          )}
        </div>

        {/* Layout Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayout('split')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              layout === 'split' 
                ? (darkMode ? "bg-blue-600 text-white shadow-lg" : "bg-blue-500 text-white shadow-lg")
                : (darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300")
            } text-xs font-medium flex items-center space-x-2 px-3`}
          >
            <FaGripHorizontal className="w-3 h-3" />
            <span>Split</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayout('editor')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              layout === 'editor' 
                ? (darkMode ? "bg-blue-600 text-white shadow-lg" : "bg-blue-500 text-white shadow-lg")
                : (darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300")
            } text-xs font-medium flex items-center space-x-2 px-3`}
          >
            <FaCode className="w-3 h-3" />
            <span>Code</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayout('whiteboard')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              layout === 'whiteboard' 
                ? (darkMode ? "bg-blue-600 text-white shadow-lg" : "bg-blue-500 text-white shadow-lg")
                : (darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300")
            } text-xs font-medium flex items-center space-x-2 px-3`}
          >
            <FaChalkboardTeacher className="w-3 h-3" />
            <span>Whiteboard</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayout('video')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              layout === 'video' 
                ? (darkMode ? "bg-blue-600 text-white shadow-lg" : "bg-blue-500 text-white shadow-lg")
                : (darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300")
            } text-xs font-medium flex items-center space-x-2 px-3`}
          >
            <FaVideo className="w-3 h-3" />
            <span>Video</span>
          </motion.button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className={`p-3 rounded-full transition-colors ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
            } shadow-md`}
          >
            {isFullscreen ? <FaCompress className="w-5 h-5" /> : <FaExpand className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className={`p-3 rounded-full transition-colors ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
            } shadow-md`}
          >
            <FaCopy className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={endSession}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
          >
            <FaPhoneSlash className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="h-[calc(100vh-4rem)] p-4">
        {renderMainContent()}
      </div>

      {/* Sidebar */}
      <motion.div 
        className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col border-l transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
        initial={false}
        animate={{ width: isParticipantsOpen ? 320 : 0 }}
      >
        {/* Participants Panel */}
        <div className={`flex-1 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold flex items-center">
              <FaUsers className="w-4 h-4 mr-2" />
              People ({participants.length})
            </h3>
            <button
              onClick={() => setIsParticipantsOpen(false)}
              className={`p-2 rounded ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-3 max-h-48 overflow-y-auto">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                  darkMode ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                } transition-colors`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      participant.role === 'interviewer' ? 'bg-blue-500' :
                      participant.role === 'candidate' ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border ${
                      darkMode ? "border-gray-800" : "border-white"
                    } ${
                      participant.audioEnabled ? "bg-green-500" : "bg-red-500"
                    }`}></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {participant.name} {participant.isYou && '(You)'}
                    </div>
                    <div className={`text-xs flex items-center space-x-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {getRoleIcon(participant.role)}
                      <span>{participant.role}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-2 h-2 rounded-full ${
                  participant.connection === 'connected' ? 'bg-green-500' : 
                  participant.connection === 'poor' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <div className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <h3 className="font-semibold flex items-center">
              <FaComment className="w-4 h-4 mr-2" />
              Chat
            </h3>
          </div>
          
          <div 
            ref={chatBoxRef}
            className={`flex-1 overflow-y-auto p-4 space-y-3 ${
              darkMode ? "bg-gray-900/50" : "bg-gray-50"
            }`}
          >
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <FaComment className={`w-12 h-12 mx-auto mb-3 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`} />
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  No messages yet
                </p>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.from === interviewerName ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-xs rounded-lg p-3 ${
                    msg.from === interviewerName
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : darkMode
                      ? 'bg-gray-700 text-white rounded-bl-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}>
                    <div className="font-semibold text-sm mb-1">{msg.from}</div>
                    <div className="text-sm break-words">{msg.content}</div>
                    <div className={`text-xs mt-1 ${
                      msg.from === interviewerName ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className={`p-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex space-x-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600" 
                    : "bg-white text-gray-800 placeholder-gray-500 border-gray-300 border"
                }`}
                placeholder="Type a message..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!chatInput.trim()}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  chatInput.trim()
                    ? darkMode 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                    : darkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Control Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 p-4 rounded-2xl shadow-2xl ${
          darkMode 
            ? "bg-gray-800/90 border border-gray-700" 
            : "bg-white/90 border border-gray-200"
        } backdrop-blur-lg`}
      >
        {/* Media Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVideoToggle}
            className={`p-4 rounded-full transition-all duration-200 ${
              videoCall.videoEnabled 
                ? (darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700")
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg"
            }`}
          >
            {videoCall.videoEnabled ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAudioToggle}
            className={`p-4 rounded-full transition-all duration-200 ${
              videoCall.audioEnabled 
                ? (darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700")
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg"
            }`}
          >
            {videoCall.audioEnabled ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all duration-200 ${
              videoCall.screenShare 
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                : (darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700")
            }`}
          >
            <FaRegWindowRestore className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center space-x-2 border-l border-r border-gray-600 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleRecording}
            className={`p-4 rounded-full transition-all duration-200 ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                : (darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700")
            }`}
          >
            {isRecording ? <FaStop className="w-5 h-5" /> : <FaRecordVinyl className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            className={`p-4 rounded-full transition-all duration-200 ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <FaUsers className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-4 rounded-full transition-all duration-200 ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <FaPalette className="w-5 h-5" />
          </motion.button>
        </div>

        {/* End Call */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={endSession}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
        >
          <FaPhoneSlash className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default InterviewPanel;