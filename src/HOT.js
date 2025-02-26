import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { fetchConfigValues, addTransaction, getMostRecentTransaction } from "./transactionsApi";
import { SHIFT_TYPES } from "./constants";

export function HOT() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
    const [queue, setQueue] = useState("DA > S1 > S2");
    const [workingShifts, setWorkingShifts] = useState([]);
    const [timestamps, setTimestamps] = useState({ DA: ["", ""] });
    
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const data = await fetchConfigValues();
                setConfig(data);
            } catch (err) {
                console.error("Failed to load configuration.", err);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
        updateWorkingShifts();
    }, []);

    const updateWorkingShifts = () => {
        const now = moment().format("HH:mm");
        const shifts = SHIFT_TYPES.filter(shift => now >= shift.start && now < shift.end);
        setWorkingShifts(shifts);
    };

    const addTimestamp = () => {
        setTimestamps(prev => ({ ...prev, DA: [...prev.DA, ""] }));
    };

    const updateTimestamp = (index, value) => {
        setTimestamps(prev => {
            const newTimestamps = [...prev.DA];
            newTimestamps[index] = value;
            return { ...prev, DA: newTimestamps };
        });
    };

    return (
        <div>
            <h1>HOT Admissions</h1>
            <div className="queue-box">
                <p>Queue: {queue}</p>
                <p>{moment().format("MMMM D, YYYY HH:mm")}</p>
                <button onClick={addTimestamp}>+</button>
            </div>
            <h2>Currently Working Shifts</h2>
            <table className="shift-table">
                <thead>
                    <tr>
                        <th>Shift Name</th>
                        <th>Time Period</th>
                        <th>Timestamps</th>
                    </tr>
                </thead>
                <tbody>
                    {workingShifts.map((shift) => (
                        <tr key={shift.admissionsId}>
                            <td>{shift.name}</td>
                            <td>{shift.displayStartTimeToEndTime}</td>
                            <td>
                                {/* {shift.name === "DA" && (
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        {timestamps.DA.map((timestamp, index) => (
                                            <input 
                                                key={index} 
                                                type="text" 
                                                value={timestamp} 
                                                onChange={(e) => updateTimestamp(index, e.target.value)} 
                                                style={{ width: "50px" }}
                                            />
                                        ))}
                                    </div>
                                )} */}
                                <div style={{ display: "flex", gap: "5px", padding: "10px" }}>
                                    {timestamps[shift.name] && timestamps[shift.name].map((each, eachIndex) => {
                                        return (
                                            <input 
                                                key={"1"} 
                                                type="text" 
                                                value={""} 
                                                onChange={(e) => updateTimestamp(eachIndex, e.target.value)} 
                                                style={{ width: "50px", border: "solid" }}
                                            />
                                        );
                                    })} 
                                    
                                    </div>
                                    
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HOT;
