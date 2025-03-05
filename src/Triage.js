import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { fetchConfigValues } from "./transactionsApi";
import { SHIFT_TYPES, TIME_FORMAT } from "./constants";

export function HOT() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState([]);
    const [workingShifts, setWorkingShifts] = useState([]);
    const [timestamps, setTimestamps] = useState({});
    const [admissionsCount, setAdmissionsCount] = useState({});
    const [logs, setLogs] = useState([]);

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
        const now = moment();
        const order = [];
        const shifts = SHIFT_TYPES.filter(shift => {
            let shiftStart = moment(shift.start, "HH:mm");
            let shiftEnd = moment(shift.endWithThreshold, "HH:mm");
            if (shiftEnd.isBefore(shiftStart)) {
                shiftEnd.add(1, "day");
            }
            if (now.isBetween(shiftStart, shiftEnd, null, "[)")) {
                order.push(shift.name);
                return true;
            } else {
                return false;
            }
        });
        setQueue(order);
        setWorkingShifts(shifts);
    };

    const logMessage = (message) => {
        setLogs(prevLogs => [...prevLogs, message]);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const calculateCompositeScores = () => {
        const now = moment();
        let scores = workingShifts.map(shift => {
            const shiftStart = moment(shift.start, "HH:mm");
            let minutesWorked = now.diff(shiftStart, 'minutes');
            if (minutesWorked < 0) minutesWorked += 1440;
            const numAdmits = timestamps[shift.name]?.length || 0;
            const lastAdmitTime = timestamps[shift.name]?.[numAdmits - 1] || shiftStart.format("HH:mm");
            const minutesSinceLastAdmit = now.diff(moment(lastAdmitTime, "HH:mm"), "minutes");
            const ALR = numAdmits === 0 ? 0 : 1 - (minutesSinceLastAdmit / 180);
            const CLR = numAdmits === 0 ? 0 : numAdmits / (minutesWorked / 60);
            const compositeScore = 0.7 * ALR + 0.3 * CLR;
            logMessage(`--- ${shift.name} --- \nALR: ${ALR.toFixed(3)}\nCLR: ${CLR.toFixed(3)}\nScore: ${compositeScore.toFixed(3)}`);
            return { shift, compositeScore };
        });
        scores.sort((a, b) => a.compositeScore - b.compositeScore);
        return scores;
    };

    const addTimestamp = () => {
        const scores = calculateCompositeScores();
        if (scores.length === 0) return;
        const selectedShift = scores[0].shift;
        logMessage(`The selected shift to add is ${selectedShift.name}`);
        const now = moment().format("HH:mm");
        setTimestamps(prev => {
            const updatedTimestamps = { ...prev, [selectedShift.name]: [...(prev[selectedShift.name] || []), now] };
            return updatedTimestamps;
        });
        setAdmissionsCount(prev => ({ ...prev, [selectedShift.name]: (prev[selectedShift.name] || 0) + 1 }));
        updateQueue(selectedShift.name);
    };

    const updateQueue = (shiftName) => {
        setQueue(prevQueue => {
            const updatedQueue = prevQueue.filter(name => name !== shiftName);
            updatedQueue.push(shiftName);
            return updatedQueue;
        });
    };

    return (
        <div>
            <div className="containerconfig">
                <ul>
                    <li><a href="/sad#/data">Data</a></li>
                    <li><a href="/sad#/statistics">Statistics</a></li>
                    <li><a href="/sad#/login">Settings</a></li>
                    <li><a href="/sad#/triage">Triage</a></li>
                    <li><a href="/sad#/login" onClick={() => localStorage.removeItem("loggedin")}>
                        Logout
                    </a></li>
                </ul>
                <fieldset>
                    <p>Queue: {queue.join(" > ")}</p>
                    {/*<p>Current Time: {moment().format("HH:mm")}</p>*/}
                    <button onClick={addTimestamp}>+</button>
                </fieldset>
                <h3>Currently Working Shifts</h3>
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
                                    <div className="timestamp-container">
                                        {timestamps[shift.name]?.map((timestamp, index) => (
                                            <div key={index} className="timestamp-box">
                                                <input
                                                    className="eachTimestamp"
                                                    type="time"
                                                    value={timestamp}
                                                    onChange={(e) => {
                                                        setTimestamps(prev => {
                                                            const newTimestamps = [...prev[shift.name]];
                                                            newTimestamps[index] = e.target.value;
                                                            return { ...prev, [shift.name]: newTimestamps };
                                                        });
                                                    }}
                                                />
                                                <button className="delete-btn" onClick={() => {
                                                    setTimestamps(prev => {
                                                        const newTimestamps = prev[shift.name].filter((_, i) => i !== index);
                                                        return { ...prev, [shift.name]: newTimestamps };
                                                    });
                                                }}>❌</button>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <div className="log-box">
                        <h4>Logs</h4>
                        <button onClick={clearLogs}>Clear Logs</button>
                        <fieldset className="log-content">
                            {logs.map((log, index) => (
                                <p key={index}>{log}</p>
                            ))}
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HOT;
