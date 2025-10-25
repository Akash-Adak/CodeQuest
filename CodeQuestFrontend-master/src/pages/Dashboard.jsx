import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2, Users, History, UserCircle, Clock, Bell, Calendar,
  TrendingUp, Sparkles, ChevronRight, Play, Settings
} from 'lucide-react';

const Dashboard = ({ userName = "User" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("name");
    if (nameFromStorage) {
      setUsername(nameFromStorage);
    }
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "🌙";
    if (hour < 12) return "☀️";
    if (hour < 18) return "🌤️";
    return "🌙";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {getGreeting()}, {username}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>{currentTime.toLocaleTimeString()}</span>
                  <span className="ml-1">{getTimeIcon()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-gray-700 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Ready to code</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Interviews Completed"
            value="12"
            change="+2 this week"
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Coding Rooms"
            value="8"
            change="Active now"
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Avg. Score"
            value="85%"
            change="+5% improvement"
            icon={<Sparkles className="w-5 h-5" />}
            color="purple"
          />
        </section>

        {/* Main Actions */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Play className="w-5 h-5 text-indigo-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Join Coding Room"
              desc="Collaborate in real-time coding sessions"
              to="/room"
              icon={<Code2 className="w-8 h-8" />}
              gradient="from-blue-500 to-cyan-500"
              badge="Live"
            />
            <DashboardCard
              title="Mock Interview"
              desc="Practice with AI or peers"
              to="/InterviewTypes"
              icon={<Users className="w-8 h-8" />}
              gradient="from-green-500 to-emerald-500"
              badge="New"
            />
            <DashboardCard
              title="Interview History"
              desc="Review past performance"
              to="/past-interviews"
              icon={<History className="w-8 h-8" />}
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Bell className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <ActivityItem
                icon="✅"
                title="Completed mock interview"
                time="2 hours ago"
                description="Data Structures & Algorithms"
              />
              <ActivityItem
                icon="🆕"
                title="New room invitation"
                time="1 hour ago"
                description="From Alex - React Practice"
              />
              <ActivityItem
                icon="📈"
                title="Performance updated"
                time="5 hours ago"
                description="Sorting Algorithms +15%"
              />
              <ActivityItem
                icon="🛠️"
                title="Profile updated"
                time="Yesterday"
                description="Added new skills"
              />
            </div>
          </section>

          {/* Upcoming Schedule */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Calendar className="w-5 h-5 text-purple-500" />
                Upcoming Schedule
              </h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                View Calendar
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <ScheduleItem
                title="Technical Interview Practice"
                time="Today, 3:00 PM"
                type="Mock Interview"
                color="blue"
              />
              <ScheduleItem
                title="Team Coding Session"
                time="Tomorrow, 10:00 AM"
                type="Coding Room"
                color="green"
              />
              <ScheduleItem
                title="System Design Review"
                time="Oct 15, 2:00 PM"
                type="Study Group"
                color="purple"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link
        to="/profile"
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Settings className="w-6 h-6" />
      </Link>
    </div>
  );
};

const DashboardCard = ({ title, desc, to, icon, gradient, badge }) => (
  <Link
    to={to}
    className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col gap-4 overflow-hidden"
  >
    {badge && (
      <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
        {badge}
      </span>
    )}
    
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white shadow-lg`}>
      {icon}
    </div>
    
    <div className="flex-1">
      <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {desc}
      </p>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
      <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
        Get Started
      </span>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const StatCard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-indigo-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, title, time, description }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <span className="text-lg mt-0.5">{icon}</span>
    <div className="flex-1">
      <p className="font-medium text-gray-800 dark:text-gray-200">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{time}</span>
  </div>
);

const ScheduleItem = ({ title, time, type, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
      <div className="flex-shrink-0">
        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{time}</p>
      </div>
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
        {type}
      </span>
    </div>
  );
};

export default Dashboard;