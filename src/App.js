import './App.css';
import React from "react";
import moment from "moment";
import { FIVEPM, SEVENPM, FOURPM, SHIFT_TYPES, START_TIMES } from './constants';
const timeNow = "19:00";


export function App() {
    const [admissionsData, setAdmissionsData] = React.useState(FOURPM)
    const [sorted, setSorted] = React.useState("");
    const [displayOrderOfAdmissions, setDisplayOrderOfAdmissions] = React.useState(false);
    const [selectedStartTime, setSelectedStartTime] = React.useState(START_TIMES[0].label);

    React.useEffect(() => {
        admissionsData.sort(function (a, b) {
            return a.timestamp.localeCompare(b.timestamp);
        });
        const sortRoles = [];
        admissionsData.forEach((each, eachIndex) => {
            sortRoles.push(each.name);
        })
        setSorted(sortRoles.join(", "));
    }, []);

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const editData = admissionsData.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        editData.sort(function (a, b) {
            return a.timestamp.localeCompare(b.timestamp);
        });
        const sortRoles = [];
        editData.forEach((each, eachIndex) => {
            sortRoles.push(each.name);
        })
        setSorted(sortRoles.join(", "));
        setAdmissionsData(editData);
    }

    const getChronicLoadRatio = (name, numberOfAdmissions, timestamp) => {
        const startTime = SHIFT_TYPES.map((shift, shiftIndex) => {
            if (shift.type == name){
                return shift.start;
            }
        });
        
        const timeDifference = moment(selectedStartTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
        const chronicLoadRatio = (Number(numberOfAdmissions) / (timeDifference)).toFixed(2);

        return chronicLoadRatio;
    }

    const getNumberOfHoursWorked = (name, timestamp) => {
        const startTime = SHIFT_TYPES.map((shift, shiftIndex) => {
            if (shift.type == name){
                return shift.start;
            }
        });
        
        const timeDifference = moment(selectedStartTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
        return `${timeDifference} hours`;
    }

    const timesDropdown = () => {
        return (
            <select 
                className="timesdropdown"
                onChange={e => {
                        const startTime = e.target.value;

                        switch(startTime){
                            case "FOURPM":
                                setAdmissionsData(FOURPM);
                                setSelectedStartTime("16:00")
                                break;
                            case "FIVEPM":
                                setAdmissionsData(FIVEPM);
                                setSelectedStartTime("17:00")
                                break;
                            case "SEVENPM":
                                setAdmissionsData(SEVENPM);
                                setSelectedStartTime("19:00")
                                break;
                            default: 
                                setAdmissionsData(FOURPM);
                                setSelectedStartTime("16:00")
                                break;
                        }
                        const sortRoles = [];
                        admissionsData.forEach((each, eachIndex) => {
                            sortRoles.push(each.name);
                        })
                        setSorted(sortRoles.join(", "));
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
                        <th># of Admissions</th>
                        <th>Last Admin Timestamp</th>
                        <th># Hours Worked</th>
                        <th>Chronic Load Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionsData.map(({ admissionsId, displayName, name, numberOfAdmissions, timestamp, isTwoAdmits, chronicLoadRatio }) => (
                        <tr key={admissionsId}>
                            <td>
                                <input
                                    name="name"
                                    value={displayName}
                                    type="text"
                                    onChange={(e) => onChange(e, admissionsId)}
                                    disabled
                                />
                            </td>
                            <td>
                                <input
                                    name="numberOfAdmissions"
                                    value={numberOfAdmissions}
                                    type="text"
                                    onChange={(e) => onChange(e, admissionsId)}
                                />
                            </td>
                            <td>
                                <input
                                    name="timestamp"
                                    value={timestamp}
                                    type="time"
                                    onChange={(e) => onChange(e, admissionsId)}
                                />
                            </td>
                            <td>
                                <input
                                    name="numberOfHoursWorked"
                                    type="text"
                                    value={getNumberOfHoursWorked(name, timestamp)}
                                    onChange={(e) => onChange(e, admissionsId)}
                                    disabled
                                />
                            </td>
                            <td>
                                <input
                                    name="chronicLoad"
                                    type="text"
                                    value={getChronicLoadRatio(name, numberOfAdmissions, timestamp)}
                                    onChange={(e) => onChange(e, admissionsId)}
                                    disabled
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <section style={{ textAlign: "center", margin: "30px" }}>
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
