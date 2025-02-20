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

    // if (loading) return <div>Loading configuration...</div>;

    return (
        <div className="container">
            <h3>Configuration Settings</h3>
            {Object.keys(config).map((key) => (
                <div key={key} style={{ marginBottom: "10px" }}>
                    <label>{key}: </label>
                    <input
                        type="text"
                        value={config[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                    />
                    <button onClick={() => handleSave(key)}>Save</button>
                </div>
            ))}
        </div>
    );
};

export default ConfigPage;
