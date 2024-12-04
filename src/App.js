import './App.css';
import React from "react";
import moment from "moment";
import { FIVEPM, SEVENPM, FOURPM, SHIFT_TYPES, START_TIMES, THRESHOLD } from './constants';
const timeNow = "19:00";


export function App() {
    const [admissionsData, setAdmissionsData] = React.useState(FOURPM)
    const [sorted, setSorted] = React.useState();
    const [displayOrderOfAdmissions, setDisplayOrderOfAdmissions] = React.useState(false);
    const [selectedStartTime, setSelectedStartTime] = React.useState("16:00");

    React.useEffect(() => {
        const sortRoles = sortMain();
        setSorted(sortRoles);
    }, []);

    const sortMain = () => {
        if  (selectedStartTime == "17:00"){
            return sortByChronicLoadAndAcuteLoad();
        } else {
            return sortByTimeStamp();
        }
    }
    const sortByTimeStamp = () => {
        admissionsData.sort(function (a, b) {
            return a.timestamp.localeCompare(b.timestamp);
        });
        const sortRoles = [];
        admissionsData.map((each, eachIndex) => {
            sortRoles.push(each.name);
        })
        return sortRoles.join(", ");
    }

    const sortByChronicLoadAndAcuteLoad = () => {
        
        admissionsData.sort(function (a, b)  {
            const loadA = getChronicLoadRatio(a);
            const loadB = getChronicLoadRatio(b);
            return loadA - loadB;
        });
        const sortRoles = [];
        admissionsData.map((each, eachIndex) => {
            sortRoles.push(each.name);
        })
        return sortRoles.join(", ");
    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const editData = admissionsData.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        setAdmissionsData(editData);
    }

    const getChronicLoadRatio = (admission) => {
        if (admission.isStatic){
            return admission.chronicLoadRatio;
        } else {
            const timeDifference = getNumberOfHoursWorked(admission.name, admission.timestamp);
            const chronicLoadRatio = (Number(admission.numberOfAdmissions) / (timeDifference)).toFixed(2);
    
            return chronicLoadRatio;
        }
    }

    const getNumberOfHoursWorked = (name, timestamp) => {
        let startTime = "";
        SHIFT_TYPES.forEach((shift, shiftIndex) => {
            if (shift.type == name){
                startTime = shift.start;
            }
        });
        
        const timeDifference = moment(selectedStartTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
        return timeDifference;
    }

    const getWorkedLast90Min = (timestamp) => {
        const now = moment();
        const timeDifference = moment(now, 'HH:mm').diff(moment(timestamp, 'HH:mm'), "minutes", true).toFixed();

        if (Number(timeDifference) < THRESHOLD){
            return "Yes";
        } else {
            return "No";
        }
    }

    const timesDropdown = () => {
        return (
            <select 
                className="timesdropdown"
                onChange={e => {
                        const startTime = e.target.value;
                        let selectedAdmissionsData = "";
                        switch(startTime){
                            case "FOURPM":
                                selectedAdmissionsData = FOURPM;
                                setSelectedStartTime("16:00")
                                break;
                            case "FIVEPM":
                                selectedAdmissionsData = FIVEPM;
                                setSelectedStartTime("17:00")
                                break;
                            case "SEVENPM":
                                selectedAdmissionsData = SEVENPM;
                                setSelectedStartTime("19:00")
                                break;
                            default: 
                                selectedAdmissionsData = FOURPM;
                                setSelectedStartTime("16:00")
                                break;
                        }
                        setAdmissionsData(selectedAdmissionsData);
                        const sortRoles = sortMain();
                        setSorted(sortRoles);
                    }
                }>
                {START_TIMES.map((startTime, startTimeIndex) => {
                    return (<option value={`${startTime.value}`}>{`${startTime.label}`}</option>);
                })}
            </select>
        );
    }
    return (
        <div className="container">
            <h1 className="title">S.A.D. Queue</h1>
            <h2>Standardized Admissions Distribution</h2>
            {timesDropdown()}
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Number of Admissions</th>
                        <th>Chronic Load Ratio</th>
                        <th>Last Admission Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionsData.map((admission) => (
                        <tr key={admission.admissionsId}>
                            <td>
                                <input
                                    name="name"
                                    value={admission.displayName} //+"\n"+getNumberOfHoursWorked(name, timestamp)
                                    type="text"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    
                                />
                            </td>
                            <td>
                                <input
                                    name="numberOfAdmissions"
                                    value={admission.numberOfAdmissions}
                                    type="text"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    placeholder="Enter number"
                                />
                            </td>
                            <td>
                                <input
                                    name="chronicLoadRatio"
                                    type="text"
                                    value={getChronicLoadRatio(admission)}
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    
                                />
                            </td>
                            <td>
                                <input
                                    name="timestamp"
                                    value={admission.timestamp}
                                    type="time"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                />
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            <section style={{ textAlign: "center", margin: "30px" }}>
                <button onClick={()=>{
                    // sortByTimeStamp();
                    const sortRoles = sortMain();
                    setSorted(sortRoles);
                    setAdmissionsData(admissionsData);
                }}>
                    Generate Queue
                </button>
            </section>
            <fieldset>
                    <button
                     onClick={(ev) => {
                        navigator.clipboard.writeText(`Order of Admissions for ${moment(selectedStartTime, 'HH:mm').format('h')}PM: ${sorted}`);

                    }}>Copy</button>
                  
                    <h1>
                        {`Order of Admissions for ${moment(selectedStartTime, 'HH:mm').format('h')}PM:`}
                    </h1>
                    <h1>{`${sorted}`}</h1>
                </fieldset>
        </div>
    )

}

export default App;
