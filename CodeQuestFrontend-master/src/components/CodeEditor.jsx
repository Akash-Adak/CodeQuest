import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useTheme } from "../context/ThemeContext";
import WebSocketService from "../services/WebSocketService";
import {
  FaPlay,
  FaTrash,
  FaCopy,
  FaJava,
  FaExchangeAlt,
  FaExpand,
  FaCompress,
  FaDownload,
  FaUpload,
  FaHistory,
  FaSync,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  SiPython,
  SiJavascript,
  SiCplusplus,
  SiC,
  SiPhp,
  SiSwift,
} from "react-icons/si";
import { toast } from "react-toastify";

// Enhanced code templates with better examples
const initialCodeTemplates = {
  71: `# Python - Fibonacci Sequence
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"Fibonacci({i}) = {fibonacci(i)}")`,

  62: `// Java - Fibonacci Sequence
public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
    
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println("Fibonacci(" + i + ") = " + fibonacci(i));
        }
    }
}`,

  63: `// JavaScript - Fibonacci Sequence
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
for (let i = 0; i < 10; i++) {
    console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,

  54: `// C++ - Fibonacci Sequence
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    for (int i = 0; i < 10; i++) {
        cout << "Fibonacci(" << i << ") = " << fibonacci(i) << endl;
    }
    return 0;
}`,

  50: `// C - Fibonacci Sequence
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    for (int i = 0; i < 10; i++) {
        printf("Fibonacci(%d) = %d\\n", i, fibonacci(i));
    }
    return 0;
}`,

  68: `<?php
// PHP - Fibonacci Sequence
function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n-1) + fibonacci($n-2);
}

// Test the function
for ($i = 0; $i < 10; $i++) {
    echo "Fibonacci($i) = " . fibonacci($i) . "\\n";
}
?>`,

  85: `// Swift - Fibonacci Sequence
func fibonacci(_ n: Int) -> Int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

// Test the function
for i in 0..<10 {
    print("Fibonacci(\\(i)) = \\(fibonacci(i))")
}`,
};

const languageDetails = {
  71: { name: "Python", icon: SiPython, version: "3.8", mode: "python" },
  62: { name: "Java", icon: FaJava, version: "JDK 11", mode: "java" },
  63: { name: "JavaScript", icon: SiJavascript, version: "Node.js", mode: "javascript" },
  54: { name: "C++", icon: SiCplusplus, version: "C++17", mode: "cpp" },
  50: { name: "C", icon: SiC, version: "C11", mode: "c" },
  68: { name: "PHP", icon: SiPhp, version: "7.4", mode: "php" },
  85: { name: "Swift", icon: SiSwift, version: "5.3", mode: "swift" },
};

const CodeEditor = ({ roomId, participant }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { darkMode } = useTheme();
  const [code, setCode] = useState(initialCodeTemplates[71]);
  const [languageId, setLanguageId] = useState("71");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [activePanel, setActivePanel] = useState("input");
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [codeHistory, setCodeHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const codeRef = useRef(code);
  const isFirstLoad = useRef(true);
  const editorRef = useRef(null);
  const executionStartTime = useRef(0);

  // Get current language details
  const currentLanguage = languageDetails[languageId];

  // WebSocket connection with enhanced error handling
  useEffect(() => {
    const connectWebSocket = () => {
      setConnectionStatus("connecting");
      
      WebSocketService.connect(
        roomId,
        () => {
          setConnectionStatus("connected");
          WebSocketService.sendMessage(
            JSON.stringify({ type: "join", participant, timestamp: new Date().toISOString() }),
            `/app/code/${roomId}`
          );
          toast.success("Connected to collaborative editor");
        },
        (message) => {
          try {
            if (typeof message === "string") {
              const parsed = JSON.parse(message);
              if (parsed.type === "code_update" && parsed.sender !== participant) {
                setCode(parsed.code);
                codeRef.current = parsed.code;
                addToHistory(parsed.code);
              }
            } else if (typeof message === "object" && message.code) {
              setCode(message.code);
              codeRef.current = message.code;
              addToHistory(message.code);
            }
          } catch (error) {
            if (typeof message === "string" && message !== codeRef.current) {
              setCode(message);
              codeRef.current = message;
              addToHistory(message);
            }
          }
        },
        () => {
          setConnectionStatus("disconnected");
          toast.warning("Disconnected from collaborative editor");
        },
        (error) => {
          setConnectionStatus("error");
          console.error("WebSocket connection error:", error);
          toast.error("Failed to connect to collaborative editor");
        }
      );
    };

    if (isFirstLoad.current) {
      connectWebSocket();
      isFirstLoad.current = false;
    }

    return () => {
      WebSocketService.sendMessage(
        JSON.stringify({ type: "leave", participant, timestamp: new Date().toISOString() }),
        `/app/code/${roomId}`
      );
      WebSocketService.disconnect();
    };
  }, [roomId, participant]);

  // Add code to history
  const addToHistory = useCallback((newCode) => {
    setCodeHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newCode);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Enhanced code execution with timing
  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.warning("Please write some code before running");
      return;
    }

    setIsRunning(true);
    setOutput("Running code...");
    executionStartTime.current = Date.now();

    try {
      const response = await axios.post(`${baseUrl}/api/code/run`, {
        code,
        languageId: parseInt(languageId),
        input,
      }, {
        timeout: 30000, // 30 second timeout
      });

      const executionTimeMs = Date.now() - executionStartTime.current;
      setExecutionTime(executionTimeMs);

      if (response.data.output) {
        setOutput(response.data.output);
        toast.success(`Code executed successfully in ${executionTimeMs}ms`);
      } else if (response.data.error) {
        setOutput(`Error: ${response.data.error}`);
        toast.error("Code execution failed");
      } else {
        setOutput("No output generated");
        toast.info("Code executed but no output was generated");
      }
    } catch (error) {
      const executionTimeMs = Date.now() - executionStartTime.current;
      setExecutionTime(executionTimeMs);
      
      let errorMessage = "Execution failed";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Execution timeout - code took too long to run";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setOutput(`Error: ${errorMessage}`);
      toast.error(`Execution failed after ${executionTimeMs}ms`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
    addToHistory(newCode);
    
    // Debounced WebSocket update
    WebSocketService.sendMessage(
      JSON.stringify({
        type: "code_update",
        code: newCode,
        sender: participant,
        timestamp: new Date().toISOString()
      }),
      `/app/code/${roomId}`
    );
  }, [participant, roomId, addToHistory]);

  const handleLanguageChange = (newLanguageId) => {
    const previousCode = code;
    setLanguageId(newLanguageId);
    setCode(initialCodeTemplates[newLanguageId] || "");
    addToHistory(initialCodeTemplates[newLanguageId] || "");
    
    toast.info(`Switched to ${languageDetails[newLanguageId].name}`);
  };

  // Editor functions
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      toast.info("Code formatted");
    }
  };

  const handleClearAll = () => {
    setCode("");
    setInput("");
    setOutput("");
    toast.info("Cleared all content");
  };

  const handleExportCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-${currentLanguage.name.toLowerCase()}-${Date.now()}.${getFileExtension()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code exported successfully");
  };

  const handleImportCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        toast.success("Code imported successfully");
      };
      reader.readAsText(file);
    }
    event.target.value = ''; // Reset input
  };

  const getFileExtension = () => {
    const extensions = {
      71: 'py',
      62: 'java',
      63: 'js',
      54: 'cpp',
      50: 'c',
      68: 'php',
      85: 'swift',
    };
    return extensions[languageId] || 'txt';
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousCode = codeHistory[historyIndex - 1];
      setCode(previousCode);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      const nextCode = codeHistory[historyIndex + 1];
      setCode(nextCode);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Render connection status indicator
  const renderConnectionStatus = () => {
    const statusConfig = {
      connected: { color: "bg-green-500", text: "Connected" },
      connecting: { color: "bg-yellow-500 animate-pulse", text: "Connecting" },
      disconnected: { color: "bg-red-500", text: "Disconnected" },
      error: { color: "bg-red-500 animate-pulse", text: "Error" },
    };
    
    const status = statusConfig[connectionStatus] || statusConfig.error;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
        <span className="text-gray-300">{status.text}</span>
      </div>
    );
  };

  // Enhanced editor render
  const renderEditor = () => (
    <div className={`h-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 transition-all duration-200 ${
      isFullscreen ? "fixed inset-0 z-50 m-4" : ""
    }`}>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <currentLanguage.icon className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {currentLanguage.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentLanguage.version}
            </span>
          </div>
          {renderConnectionStatus()}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormatCode}
            className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Format
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <Editor
        height={isFullscreen ? "calc(100vh - 80px)" : "400px"}
        language={currentLanguage.mode}
        theme={darkMode ? "vs-dark" : "light"}
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        loading={<div className="text-center py-8">Loading editor...</div>}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          lineNumbers: "on",
          folding: true,
          foldingHighlight: true,
          matchBrackets: "always",
          occurrencesHighlight: "always",
          renderLineHighlight: "all",
          selectionHighlight: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
        }}
      />
    </div>
  );

  // Enhanced input/output panel
  const renderInputOutput = () => (
    <div className="h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setActivePanel("input")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activePanel === "input"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setActivePanel("output")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activePanel === "output"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Output {output && `(${output.length} chars)`}
          </button>
        </div>
        
        {activePanel === "output" && executionTime > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Executed in {executionTime}ms
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {activePanel === "input" ? (
          <textarea
            className="w-full h-full p-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            placeholder="Enter custom input here... (STDIN)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setOutput("")}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Clear Output"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                  title="Copy Output"
                >
                  <FaCopy />
                </button>
              </div>
              
              {isRunning && (
                <div className="flex items-center gap-2 text-blue-500 text-sm">
                  <FaSync className="animate-spin" />
                  Executing...
                </div>
              )}
            </div>
            
            <pre className="flex-1 bg-gray-900 text-gray-100 rounded-md p-4 overflow-auto text-sm font-mono whitespace-pre-wrap border border-gray-700">
              {output || "No output yet. Run your code to see the output here."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Language Selector */}
           <div className="flex items-center gap-3">
  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
    <currentLanguage.icon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    <select
      value={languageId}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer text-gray-900 dark:text-white appearance-none"
    >
      {Object.entries(languageDetails).map(([id, lang]) => (
        <option key={id} value={id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          {lang.name}
        </option>
      ))}
    </select>
  </div>
</div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isRunning ? (
                  <FaSync className="animate-spin" />
                ) : (
                  <FaPlay />
                )}
                Run {!isRunning && "(Ctrl+Enter)"}
              </button>

              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                title="Undo"
              >
                <FaHistory />
              </button>

              <input
                type="file"
                accept=".py,.java,.js,.cpp,.c,.php,.swift,.txt"
                onChange={handleImportCode}
                className="hidden"
                id="code-import"
              />
              <label
                htmlFor="code-import"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                title="Import Code"
              >
                <FaUpload />
              </label>

              <button
                onClick={handleExportCode}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Export Code"
              >
                <FaDownload />
              </button>
            </div>
          </div>

          {/* Layout Controls */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Room: {roomId}
            </div>
            <button
              onClick={() => setIsVerticalLayout(!isVerticalLayout)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Toggle Layout"
            >
              <FaExchangeAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        <div className={`h-full max-w-7xl mx-auto flex gap-4 ${
          isVerticalLayout ? "flex-col" : "flex-col lg:flex-row"
        }`}>
          <div className={`${isVerticalLayout ? "flex-1" : "lg:w-1/2"} transition-all duration-300`}>
            {renderEditor()}
          </div>
          <div className={`${isVerticalLayout ? "flex-1" : "lg:w-1/2"} transition-all duration-300`}>
            {renderInputOutput()}
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay Close Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <FaCompress />
        </button>
      )}
    </div>
  );
};

export default CodeEditor;