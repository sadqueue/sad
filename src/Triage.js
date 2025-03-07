import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { fetchConfigValues } from "./transactionsApi";
import { SHIFT_TYPES, TIME_FORMAT } from "./constants";
import { getConfigNavbar } from "./helper";
export function HOT() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState([]);
    const [workingShifts, setWorkingShifts] = useState([]);
    const [timestamps, setTimestamps] = useState({});
    const [admissionsCount, setAdmissionsCount] = useState({});
    const [logs, setLogs] = useState([]);
    const [manualNow, setManualNow] = useState(moment());
    const [scores, setScores] = useState({});

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

    // Effect to update scores whenever timestamps change
    useEffect(() => {
        updateScores();
    }, [timestamps, workingShifts]);

    const updateWorkingShifts = () => {
        const now = moment();
        // const now = manualNow;
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

    const calculateScoresForShift = (shift) => {
        const now = moment();
        // const now = manualNow;
        const shiftStart = moment(shift.start, "HH:mm");
        let minutesWorked = now.diff(shiftStart, 'minutes');
        if (minutesWorked < 0) minutesWorked += 1440;
        
        const numAdmits = timestamps[shift.name]?.length || 0;
        const lastAdmitTime = timestamps[shift.name]?.[numAdmits - 1] || shiftStart.format("HH:mm");
        const minutesSinceLastAdmit = now.diff(moment(lastAdmitTime, "HH:mm"), "minutes");
        
        const ALR = numAdmits === 0 ? 0 : Math.max(0, 1 - (minutesSinceLastAdmit / 180));
        const CLR = minutesWorked === 0 ? 0 : (numAdmits / (minutesWorked / 60));
        const compositeScore = 0.7 * ALR + 0.3 * CLR;
        
        return {
            ALR: ALR.toFixed(3),
            CLR: CLR.toFixed(3),
            compositeScore: compositeScore.toFixed(3)
        };
    };

    const updateScores = () => {
        const updatedScores = {};
        workingShifts.forEach(shift => {
            updatedScores[shift.name] = calculateScoresForShift(shift);
        });
        setScores(updatedScores);
    };

    const calculateCompositeScores = () => {
        const now = moment();
        // const now = manualNow;
        let shiftScores = workingShifts.map(shift => {
            const { ALR, CLR, compositeScore } = calculateScoresForShift(shift);
            logMessage(`--- ${shift.name} --- \nALR: ${ALR}\nCLR: ${CLR}\nScore: ${compositeScore}`);
            return { shift, compositeScore: parseFloat(compositeScore) };
        });
        shiftScores.sort((a, b) => a.compositeScore - b.compositeScore);

        const order = [];
        shiftScores.forEach((each, eachIndex) => {
            order.push(each.shift.name);
        })
        setQueue(prevQueue => [...order]); 
        return shiftScores;
    };

    const addTimestamp = () => {
        const shiftScores = calculateCompositeScores();
        if (shiftScores.length === 0) return;
        const selectedShift = shiftScores[0].shift;
        logMessage(`The selected shift to add is ${selectedShift.name}`);
        const now = moment().format("HH:mm");
    
        setTimestamps(prev => {
            const updatedTimestamps = { 
                ...prev, 
                [selectedShift.name]: [...(prev[selectedShift.name] || []), now] 
            };
            return updatedTimestamps;
        });
    
        setAdmissionsCount(prev => ({ 
            ...prev, 
            [selectedShift.name]: (prev[selectedShift.name] || 0) + 1 
        }));
    
        updateScores();
    };
    // const updateQueue = (shiftName) => {

    //     setQueue(prevQueue => {
    //         const updatedQueue = prevQueue.filter(name => name !== shiftName);
    //         updatedQueue.push(shiftName);
    //         return updatedQueue;
    //     });
    // };

    useEffect(() => {
        updateScores();
        calculateCompositeScores();
    }, [timestamps, workingShifts]);

    useEffect(() => {
        updateScores();
    }, [timestamps]);

    return (
        <div>
            <div className="containerconfig">
                {/* <ul>
                    <li><a href="/sad#/data">Data</a></li>
                    <li><a href="/sad#/statistics">Statistics</a></li>
                    <li><a href="/sad#/triage">Triage</a></li>
                    <li><a href="/sad#/login">Settings</a></li>
                    <li><a href="/sad#/login" onClick={() => localStorage.removeItem("loggedin")}>
                        Logout
                    </a></li>
                </ul> */}
                {getConfigNavbar()}
                <fieldset>
                    <p>Queue: {queue.join(" > ")}</p>
                    <button onClick={addTimestamp}>+</button>
                    {/* <button onClick={updateScores}>Update Scores</button> */}
                </fieldset>
                <h3>Currently Working Shifts</h3>
                <table className="shift-table">
                    <thead>
                        <tr>
                            <th>Shift Name</th>
                            <th>Time Period</th>
                            <th>Timestamps</th>
                            <th>Scores</th>
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
                                                        const updatedTimestamps = { 
                                                            ...prev, 
                                                            [shift.name]: prev[shift.name] ? prev[shift.name].filter((_, i) => i !== index) : [] 
                                                        };
                                                        return updatedTimestamps;
                                                    });

                                                    setAdmissionsCount(prev => ({
                                                        ...prev,
                                                        [shift.name]: Math.max((prev[shift.name] || 0) - 1, 0)
                                                    }));

                                                    // Use useEffect to trigger updates after timestamps change
                                                }}>❌</button>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="scores-cell">
                                    {scores[shift.name] ? (
                                        <div className="scores-container">
                                            <div className="score-row">
                                                <span className="score-label">ALR:</span>
                                                <span className="score-value">{scores[shift.name].ALR}</span>
                                            </div>
                                            <div className="score-row">
                                                <span className="score-label">CLR:</span>
                                                <span className="score-value">{scores[shift.name].CLR}</span>
                                            </div>
                                            <div className="score-row">
                                                <span className="score-label">Composite:</span>
                                                <span className="score-value">{scores[shift.name].compositeScore}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span>No data</span>
                                    )}
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
            <style jsx>{`
                .scores-cell {
                    min-width: 200px;
                }
                .scores-container {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .score-row {
                    display: flex;
                    justify-content: space-between;
                }
                .score-label {
                    font-weight: bold;
                    margin-right: 10px;
                }
                .score-value {
                    font-family: monospace;
                }
            `}</style>
        </div>
    );
}

export default HOT;