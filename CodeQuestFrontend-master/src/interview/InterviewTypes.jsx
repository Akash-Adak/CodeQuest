import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaUsers,
  FaHandshake,
  FaDoorOpen,
  FaArrowRight,
  FaRocket,
  FaStar,
  FaChartLine,
  FaShieldAlt
} from "react-icons/fa";

const InterviewTypes = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const types = [
    {
      title: "Mock Interviews",
      description: "Simulated interviews with AI or mentor. Auto-evaluated and timed sessions with detailed feedback.",
      action: "Start Mock Interview",
      route: "/peer-match",
      icon: FaRobot,
      gradient: "from-purple-500 to-pink-500",
      stats: "AI-Powered • Instant Feedback"
    },
    {
      title: "Peer Interviews",
      description: "Pair up with other users for real-time coding practice and collaborative learning.",
      action: "Find Peer",
      route: "/peer-match",
      icon: FaUsers,
      gradient: "from-blue-500 to-cyan-500",
      stats: "Real-time • Collaborative"
    },
    {
      title: "Mentor Interviews",
      description: "Book paid/live sessions with industry experts for in-depth guidance and career advice.",
      action: "Book Mentor",
      route: "/peer-match",
      icon: FaHandshake,
      gradient: "from-green-500 to-emerald-500",
      stats: "Expert Guidance • Personalized"
    },
    {
      title: "Custom Interview Rooms",
      description: "Create private rooms and share invite links for custom sessions with your team.",
      action: "Create Room",
      route: "/room",
      icon: FaDoorOpen,
      gradient: "from-orange-500 to-red-500",
      stats: "Customizable • Private"
    },
  ];

  const stats = [
    { number: "10K+", label: "Mock Interviews Completed", icon: "🚀" },
    { number: "95%", label: "Success Rate", icon: "💫" },
    { number: "50+", label: "Expert Mentors", icon: "⭐" },
    { number: "24/7", label: "Available", icon: "⚡" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[length:50px_50px]" />
        
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

      {/* Header Section */}
      <motion.div 
        className="relative z-10 text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaRocket className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Choose Your Path to Success
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="block text-gray-900 dark:text-white">
            Master Your
          </span>
          <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Tech Interviews
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-12 leading-relaxed text-gray-600 dark:text-gray-300 max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Prepare for your dream job with our comprehensive interview preparation platform. 
          Choose from AI-powered mock interviews, peer practice sessions, expert mentorship, or custom collaborative rooms.
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
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

      {/* Interview Types Grid */}
      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {types.map((type, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative"
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            <div className="relative h-full p-8 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              
              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <type.icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                {type.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {type.description}
              </p>

              {/* Stats Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  {type.stats}
                </span>
              </div>

              {/* Action Button */}
              <Link
                to={type.route}
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 active:scale-95 group/btn"
              >
                <span>{type.action}</span>
                <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div 
        className="relative z-10 text-center mt-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="p-8 rounded-3xl backdrop-blur-sm border-2 border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Ready to Ace Your Next Interview?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of developers who transformed their careers with our platform
          </p>
          <Link
            to="/room"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
          >
            <FaRocket className="w-5 h-5" />
            Start Your Journey Today
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewTypes;