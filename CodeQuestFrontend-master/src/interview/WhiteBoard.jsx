import React, { useRef, useState, useEffect, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  FaPencilAlt,
  FaEraser,
  FaFont,
  FaUndo,
  FaRedo,
  FaTrash,
  FaSquare,
  FaCircle,
  FaSlash,
  FaPalette,
  FaDownload,
  FaUpload,
  FaUsers,
  FaMousePointer,
  FaExpand,
  FaCompress,
  FaSave,
} from "react-icons/fa";
import { debounce } from "lodash";

const WhiteBoard = ({ roomId, user }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [tool, setTool] = useState("pen");
  const [lineWidth, setLineWidth] = useState(3);
  const [color, setColor] = useState("#3b82f6");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [inputPos, setInputPos] = useState(null);
  const [socket, setSocket] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Predefined color palette
  const colorPalette = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#ec4899", "#000000", "#4b5563", "#ffffff", "#dc2626"
  ];

  // Initialize canvas and WebSocket
  useEffect(() => {
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;

      // Set initial white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load any existing drawing
      loadInitialDrawing();
    };

    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);

    // WebSocket connection
    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/whiteboard`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log("🟢 Whiteboard connected successfully");
        
        // Join the room
        client.publish({
          destination: "/app/whiteboard.join",
          body: JSON.stringify({ 
            roomId, 
            user: user || { id: 'anonymous', name: 'Anonymous' },
            type: "join"
          })
        });

        // Subscribe to drawing updates
        client.subscribe(`/topic/whiteboard.${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          handleIncomingData(data);
        });

        // Subscribe to user updates
        client.subscribe(`/topic/whiteboard.users.${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.type === "users_update") {
            setUsers(data.users || []);
          }
        });
      },

      onDisconnect: () => {
        console.log("🔴 Whiteboard disconnected");
      },

      onStompError: (frame) => {
        console.error("WebSocket error:", frame);
      },
    });

    client.activate();
    setSocket(client);

    return () => {
      window.removeEventListener('resize', initializeCanvas);
      client.deactivate();
    };
  }, [roomId, baseUrl]);

  // Handle incoming drawing data
  const handleIncomingData = useCallback((data) => {
    if (data.type === "drawing") {
      drawRemote(data);
    } else if (data.type === "clear") {
      clearCanvas(false);
    } else if (data.type === "undo") {
      undo(false);
    } else if (data.type === "redo") {
      redo(false);
    }
  }, []);

  // Load initial drawing from server
  const loadInitialDrawing = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/whiteboard/${roomId}`);
      if (response.ok) {
        const drawingData = await response.json();
        // Implement drawing data loading logic here
      }
    } catch (error) {
      console.log("No previous drawing found");
    }
  };

  // Optimized drawing functions
  const getMousePos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const drawRemote = useCallback(({ tool, points, color, lineWidth, start, end }) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = lineWidth;

    if (tool === "rectangle") {
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (tool === "circle") {
      const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else {
      // Freehand drawing
      ctx.beginPath();
      if (points && points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
      }
      ctx.stroke();
    }
  }, []);

  // Debounced WebSocket sending
  const sendDrawData = useCallback(debounce((data) => {
    if (socket && socket.connected) {
      socket.publish({
        destination: `/app/whiteboard.draw.${roomId}`,
        body: JSON.stringify(data),
      });
    }
  }, 16), [socket, roomId]); // ~60fps

  const startDrawing = useCallback((e) => {
    const pos = getMousePos(e);
    
    if (tool === "text") {
      setInputPos(pos);
      setTimeout(() => inputRef.current?.focus(), 10);
      return;
    }

    setIsDrawing(true);
    setStartPoint(pos);

    if (["pen", "eraser"].includes(tool)) {
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.lineWidth = lineWidth;
    }

    // Send start drawing event
    sendDrawData({
      type: "drawing_start",
      tool,
      color,
      lineWidth,
      user: user?.id,
      timestamp: Date.now()
    });
  }, [tool, color, lineWidth, getMousePos, sendDrawData, user]);

  const draw = useCallback((e) => {
    if (!isDrawing || !startPoint || tool === "text") return;
    
    const pos = getMousePos(e);
    const ctx = ctxRef.current;

    if (["pen", "eraser"].includes(tool)) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // Send drawing data for real-time collaboration
      sendDrawData({
        type: "drawing",
        tool,
        points: [startPoint, pos],
        color,
        lineWidth,
        user: user?.id,
        timestamp: Date.now()
      });
    }

    // Update cursor position for other users
    setCursorPosition(pos);
  }, [isDrawing, startPoint, tool, color, lineWidth, getMousePos, sendDrawData, user]);

  const finishDrawing = useCallback((e) => {
    if (!isDrawing || !startPoint) return;
    
    const endPoint = getMousePos(e);
    const ctx = ctxRef.current;

    // Handle shape tools
    if (["rectangle", "circle", "line"].includes(tool)) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === "rectangle") {
        ctx.strokeRect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
      } else if (tool === "circle") {
        const radius = Math.sqrt((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2);
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }

      // Send shape data
      sendDrawData({
        type: "drawing",
        tool,
        start: startPoint,
        end: endPoint,
        color,
        lineWidth,
        user: user?.id,
        timestamp: Date.now()
      });
    }

    setIsDrawing(false);
    setStartPoint(null);
    saveToHistory();
  }, [isDrawing, startPoint, tool, color, lineWidth, getMousePos, sendDrawData, user]);

  const handleTextSubmit = useCallback((e) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;

    const ctx = ctxRef.current;
    ctx.font = `${lineWidth * 5}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, inputPos.x, inputPos.y);

    // Send text data
    sendDrawData({
      type: "drawing",
      tool: "text",
      text,
      position: inputPos,
      color,
      lineWidth,
      user: user?.id,
      timestamp: Date.now()
    });

    setInputPos(null);
    saveToHistory();
  }, [inputPos, color, lineWidth, sendDrawData, user]);

  const clearCanvas = useCallback((broadcast = true) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (broadcast) {
      sendDrawData({
        type: "clear",
        user: user?.id,
        timestamp: Date.now()
      });
    }
    
    saveToHistory();
  }, [sendDrawData, user]);

  const saveToHistory = useCallback(() => {
    const dataUrl = canvasRef.current.toDataURL();
    setHistory(prev => [...prev.slice(-49), dataUrl]); // Keep last 50 states
    setRedoStack([]);
  }, []);

  const undo = useCallback((broadcast = true) => {
    if (history.length <= 1) return;
    
    const newHistory = history.slice(0, -1);
    const lastState = newHistory[newHistory.length - 1];
    
    const img = new Image();
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    img.src = lastState;

    setHistory(newHistory);
    setRedoStack(prev => [...prev, history[history.length - 1]]);

    if (broadcast) {
      sendDrawData({
        type: "undo",
        user: user?.id,
        timestamp: Date.now()
      });
    }
  }, [history, sendDrawData, user]);

  const redo = useCallback((broadcast = true) => {
    if (redoStack.length === 0) return;
    
    const lastState = redoStack[redoStack.length - 1];
    const img = new Image();
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    img.src = lastState;

    setHistory(prev => [...prev, lastState]);
    setRedoStack(prev => prev.slice(0, -1));

    if (broadcast) {
      sendDrawData({
        type: "redo",
        user: user?.id,
        timestamp: Date.now()
      });
    }
  }, [redoStack, sendDrawData, user]);

  const exportDrawing = useCallback(() => {
    const link = document.createElement('a');
    link.download = `whiteboard-${roomId}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  }, [roomId]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleColorSelect = useCallback((newColor) => {
    setColor(newColor);
    setShowColorPicker(false);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-full w-full bg-gray-100 dark:bg-gray-900 transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Tools */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <ToolButton 
            icon={<FaMousePointer />} 
            tool="select" 
            current={tool} 
            setTool={setTool}
            title="Select"
          />
          <ToolButton 
            icon={<FaPencilAlt />} 
            tool="pen" 
            current={tool} 
            setTool={setTool}
            title="Pen"
          />
          <ToolButton 
            icon={<FaEraser />} 
            tool="eraser" 
            current={tool} 
            setTool={setTool}
            title="Eraser"
          />
          <ToolButton 
            icon={<FaFont />} 
            tool="text" 
            current={tool} 
            setTool={setTool}
            title="Text"
          />
          <ToolButton 
            icon={<FaSquare />} 
            tool="rectangle" 
            current={tool} 
            setTool={setTool}
            title="Rectangle"
          />
          <ToolButton 
            icon={<FaCircle />} 
            tool="circle" 
            current={tool} 
            setTool={setTool}
            title="Circle"
          />
          <ToolButton 
            icon={<FaSlash />} 
            tool="line" 
            current={tool} 
            setTool={setTool}
            title="Line"
          />
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            title="Color Picker"
          >
            <FaPalette className="text-gray-600 dark:text-gray-300" />
            <div 
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
            />
          </button>

          {showColorPicker && (
            <div className="absolute top-12 left-0 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3">
              <div className="grid grid-cols-5 gap-2 mb-2">
                {colorPalette.map((paletteColor) => (
                  <button
                    key={paletteColor}
                    onClick={() => handleColorSelect(paletteColor)}
                    className={`w-8 h-8 rounded border-2 ${
                      color === paletteColor 
                        ? "border-blue-500 dark:border-blue-400" 
                        : "border-gray-300 dark:border-gray-600"
                    } hover:scale-110 transition-transform`}
                    style={{ backgroundColor: paletteColor }}
                    title={paletteColor}
                  />
                ))}
              </div>
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Line Width */}
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[1, 2, 3, 4, 5, 8, 12, 16, 20].map((w) => (
            <option key={w} value={w}>Size {w}</option>
          ))}
        </select>

        {/* History Controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            onClick={undo} 
            disabled={history.length <= 1}
            className="p-2 rounded hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <FaUndo />
          </button>
          <button 
            onClick={redo} 
            disabled={redoStack.length === 0}
            className="p-2 rounded hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <FaRedo />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={clearCanvas}
            className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            title="Clear Canvas"
          >
            <FaTrash />
          </button>
          <button 
            onClick={exportDrawing}
            className="p-2 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
            title="Export Drawing"
          >
            <FaDownload />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>

        {/* Users Online */}
        <div className="flex items-center gap-2 ml-auto text-sm text-gray-600 dark:text-gray-400">
          <FaUsers />
          <span>{users.length + 1} online</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-200 dark:bg-gray-900">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={finishDrawing}
          className="w-full h-full bg-white dark:bg-gray-800 cursor-crosshair touch-none"
        />

        {/* Text Input */}
        {tool === "text" && inputPos && (
          <form
            onSubmit={handleTextSubmit}
            className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
            style={{ top: inputPos.y, left: inputPos.x }}
          >
            <input
              ref={inputRef}
              name="textInput"
              className="px-3 py-2 bg-transparent border-none outline-none text-gray-900 dark:text-white min-w-[200px]"
              placeholder="Type text..."
              autoFocus
              onBlur={() => setInputPos(null)}
            />
          </form>
        )}

        {/* Cursor Position Indicator */}
        {cursorPosition && (
          <div 
            className="absolute pointer-events-none text-xs bg-black text-white px-2 py-1 rounded z-20"
            style={{ top: cursorPosition.y - 30, left: cursorPosition.x }}
          >
            {Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <div>Room: {roomId}</div>
        <div>{tool.charAt(0).toUpperCase() + tool.slice(1)} • Size: {lineWidth} • {color}</div>
      </div>
    </div>
  );
};

const ToolButton = ({ icon, tool, current, setTool, title }) => (
  <button
    onClick={() => setTool(tool)}
    className={`p-2 rounded transition-all ${
      tool === current 
        ? "bg-blue-500 text-white shadow-md" 
        : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
    }`}
    title={title}
  >
    {icon}
  </button>
);

export default WhiteBoard;