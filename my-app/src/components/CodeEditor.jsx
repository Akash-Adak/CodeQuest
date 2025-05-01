import React, { useState } from "react";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("print('Hello, World!')");
  const [languageId, setLanguageId] = useState("71"); // Python 3
  const [output, setOutput] = useState("");

  const handleRunCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/execute", {
        code,
        languageId,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.error || "Execution failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Code Executor</h2>

      <label className="block mb-2">Select Language:</label>
      <select
        value={languageId}
        onChange={(e) => setLanguageId(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="71">Python</option>
        <option value="62">Java</option>
        <option value="63">JavaScript</option>
        <option value="54">C++</option>
        <option value="50">C</option>
      </select>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={handleRunCode}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Run Code
      </button>

      <h3 className="mt-4 font-semibold">Output:</h3>
      <pre className="bg-gray-200 p-3 mt-2 whitespace-pre-wrap">{output}</pre>
    </div>
  );
};

export default CodeEditor;
