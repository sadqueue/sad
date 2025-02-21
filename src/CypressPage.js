import React, { useState, useEffect } from "react";
import axios from "axios";

const CypressPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleRunTests = async () => {
        setLoading(true);
        try {
            await axios.post("http://localhost:3001/run-tests"); // Start Cypress tests via backend
        } catch (error) {
            console.error("Error running tests:", error);
        }
        setLoading(false);
    };

    const fetchLogs = async () => {
        try {
            const response = await axios.get("http://localhost:3001/logs");
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchLogs, 2000); // Poll logs every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Cypress Test Runner</h2>
            <button onClick={handleRunTests} disabled={loading}>
                {loading ? "Running..." : "Run Cypress Tests"}
            </button>

            <h3>Test Logs</h3>
            <pre>{logs.join("\n")}</pre>
        </div>
    );
};

export default CypressPage;
