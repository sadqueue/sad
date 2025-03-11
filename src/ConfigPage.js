import React, { useEffect, useState } from "react";
import { fetchConfigValues, updateConfigValue } from "./transactionsApi";
import "./ConfigPage.css";
import { CONFIGPAGE_PW } from "./config/config";
import { getConfigNavbar } from "./helper";

const CORRECT_PASSWORD = CONFIGPAGE_PW;

const ConfigPage = () => {
    const [config, setConfig] = useState({});
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const getConfig = async () => {
            const configData = await fetchConfigValues();
            setConfig(configData);
        };
        getConfig();
    }, []);

    const handleChange = (key, value) => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value,
        }));
    };

    const handleSave = async (key) => {
        if (config[key] !== undefined) {
            await updateConfigValue(key, parseFloat(config[key]));
            alert(`${key} updated successfully!`);
        }
    };

    const handleLogin = () => {
        if (password.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
            setAuthenticated(true);
            localStorage.setItem("loggedin", true);
        } else {
            alert("Incorrect password. Try again.");
            setPassword("");
        }
    };

    if (!authenticated && localStorage.getItem("loggedin")+"" !== "true") {
        return (
            <div className="container">
                <h3>Login</h3>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Submit</button>
            </div>
        );
    }

    return (
        <div className="containerconfig">
            <ul>
                { getConfigNavbar() }
                {/* <li>
                    <a href="/sad#/calculator">ALR & Composite Calculator</a>
                </li>
                <li>
                    <a href="/sad#/data">Data</a>
                </li>
                <li>
                    <a href="/sad#/statistics">Statistics</a>
                </li>

                <li>
                    <a href="/sad#/triage">Triage</a>
                </li>
                <li>
                    <a href="/sad#/login">Settings</a>
                </li>
                {/* <li>
                    <a href="/sad#/epic">Epic</a>
                </li> 
                <li>
                    <a href="/sad#/login" onClick={()=>{
                        localStorage.removeItem("loggedin");
                        setAuthenticated(false);
                    }}>Logout</a>
                </li> */}
            </ul>
            <div className="config-section">
                <div className="config-section">
                    <h4>Constant Composite</h4>
                    {[
                        { label: "5PM - N5", key: "CONSTANT_COMPOSITE_5PM_N5" },
                        { label: "7PM - N1", key: "CONSTANT_COMPOSITE_7PM_N1" },
                        { label: "7PM - N2", key: "CONSTANT_COMPOSITE_7PM_N2" },
                        { label: "7PM - N3", key: "CONSTANT_COMPOSITE_7PM_N3" },
                        { label: "7PM - N4", key: "CONSTANT_COMPOSITE_7PM_N4" },
                    ].map(({ label, key }) => (
                        <ConfigItem key={key} label={label} configKey={key} value={config[key]} onChange={handleChange} onSave={handleSave} />
                    ))}
                </div>
                <div className="config-section">
                <h4>ALR & CLR</h4>
                {[
                    { label: "ALR (5PM)", key: "ALR_5PM" },
                    { label: "CLR (5PM)", key: "CLR_5PM" },
                    { label: "ALR (7PM)", key: "ALR_7PM" },
                    { label: "CLR (7PM)", key: "CLR_7PM" },
                ].map(({ label, key }) => (
                    <ConfigItem key={key} label={label} configKey={key} value={config[key]} onChange={handleChange} onSave={handleSave} />
                ))}
            </div>
            

            <div className="config-section">
                <h4>P95</h4>
                {[
                    { label: "P95 (5PM)", key: "P95_5PM" },
                    { label: "P95 (7PM)", key: "P95_7PM" },
                ].map(({ label, key }) => (
                    <ConfigItem key={key} label={label} configKey={key} value={config[key]} onChange={handleChange} onSave={handleSave} />
                ))}
            </div>
            </div>
        </div>
    );
};

const ConfigItem = ({ label, configKey, value, onChange, onSave }) => {
    return (
        <div className="config-item">
            <label>{label}:</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(configKey, e.target.value)}
            />
            <button onClick={() => onSave(configKey)}>Save</button>
        </div>
    );
};

export default ConfigPage;
