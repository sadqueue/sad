import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CypressTestRunner() {
  const [testCode, setTestCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    // Fetch the test file content
    fetch("/api/read-file")
      .then((res) => res.text())
      .then((data) => setTestCode(data))
      .catch(() => setTestCode("Error loading test file"));
  }, []);

  const runTest = async () => {
    const response = await fetch("/api/run-test", { method: "POST" });
    const result = await response.text();
    setOutput(result);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Cypress Test Runner</h1>
      <Editor height="300px" defaultLanguage="javascript" value={testCode} onChange={(value) => setTestCode(value)} />
      <button onClick={runTest} className="mt-4 bg-blue-500 text-white p-2 rounded">Run Test</button>
      <pre className="mt-4 bg-gray-100 p-2">{output}</pre>
    </div>
  );
}
