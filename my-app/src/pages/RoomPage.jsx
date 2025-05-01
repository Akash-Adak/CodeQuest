import React, { useState, useEffect, useRef } from 'react';
import WebSocketService from '../services/WebSocketService';
import CodeEditor from '../components/CodeEditor';
import '../styles/RoomPage.css';

const RoomPage = () => {
  const [roomId, setRoomId] = useState('');
  const [participant, setParticipant] = useState('');
  const [connected, setConnected] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [problem, setProblem] = useState('');
  const [sharedProblem, setSharedProblem] = useState('');
  const [code, setCode] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const codeRef = useRef('');
  const [darkMode, setDarkMode] = useState(false);
  const [critical, setCritical] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (connected && roomId && WebSocketService.stompClient && WebSocketService.stompClient.connected) {
      WebSocketService.connect(roomId, null, (message) => {
        setCode(message);
        codeRef.current = message;
      });

      WebSocketService.stompClient.subscribe(`/topic/room/${roomId}/participants`, (message) => {
        const parsed = JSON.parse(message.body);
        if (parsed.participants) {
          setParticipants(parsed.participants);
        } else if (parsed.participant) {
          setParticipants(prev => (!prev.includes(parsed.participant) ? [...prev, parsed.participant] : prev));
        }
      });

      WebSocketService.stompClient.subscribe(`/topic/room/${roomId}/problem`, (message) => {
        const parsed = JSON.parse(message.body);
        if (parsed.problem) {
          setSharedProblem(parsed.problem);
        }
      });

      WebSocketService.stompClient.subscribe(`/topic/room/${roomId}/timer`, (message) => {
        const parsed = JSON.parse(message.body);
        if (parsed.timer !== undefined) {
          setTimer(parsed.timer);
          setTimerActive(parsed.active);
        }
      });

      WebSocketService.sendMessage(JSON.stringify({ roomId, participant, type: 'join' }));

      return () => {
        WebSocketService.sendMessage(JSON.stringify({ roomId, participant, type: 'leave' }));
        WebSocketService.disconnect();
      };
    }
  }, [connected, roomId, participant]);

  const handleJoin = () => {
    if (roomId && participant) {
      setConnected(true);
    }
  };

  const handleStartTimer = () => {
    const duration = parseInt(prompt('Enter timer duration (in seconds):', '300'), 10);
    if (!isNaN(duration) && duration > 0) {
      setTimer(duration);
      setTimerActive(true);
      setProgress(100);
      setCritical(false);

      if (intervalId) {
        clearInterval(intervalId);
      }

      const id = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(id);
            setTimerActive(false);
            setProgress(0);
            setCritical(false);
            return 0;
          }
          setCritical(prevTimer <= 10);

          const newProgress = ((prevTimer - 1) / duration) * 100;
          setProgress(newProgress);

          return prevTimer - 1;
        });
      }, 1000);

      setIntervalId(id);

      WebSocketService.sendMessage(JSON.stringify({ roomId, timer: duration, active: true, type: 'timer' }));
    }
  };

  const handleShareProblem = () => {
    if (problem.trim()) {
      WebSocketService.sendMessage(JSON.stringify({ roomId, problem, type: 'problem' }));
      setSharedProblem(problem);
      setProblem('');
    }
  };

  const handleSubmitCode = () => {
    if (window.confirm('Submit your code?')) {
      WebSocketService.sendMessage(
        JSON.stringify({ participant, content: codeRef.current }),
        `/app/code/${roomId}/submit`
      );
      alert('Code submitted successfully!');
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
    WebSocketService.sendCodeMessage(newCode);
  };

  const handleRunCode = () => {
    alert('Code execution started!');
  };

  const handleRunTestCases = () => {
    alert('Running test cases...');
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className={`page-container ${darkMode ? 'dark-mode' : ''}`}>
      {!connected ? (
        <div className="join-room">
          <h2>Join a Room</h2>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            className="input"
          />
          <button onClick={handleJoin} className="btn join-btn">Join Room</button>
        </div>
      ) : (
        <div className="room-content">
          <div className="room-header">
            <h2 className="room-title">Room: {roomId}</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-selector"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="room-body">
            <div className="left-section">
              <div className="timer-container">
                <div className={`timer-circle ${critical ? 'critical' : ''}`}>
                  <div className="timer-display">{formatTime(timer)}</div>
                </div>
                <button onClick={handleStartTimer} className="btn btn-timer">Start Timer</button>
              </div>

              <div className="problem-container">
                <h3>Problem Statement</h3>
                <textarea
                  rows="8"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Enter problem statement..."
                  className="input"
                />
                <button onClick={handleShareProblem} className="btn btn-share">Share Problem</button>
                {sharedProblem && <pre className="shared-problem">{sharedProblem}</pre>}
              </div>
            </div>

            <div className="right-section">
              <div className="editor-container">
                <h3>Code Editor</h3>
                <CodeEditor
                  code={code}
                  onCodeChange={handleCodeChange}
                  language={language}
                />
                <div className="actions">
                  <button onClick={handleRunCode} className="btn btn-run">Run Code</button>
                  <button onClick={handleSubmitCode} className="btn btn-submit">Submit Code</button>
                  <button onClick={handleRunTestCases} className="btn btn-testcases">Run Test Cases</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
