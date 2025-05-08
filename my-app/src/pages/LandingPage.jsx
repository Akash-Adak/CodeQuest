import React, { useState } from "react"; // Ensure useState is imported correctly
import { useTheme } from "../context/ThemeContext";
import Room from "../pages/Room"; // Import the Room component

const LandingPage = () => {
  const { darkMode } = useTheme();
  const [isRoomOpen, setIsRoomOpen] = useState(false); // Declare the state for the room popup

  const openRoomPopup = () => {
    setIsRoomOpen(true);
  };

  const closeRoomPopup = () => {
    setIsRoomOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <header className="text-center py-12 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-4xl font-bold mb-2">Welcome to CodeQuest</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your platform for collaborative coding interviews and mock sessions
          </p>
        </header>

        <section className="py-12 px-4 md:px-12">
          <h2 className="text-3xl font-semibold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2">Real-Time Coding Interviews</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Collaborate in real-time with interviewers or peers on coding tasks. Write and test code within the platform.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2">Mock Interviews</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Simulate real-world interviews with timed tasks and predefined questions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2">Collaborative Coding</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Work together with other candidates or interviewers in a real-time coding environment.
              </p>
              <button
                onClick={openRoomPopup}
                className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-600 mt-4"
              >
                Start a Room
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2">Performance Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Receive feedback and track your progress through coding challenges and mock interviews.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-center py-6 bg-gray-200 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 CodeQuest - All rights reserved
          </p>
        </footer>
      </div>

      {/* Room Popup */}
      {isRoomOpen && (
        <div className="fixed left-0 top-1/4 transform -translate-y-1/4 z-50">
          <div className="bg-white dark:bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg w-80">
            <button
              onClick={closeRoomPopup}
              className="absolute top-2 right-2 text-xl text-gray-800 dark:text-white"
            >
              X
            </button>
            <Room />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
