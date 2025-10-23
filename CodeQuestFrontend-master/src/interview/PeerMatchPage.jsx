import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  LogIn, 
  Copy, 
  Shield, 
  User, 
  Key, 
  Hash,
  Rocket,
  ArrowRight
} from 'lucide-react';

const PeerMatchPage = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }
    
    setIsCreating(true);
    try {
      const response = await axios.post(`${baseUrl}/api/interview-rooms/create`);
      const room = response.data;

      setSessionId(room.roomCode);
      setAccessCode(room.accessCode);

      // navigate(`/interviewPanel/${room.roomCode}`, {
      //   state: {
      //     sessionId: room.roomCode,
      //     username: name,
      //   },
      // });
    } catch {
      alert('Error creating room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinSession = async () => {
    if (!name || !sessionId || !accessCodeInput) {
      alert('Please enter all fields');
      return;
    }
    
    setIsJoining(true);
    try {
      await axios.post(`${baseUrl}/api/interview-rooms/join`, null, {
        params: {
          roomCode: sessionId,
          accessCode: accessCodeInput,
          username: name,
        },
      });
      navigate(`/interviewPanel/${sessionId+accessCode}`, {
        state: {
          sessionId: sessionId+accessCode,
          username: name,
        },
      });
    } catch (err) {
      alert(err.response?.data || 'Error joining room');
    } finally {
      setIsJoining(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all px-4 py-8">
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

      {/* Main Content */}
      <motion.div 
        className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Column - Info */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Rocket className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Connect with Peers & Mentors
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block text-gray-900 dark:text-white">
              Collaborative
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Interview Practice
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Practice with peers, get feedback from mentors, and master technical interviews 
            in real-time collaborative sessions.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-6 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { number: "5K+", label: "Active Peers" },
              { number: "95%", label: "Success Rate" },
              { number: "50+", label: "Mentors" },
              { number: "24/7", label: "Available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-2xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-8 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Join Interview Session
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create a new session or join an existing one
              </p>
            </div>

            <div className="space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                   className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-400"
/>
              </motion.div>

              {/* Create Session Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  {isCreating ? 'Creating Session...' : 'Create New Session'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Access Code Display */}
              <AnimatePresence>
                {accessCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-400">
                          Session Created!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          Share this access code with participants
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-bold text-green-800 dark:text-green-400">
                          {accessCode}
                        </code>
                        <motion.button
                          onClick={() => copyToClipboard(accessCode)}
                          className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-purple-100 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-grow border-t border-purple-100 dark:border-gray-600"></div>
              </div>

              {/* Join Session Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Session ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                     className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-400"
/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Access Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter access code"
                    value={accessCodeInput}
                    onChange={(e) => setAccessCodeInput(e.target.value)}
                     className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-400"
/>
                </div>

                <motion.button
                  onClick={handleJoinSession}
                  disabled={isJoining}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-5 h-5" />
                  {isJoining ? 'Joining Session...' : 'Join Session'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PeerMatchPage;