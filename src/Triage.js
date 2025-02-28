import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { fetchConfigValues } from "./transactionsApi";
import { SHIFT_TYPES, TIME_FORMAT } from "./constants";

export function HOT() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState("");
    const [workingShifts, setWorkingShifts] = useState([]);
    const [timestamps, setTimestamps] = useState({
        DA: [],
        S1: [],
        S2: [],
        S3: [],
        S4: [],
        N5: [],
        N1: [],
        N2: [],
        N3: [],
        N4: [],
     });

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
        const now = moment(); // Current time
    
        const shifts = SHIFT_TYPES.filter(shift => {
            let shiftStart = moment(shift.start, "HH:mm");
            let shiftEnd = moment(shift.end, "HH:mm");
    
            // If shift ends on the next day, add 1 day to shiftEnd
            if (shiftEnd.isBefore(shiftStart)) {
                shiftEnd.add(1, "day");
            }
    
            return now.isBetween(shiftStart, shiftEnd, null, "[)"); // Inclusive start, exclusive end
        });
    
        setWorkingShifts(shifts);
    };
    
    

    const addTimestamp = () => {
        let whichRoleIsNext = "";
    
        workingShifts.every((shift) => {
            if (timestamps[shift.name] && timestamps[shift.name].length === 0) {
                whichRoleIsNext = shift.name;
                return false;
            } else {
                return true;
            }
        });
    
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const militaryTime = `${hours}:${minutes}`;
    
        setTimestamps(prev => {
            const updatedTimestamps = { ...prev, [whichRoleIsNext]: [...prev[whichRoleIsNext], militaryTime] };
    
            // Generate the queue string based on the keys that have timestamps
            const updatedQueue = Object.keys(updatedTimestamps)
                .filter(role => updatedTimestamps[role].length > 0)
                .join(" > ");
    
            setQueue(updatedQueue);
            return updatedTimestamps;
        });
        // addTimeStampToTriage(whichRoleIsNext, updatedTimestamps, updatedQueue)
    };
    

    const updateTimestamp = (shift, index, value) => {
        setTimestamps(prev => {
            const newTimestamps = [...prev[shift.name]];
            newTimestamps[index] = value;
            return { ...prev, [shift.name]: newTimestamps };
        });
    };

    const removeTimestamp = (shift,index) => {
        setTimestamps(prev => {
            const newTimestamps = prev[shift.name].filter((_, i) => i !== index);
            return { ...prev, [shift.name]: newTimestamps };
        });
    };

    return (
        <div>
            {/* <div className="header">
                <h1 className="title">S.A.D.Q.</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
            </div> */}
            <div className="containerconfig">
            <ul>
                <li>
                    <a href="/sad#/data">Data</a>
                </li>
                <li>
                    <a href="/sad#/statistics">Statistics</a>
                </li>
                <li>
                    <a href="/sad#/login">Config</a>
                </li>
                <li>
                    <a href="/sad#/triage">Triage</a>
                </li>
                <li>
                    <a href="/sad#/login" onClick={()=>{
                        localStorage.removeItem("loggedin");
                    }}>Logout</a>
                </li>
            </ul>
            <fieldset>
                <p>Queue: {queue}</p>
                <p>{moment().format("MMMM D, YYYY HH:mm")}</p>
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
                                    {timestamps[shift.name] && timestamps[shift.name].map((timestamp, timestampIndex) => (
                                        <div key={timestampIndex} className="timestamp-box">
                                            <input 
                                                className="eachTimestamp"
                                                type="time" 
                                                value={timestamp} 
                                                onChange={(e) => updateTimestamp(shift, timestampIndex, e.target.value)} 
                                            />
                                            <button className="delete-btn" onClick={() => removeTimestamp(shift,timestampIndex)}>❌</button>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {/* <button onClick={() => {
                    // const roles = [];
                    
                    // Object.values(timestamps).forEach((timestampsByRole, timestampsByRoleIndex) => {
                    //     timestampsByRole[0].forEach((timestamps, timestampsIndex) => {
                    //         if (timestamps.length > 0){
                    //             roles.push(timestampsByRole[0]);
                    //         }
                    //     });
                    // })
                    const roles = Object.keys(timestamps);
                    setQueue(roles.join(">"))
                }}>Generate</button> */}
            </table>
        </div>
        </div>
    );
}

export default HOT;
