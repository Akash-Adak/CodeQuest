import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Room from "../pages/Room";
import { 
  FaCode, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaChartLine,
  FaTimes,
  FaPlay,
  FaStar,
  FaCheck,
  FaRocket,
  FaLightbulb,
  FaArrowRight,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaUserFriends,
  FaShieldAlt,
  FaMobile,
  FaGlobe,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaTrophy,
  FaHeart
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const LandingPage = () => {
  const { darkMode } = useTheme();
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const openRoomPopup = () => setIsRoomOpen(true);
  const closeRoomPopup = () => setIsRoomOpen(false);

  const stats = [
    { number: "45%", label: "Interview success rate with proper preparation", icon: "🚀" },
    { number: "8.01%", label: "Average salary increase after mock interviews", icon: "💫" },
    { number: "25%", label: "Faster hiring process with practice", icon: "⚡" },
    { number: "94%", label: "Land dream jobs with confidence", icon: "🎯" }
  ];

  const features = [
    {
      icon: <FaCode className="text-2xl" />,
      title: "Real-time Coding",
      description: "Practice with real-world coding problems in multiple languages with live collaboration.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaUserFriends className="text-2xl" />,
      title: "Mock Interviews",
      description: "Simulate real interview scenarios with industry experts and get detailed feedback.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and personalized insights.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Secure Environment",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <FaMobile className="text-2xl" />,
      title: "Mobile Friendly",
      description: "Practice anywhere, anytime with our fully responsive mobile experience.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <FaGlobe className="text-2xl" />,
      title: "Global Community",
      description: "Join thousands of developers worldwide preparing for their dream jobs.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer @ Google",
      content: "This platform helped me land my dream job at Google. The mock interviews were incredibly realistic and the feedback was invaluable.",
      avatar: "👩‍💻"
    },
    {
      name: "Marcus Johnson",
      role: "Full Stack Developer @ Meta",
      content: "I went from failing technical interviews to receiving multiple offers. The practice sessions built my confidence tremendously.",
      avatar: "👨‍💻"
    },
    {
      name: "Priya Patel",
      role: "Frontend Engineer @ Netflix",
      content: "The collaborative coding environment and expert feedback helped me improve my problem-solving speed by 40%.",
      avatar: "👩‍🎨"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      features: [
        "5 mock interviews per month",
        "Basic coding challenges",
        "Community support",
        "Progress tracking"
      ],
      popular: false,
      gradient: "from-gray-400 to-gray-600"
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited mock interviews",
        "Advanced coding challenges",
        "1-on-1 expert sessions",
        "Priority feedback",
        "Interview analytics",
        "Custom study plans"
      ],
      popular: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored",
      features: [
        "Everything in Pro",
        "Team management",
        "Dedicated success manager",
        "Custom integration",
        "API access",
        "White-label solutions"
      ],
      popular: false,
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  const companies = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Twitter", "Uber"];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800"
    }`}>
      
    

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          {/* Background Image */}
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
              darkMode ? "opacity-20" : "opacity-15"
            }`}
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="${darkMode ? '%239933FF' : '%239933FF'}" stroke-width="2" opacity="0.2"/></pattern><radialGradient id="glow"><stop offset="0%" stop-color="${darkMode ? '%239933FF' : '%239933FF'}" stop-opacity="0.3"/><stop offset="100%" stop-color="${darkMode ? '%23000' : '%23fff'}" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="800" fill="${darkMode ? '%23000' : '%23f8fafc'}"/><rect width="1200" height="800" fill="url(%23grid)"/><circle cx="200" cy="200" r="100" fill="url(%23glow)"/><circle cx="800" cy="600" r="150" fill="url(%23glow)"/><circle cx="1000" cy="200" r="120" fill="url(%23glow)"/></svg>')`
            }}
          ></div>
          
          {/* Dark Overlay for Dark Mode */}
          {darkMode && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 opacity-90"></div>
          )}
          
          {/* Light Overlay for Light Mode */}
          {!darkMode && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-50/40 to-pink-50/40"></div>
          )}
          
          {/* Animated grid pattern */}
          <div className={`absolute inset-0 ${
            darkMode ? "bg-grid-white/[0.02]" : "bg-grid-gray-900/[0.02]"
          } bg-[length:50px_50px]`}></div>
          
          {/* Enhanced floating elements */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                darkMode ? "bg-purple-500/10" : "bg-purple-500/20"
              }`}
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

          {/* Pulse effect */}
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

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                  darkMode 
                    ? "border-purple-500/30 bg-purple-500/10" 
                    : "border-purple-200 bg-purple-50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FaRocket className="text-purple-500" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Join 10,000+ developers who got hired
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className={`block ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Ace Your
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Tech Interviews
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Master technical interviews with real-world coding challenges, 
                mock interviews with experts, and collaborative learning with 
                peers worldwide.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <button
                  onClick={openRoomPopup}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1"
                >
                  <FaPlay className="text-sm group-hover:scale-110 transition-transform" />
                  Start Free Practice Session
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className={`group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 backdrop-blur-sm hover:-translate-y-1 flex items-center gap-2 ${
                  darkMode 
                    ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:border-purple-500" 
                    : "bg-white/80 border-purple-200 text-gray-800 hover:border-purple-300 hover:bg-purple-50"
                }`}>
                  <FaGraduationCap />
                  Watch Demo
                </button>
              </motion.div>

              {/* Trusted by companies */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                  Trusted by developers at
                </p>
                <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start">
                  {companies.map((company, index) => (
                    <motion.div
                      key={company}
                      className={`text-lg font-semibold ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } opacity-70 hover:opacity-100 transition-opacity`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.7, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      {company}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Stats Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    darkMode 
                      ? "bg-gray-800/30 border-gray-700 hover:border-purple-500" 
                      : "bg-white/80 border-purple-100 hover:border-purple-300"
                  }`}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{stat.icon}</div>
                    <div>
                      <div className={`text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
                        {stat.number}
                      </div>
                      <div className={`text-sm leading-relaxed ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className={`w-6 h-10 border-2 ${
            darkMode ? "border-white/50" : "border-purple-300"
          } rounded-full flex justify-center`}>
            <div className={`w-1 h-3 ${
              darkMode ? "bg-white/70" : "bg-purple-500"
            } rounded-full mt-2`}></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Comprehensive tools and features designed to help you master technical interviews
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`group p-8 rounded-3xl backdrop-blur-sm border-2 transition-all duration-500 ${
                  darkMode 
                    ? "bg-gray-800/30 border-gray-700 hover:border-purple-500" 
                    : "bg-white/80 border-purple-100 hover:border-purple-300"
                } hover:shadow-2xl`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className={`leading-relaxed ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Join thousands of developers who transformed their careers with our platform
            </p>
          </motion.div>

          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                className={`absolute inset-0 p-8 rounded-3xl backdrop-blur-sm border-2 ${
                  darkMode 
                    ? "bg-gray-800/30 border-gray-700" 
                    : "bg-white/80 border-purple-100"
                }`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col h-full justify-center items-center text-center max-w-2xl mx-auto">
                  <div className="text-4xl mb-6">{testimonials[activeTestimonial].avatar}</div>
                  <p className={`text-2xl font-light mb-8 leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{testimonials[activeTestimonial].name}</h4>
                    <p className={`text-lg ${
                      darkMode ? "text-purple-400" : "text-purple-600"
                    }`}>
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? "bg-purple-600 w-8"
                    : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Choose the plan that works best for you. All plans include a 14-day free trial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative rounded-3xl p-8 backdrop-blur-sm border-2 transition-all duration-300 ${
                  plan.popular
                    ? darkMode
                      ? "bg-gray-800/50 border-purple-500 shadow-2xl shadow-purple-500/20 scale-105"
                      : "bg-white border-purple-300 shadow-2xl shadow-purple-500/20 scale-105"
                    : darkMode
                    ? "bg-gray-800/30 border-gray-700"
                    : "bg-white/80 border-purple-100"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                    {plan.period !== "forever" && plan.period !== "tailored" && (
                      <span className={`text-lg ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        /mo
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {plan.period === "forever" ? "Free forever" : 
                     plan.period === "tailored" ? "Tailored pricing" : `Billed monthly`}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <FaCheck className={`text-green-500 flex-shrink-0 ${
                        plan.popular ? "text-lg" : "text-sm"
                      }`} />
                      <span className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={openRoomPopup}
                  className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
                      : darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Ace Your Next{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Interview?
              </span>
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Join thousands of developers who have transformed their interview skills and landed their dream jobs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={openRoomPopup}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1"
              >
                <FaRocket className="group-hover:scale-110 transition-transform" />
                Start Your Journey Today
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-purple-500" 
                  : "bg-white border-purple-200 text-gray-800 hover:border-purple-300 hover:bg-purple-50"
              }`}>
                Schedule a Demo
              </button>
            </div>
            
            <p className={`text-sm mt-6 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}>
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>


      {/* Room Modal */}
      <AnimatePresence>
        {isRoomOpen && (
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
              className={`relative rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <button
                onClick={closeRoomPopup}
                className={`absolute top-4 right-4 z-10 p-3 rounded-full hover:bg-opacity-20 transition-colors ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaTimes className="text-xl" />
              </button>
              <div className="max-h-[90vh] overflow-y-auto">
                <Room />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;