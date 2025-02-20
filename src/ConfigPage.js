import React, { useEffect, useState } from "react";
import { fetchConfigValues, updateConfigValue } from "./transactionsApi";

const ConfigPage = () => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getConfig = async () => {
            const configData = await fetchConfigValues();
            setConfig(configData);
            setLoading(false);
        };
        getConfig();
    }, []);

    const handleChange = (key, value) => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
    };

    const handleSave = async (key) => {
        if (config[key] !== undefined) {
            await updateConfigValue(key, parseFloat(config[key]));
            alert(`${key} updated successfully!`);
        }
    };

    return (
        <div className="container">
            <h3>Configuration Settings</h3>
            {Object.keys(config).map((key) => (
                <div key={key} style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <label style={{ flex: 1, fontWeight: "bold" }}>{key.replaceAll("_", " ")}:</label>
                    <input
                        type="text"
                        value={config[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        style={{ flex: 2, padding: "5px" }}
                    />
                    <button 
                        onClick={() => handleSave(key)}
                        style={{
                            padding: "5px 10px",
                            cursor: "pointer",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "3px"
                        }}
                    >
                        Save
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ConfigPage;
