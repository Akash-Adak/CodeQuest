import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useVideoCall = (sessionId, stompClient, localUser) => {
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const peerConnections = useRef(new Map());
  const localVideoRef = useRef(null);
  const screenStream = useRef(null);
  const mediaConstraints = useRef({
    video: { width: 1280, height: 720, frameRate: 30 },
    audio: { 
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true 
    }
  });

  // Initialize media and WebRTC
  useEffect(() => {
    if (sessionId && !isInitializing) {
      initializeMedia();
    }
    
    return () => {
      cleanup();
    };
  }, [sessionId]);

  // Reinitialize when stompClient changes
  useEffect(() => {
    if (stompClient?.connected && localStream) {
      initializeWebRTC();
    }
  }, [stompClient?.connected, localStream]);

  const initializeMedia = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints.current);
      await handleStreamAcquired(stream);
      
      toast.success('Camera and microphone enabled');
    } catch (error) {
      console.error('Media initialization failed:', error);
      handleMediaError(error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStreamAcquired = async (stream) => {
    setLocalStream(stream);
    
    // Set video reference immediately
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // Initialize video track state
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    
    setVideoEnabled(videoTrack?.enabled ?? true);
    setAudioEnabled(audioTrack?.enabled ?? true);

    // Add track ended listeners
    videoTrack?.addEventListener('ended', handleVideoTrackEnded);
    audioTrack?.addEventListener('ended', handleAudioTrackEnded);
  };

  const handleVideoTrackEnded = () => {
    toast.warning('Camera disconnected');
    setVideoEnabled(false);
  };

  const handleAudioTrackEnded = () => {
    toast.warning('Microphone disconnected');
    setAudioEnabled(false);
  };

  const handleMediaError = (error) => {
    let errorMessage = 'Camera/microphone access required';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage = 'Camera/microphone permission denied';
        break;
      case 'NotFoundError':
        errorMessage = 'No camera/microphone found';
        break;
      case 'NotReadableError':
        errorMessage = 'Camera/microphone is already in use';
        break;
      case 'OverconstrainedError':
        errorMessage = 'Camera constraints cannot be satisfied';
        break;
      default:
        errorMessage = 'Failed to access camera/microphone';
    }
    
    toast.error(errorMessage);
  };

  const initializeWebRTC = useCallback(() => {
    if (!stompClient?.connected || !localStream) return;

    // Send join message to initiate WebRTC connections
    stompClient.send(`/app/webrtc/${sessionId}`, {}, JSON.stringify({
      type: 'JOIN',
      from: localUser.id,
      user: localUser,
      timestamp: new Date().toISOString()
    }));
  }, [stompClient, sessionId, localStream, localUser]);

  const createPeerConnection = useCallback((participantId) => {
    if (peerConnections.current.has(participantId)) {
      return peerConnections.current.get(participantId);
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ],
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    });

    // Add local stream to connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        if (track.kind === 'video' && !videoEnabled) return;
        if (track.kind === 'audio' && !audioEnabled) return;
        
        pc.addTrack(track, localStream);
      });
    }

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      const stream = event.streams[0];
      if (stream) {
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.set(participantId, stream);
          return newMap;
        });
      }
    };

    // Handle ICE connection state
    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${participantId}:`, pc.iceConnectionState);
      
      if (pc.iceConnectionState === 'disconnected' || 
          pc.iceConnectionState === 'failed') {
        toast.warning(`Connection issue with ${participantId}`);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && stompClient?.connected) {
        stompClient.send(`/app/webrtc/${sessionId}`, {}, JSON.stringify({
          type: 'ICE_CANDIDATE',
          candidate: event.candidate,
          target: participantId,
          from: localUser.id,
          timestamp: new Date().toISOString()
        }));
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log(`Connection state for ${participantId}:`, pc.connectionState);
    };

    peerConnections.current.set(participantId, pc);
    return pc;
  }, [localStream, stompClient, sessionId, localUser, videoEnabled, audioEnabled]);

  const createOffer = async (participantId) => {
    try {
      const pc = createPeerConnection(participantId);
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pc.setLocalDescription(offer);

      stompClient.send(`/app/webrtc/${sessionId}`, {}, JSON.stringify({
        type: 'OFFER',
        offer: offer,
        target: participantId,
        from: localUser.id,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Failed to establish connection');
    }
  };

  const handleOffer = async (offer, fromParticipantId) => {
    try {
      const pc = createPeerConnection(fromParticipantId);
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      stompClient.send(`/app/webrtc/${sessionId}`, {}, JSON.stringify({
        type: 'ANSWER',
        answer: answer,
        target: fromParticipantId,
        from: localUser.id,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error handling offer:', error);
      toast.error('Failed to handle connection request');
    }
  };

  const handleAnswer = async (answer, fromParticipantId) => {
    try {
      const pc = peerConnections.current.get(fromParticipantId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate, fromParticipantId) => {
    try {
      const pc = peerConnections.current.get(fromParticipantId);
      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !videoTracks[0].enabled;
        videoTracks[0].enabled = newState;
        setVideoEnabled(newState);

        // Update all peer connections
        peerConnections.current.forEach(pc => {
          const senders = pc.getSenders();
          senders.forEach(sender => {
            if (sender.track?.kind === 'video') {
              sender.track.enabled = newState;
            }
          });
        });

        toast.info(`Camera ${newState ? 'enabled' : 'disabled'}`);
      }
    }
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const newState = !audioTracks[0].enabled;
        audioTracks[0].enabled = newState;
        setAudioEnabled(newState);

        // Update all peer connections
        peerConnections.current.forEach(pc => {
          const senders = pc.getSenders();
          senders.forEach(sender => {
            if (sender.track?.kind === 'audio') {
              sender.track.enabled = newState;
            }
          });
        });

        toast.info(`Microphone ${newState ? 'enabled' : 'disabled'}`);
      }
    }
  }, [localStream]);

  const toggleScreenShare = async () => {
    if (screenShare) {
      // Stop screen share
      screenStream.current?.getTracks().forEach(track => track.stop());
      setScreenShare(false);
      toast.info('Screen sharing stopped');
      
      // Restore camera stream
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        peerConnections.current.forEach(pc => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender && videoTrack) {
            sender.replaceTrack(videoTrack);
          }
        });
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { cursor: 'always' },
          audio: true 
        });
        
        screenStream.current = stream;
        setScreenShare(true);

        const videoTrack = stream.getVideoTracks()[0];
        
        // Replace video track in all peer connections
        peerConnections.current.forEach(pc => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Handle screen share end
        videoTrack.onended = () => {
          toggleScreenShare();
        };

        toast.info('Screen sharing started');
      } catch (error) {
        if (error.name !== 'NotAllowedError') {
          toast.error('Failed to share screen');
        }
      }
    }
  };

  const cleanup = useCallback(() => {
    // Stop all media tracks
    localStream?.getTracks().forEach(track => {
      track.stop();
      track.removeEventListener('ended', handleVideoTrackEnded);
      track.removeEventListener('ended', handleAudioTrackEnded);
    });
    
    screenStream.current?.getTracks().forEach(track => track.stop());
    
    // Close all peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    
    // Clear remote streams
    setRemoteStreams(new Map());
    
    // Reset states
    setScreenShare(false);
    setIsInitializing(false);
  }, [localStream]);

  const initializeCall = useCallback(() => {
    if (localStream && stompClient?.connected) {
      initializeWebRTC();
    }
  }, [localStream, stompClient, initializeWebRTC]);

  return {
    participants,
    localStream,
    remoteStreams,
    videoEnabled,
    audioEnabled,
    screenShare,
    isInitializing,
    localVideoRef,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    setParticipants,
    initializeCall,
    cleanup,
    initializeMedia
  };
};