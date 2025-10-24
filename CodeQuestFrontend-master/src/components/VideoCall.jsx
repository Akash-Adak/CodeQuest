import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaVideo, FaMicrophoneSlash, FaUser } from "react-icons/fa";

const VideoCall = ({
  participants = [],
  remoteStreams = new Map(),
  localVideoRef,
  videoEnabled = true,
  audioEnabled = true,
  getRoleIcon = () => <FaUser className="w-3 h-3" />,
  darkMode = false,
}) => {
  const videoRefs = useRef(new Map());

  // Sync remote streams with video elements
  useEffect(() => {
    remoteStreams.forEach((stream, participantId) => {
      const videoElement = videoRefs.current.get(participantId);
      if (videoElement && stream && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  // Set video ref for a participant
  const setVideoRef = (participantId, ref) => {
    if (ref) {
      videoRefs.current.set(participantId, ref);
      const stream = remoteStreams.get(participantId);
      if (stream && ref.srcObject !== stream) {
        ref.srcObject = stream;
      }
    } else {
      videoRefs.current.delete(participantId);
    }
  };

  // Filter out local participant from remote participants
  const remoteParticipants = participants.filter(p => p.id !== 'local-user');
  
  // Calculate grid layout
  const totalVideos = (videoEnabled ? 1 : 0) + remoteParticipants.length;
  const getGridClass = () => {
    if (totalVideos <= 1) return "grid-cols-1";
    if (totalVideos === 2) return "grid-cols-1 md:grid-cols-2";
    if (totalVideos <= 4) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div
      className={`flex flex-col h-full w-full rounded-2xl overflow-hidden shadow-lg ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* ===== Header ===== */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-2">
          <FaVideo
            className={`w-5 h-5 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <span className="font-semibold text-base">Video Call</span>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              participants.length > 1 ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></div>
        </div>
        <span
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {participants.length} participant
          {participants.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ===== Video Grid ===== */}
      <div className={`flex-1 p-4 overflow-y-auto`}>
        <div className={`grid gap-4 h-full ${getGridClass()}`}>
          {/* ===== Local Video ===== */}
          {videoEnabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-xl overflow-hidden aspect-video min-h-[200px] ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3">
                <div
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                    darkMode
                      ? "bg-black/60 text-white"
                      : "bg-white/80 text-gray-800"
                  } backdrop-blur-md shadow-md`}
                >
                  <span className="flex items-center space-x-2">
                    <span>You (Interviewer)</span>
                    {getRoleIcon("interviewer")}
                  </span>
                  {!audioEnabled && (
                    <FaMicrophoneSlash className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              {/* Video disabled overlay */}
              {!videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <FaVideo className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Camera is off</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===== Remote Videos ===== */}
          {remoteParticipants.map((participant) => {
            const stream = remoteStreams.get(participant.id);
            
            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl overflow-hidden aspect-video min-h-[200px] ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                {stream ? (
                  <video
                    ref={(ref) => setVideoRef(participant.id, ref)}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Placeholder when no stream is available
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <div className="text-center">
                      <FaUser className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Connecting...</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 right-3">
                  <div
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      darkMode
                        ? "bg-black/60 text-white"
                        : "bg-white/80 text-gray-800"
                    } backdrop-blur-md shadow-md`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{participant.name || `User ${participant.id}`}</span>
                      {getRoleIcon(participant.role)}
                    </span>
                    {!participant.audioEnabled && (
                      <FaMicrophoneSlash className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                
                {/* Connection status indicator */}
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 ${
                  darkMode ? "border-gray-900" : "border-white"
                } ${
                  stream ? "bg-green-500" : "bg-yellow-500"
                }`} />
              </motion.div>
            );
          })}

          {/* ===== Empty State ===== */}
          {totalVideos === 0 && (
            <div className="col-span-full flex items-center justify-center h-full">
              <div className="text-center">
                <FaVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-lg font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  No active video
                </h3>
                <p className={`text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}>
                  Start your camera to begin video call
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;