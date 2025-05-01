import React, { useState, useEffect, useRef } from 'react';
import WebSocketService from '../services/WebSocketService';
import CodeEditor from '../components/CodeEditor';
import '../styles/RoomPage.css';
import { useLocation } from 'react-router-dom';

const RoomPage = () => {
  const [roomId, setRoomId] = useState('');
  const [participant, setParticipant] = useState('');
  const [connected, setConnected] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [timer, setTimer] = useState(0);
   const location = useLocation();
  const [timerActive, setTimerActive] = useState(false);
  const [problem, setProblem] = useState('');
  const [sharedProblem, setSharedProblem] = useState('');
  const [code, setCode] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const codeRef = useRef('');
  const [darkMode, setDarkMode] = useState(false);
  const [critical, setCritical] = useState(false);
  const [progress, setProgress] = useState(100);
  const [output, setOutput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isRoomCreator, setIsRoomCreator] = useState(true); // placeholder
  const [username, setUsername] = useState(location?.state?.username || 'Admin');
  useEffect(() => {
//        setUsers([username, "Admin"]);
    if (connected && roomId && WebSocketService.stompClient && WebSocketService.stompClient.connected) {
      WebSocketService.connect(roomId, null, (message) => {
        setCode(message);
        codeRef.current = message;
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

      WebSocketService.stompClient.subscribe(`/topic/room/${roomId}/chat`, (message) => {
        const parsed = JSON.parse(message.body);
        setChatMessages(prev => [...prev, parsed]);
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

  const handleCircleClick = () => {
    if (timerActive) return;
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

  const handleRunCode = async () => {
    const response = await fetch('http://localhost:8080/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    });
    const data = await response.json();
    setOutput(data.output);
  };

  const handleRunTestCases = () => {
    alert('Running test cases...');
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      WebSocketService.sendMessage(JSON.stringify({ participant, message: chatInput }), `/app/chat/${roomId}`);
      setChatInput('');
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className={`page-container ${darkMode ? 'dark-mode' : ''}`}>
        <h2>{username}</h2>

        <div className="room-content">
          <div className="room-body">
            <div className="left-section">
              <div className="timer-container">
                <div className={`timer-circle small ${critical ? 'critical' : ''}`} onClick={handleCircleClick}>
                  <div className="timer-display">{formatTime(timer)}</div>
                </div>
              </div>

              <div className="problem-container">
                <h3>Problem Statement</h3>
                {isRoomCreator ? (
                  <>
                    <textarea
                      rows="6"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Enter problem statement..."
                      className="input"
                    />
                    <button onClick={handleShareProblem} className="btn btn-share">Share Problem</button>
                  </>
                ) : null}
                {sharedProblem && (
                  <div className="shared-problem">
                    <strong>Problem:</strong>
                    <pre>{sharedProblem}</pre>
                  </div>
                )}
              </div>

{/*               <div className="chat-container"> */}
{/*                 <h3>Chat</h3> */}
{/*                 <div className="chat-box"> */}
{/*                   {chatMessages.map((msg, index) => ( */}
{/*                     <div key={index}><strong>{msg.participant}:</strong> {msg.message}</div> */}
{/*                   ))} */}
{/*                 </div> */}
{/*                 <input */}
{/*                   type="text" */}
{/*                   value={chatInput} */}
{/*                   onChange={(e) => setChatInput(e.target.value)} */}
{/*                   className="input" */}
{/*                   placeholder="Type a message..." */}
{/*                 /> */}
{/*                 <button onClick={handleSendChat} className="btn btn-chat">Send</button> */}
{/*               </div> */}
            </div>

            <div className="right-section">
              <div className="editor-container">
                <h3>Code Editor</h3>
                <CodeEditor code={code} onCodeChange={handleCodeChange} language={language} />
                <div className="actions">
                  <button onClick={handleRunCode} className="btn btn-run">Run Code</button>
                  <button onClick={handleSubmitCode} className="btn btn-submit">Submit Code</button>
                  <button onClick={handleRunTestCases} className="btn btn-testcases">Run Test Cases</button>
                </div>
                <div className="output-box">
                  <h4>Output:</h4>
                  <pre>{output}</pre>
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
