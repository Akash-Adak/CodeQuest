import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onCodeChange, language }) => {
  const [localCode, setLocalCode] = useState(code || '');
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (code !== localCode) {
      isUpdatingRef.current = true;
      setLocalCode(code);
    }
  }, [code]);

  const handleEditorChange = (value) => {
    setLocalCode(value);
    if (!isUpdatingRef.current) {
      onCodeChange(value);
    }
    isUpdatingRef.current = false;
  };

  return (
    <Editor
      height="60vh"
      defaultLanguage={language || 'java'}
      value={localCode}
      onChange={handleEditorChange}
      theme="vs-dark"
    />
  );
};

export default CodeEditor;
