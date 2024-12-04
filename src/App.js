import './App.css';
import React from "react";
import moment from "moment";
import { SHIFT_TYPES, START_TIMES, THRESHOLD,
    FOURPM_DATA, FIVEPM_DATA, SEVENPM_DATA
 } from './constants';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


export function App() {
    const [admissionsData, setAdmissionsData] = React.useState(FOURPM_DATA)
    const [sorted, setSorted] = React.useState("");
    const [seeDetails, setSeeDetails] = React.useState(false);
    const [explanation, setExplanation] = React.useState("")

    React.useEffect(()=>{
        sortMain(admissionsData);
    }, []);
    const sortMain = (timeObj = null) => {

        if (timeObj.startTime == "16:00") {
            return sortByTimeStamp(timeObj);
        } else {
            return sortByChronicLoadAndAcuteLoad(timeObj);
        }
    }
    const sortByTimeStamp = (timeObj) => {

        timeObj.shifts.sort(function (a, b) {
            return a.timestamp.localeCompare(b.timestamp);
        });
        const sortRoles = [];
        timeObj.shifts.map((each, eachIndex) => {
            sortRoles.push(each.name);
        });

        setExplanation(["For 4PM, sort by last admission timestamp."])
        setAdmissionsData(timeObj);
        setSorted(sortRoles.join(", "));
        // return sortRoles.join(", ");
    }

    const sortByChronicLoadAndAcuteLoad = (timeObj) => {
        /*
        Step 1: Sort by acute load (if the person worked within 90 minutes)
        Step 2: Sort the rest by chronic load ratio 
        */
        const sortA = [];
        const sortB = [];
        timeObj.shifts.map((a, aIndex) => {
            if (getWorkedLast90Min(a.timestamp)) {
                sortA.push(a);
            } else {
                sortB.push(a);
            }
        });

        sortB.sort(function (a, b) {
            const loadA = getChronicLoadRatio(a);
            const loadB = getChronicLoadRatio(b);
            return loadA - loadB;
        });

        const explanationArr = ["Step 1: Retrieve the roles have worked in the last 90 minutes: "];

        sortA.map((s, sIndex) => {
            explanationArr.push((sIndex + 1) + ": " + s.name + ` (${getMinutesWorkedFromStartTime(s.timestamp)} min ago)`);
        });

        explanationArr.push("Step 2: Retrieve the roles have NOT worked in the last 90 minutes. Then sort by chronic load ratio. ");

        sortB.map((s, sIndex) => {
            explanationArr.push((sIndex + 1) + ": " + s.name + ` (${getChronicLoadRatio(s)})`);
        });

        explanationArr.push("Step 3: Combine 'Step 2' queue with 'Step 1' queue. ");

        const finalSort = {};
        finalSort["startTime"] = timeObj.startTime;
        finalSort["startTimeFormatted"] = timeObj.startTimeFormatted;
        finalSort["shifts"] = sortB.concat(sortA);
        
        finalSort.shifts.map((s, sIndex) => {
            explanationArr.push((sIndex + 1) + ": " + s.name + ` (${getMinutesWorkedFromStartTime(s.timestamp)} min ago, ${getChronicLoadRatio(s)})`);
        });

        setExplanation(explanationArr);
        setAdmissionsData(finalSort);
        const sortRoles = [];
        finalSort.shifts.map((each, eachIndex) => {
            sortRoles.push(each.name);
        })
        setSorted(sortRoles.join(", "));
        // return sortRoles.join(", ");
    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const newObj = {};

        const updatedShifts = admissionsData.shifts.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        newObj["startTime"] = admissionsData.startTime;
        newObj["startTimeFormatted"] = admissionsData.startTimeFormatted;
        newObj["shifts"] = updatedShifts;

        setAdmissionsData(newObj);
    }

    const getChronicLoadRatio = (admission) => {
        if (admission.isStatic) {
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
            if (shift.type == name) {
                startTime = shift.start;
            }
        });

        const timeDifference = moment(admissionsData.startTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
        return timeDifference;
    }

    const getWorkedLast90Min = (timestamp) => {
        const now = moment(admissionsData.startTime, 'HH:mm');
        const timeDifference = moment(now, 'HH:mm').diff(moment(timestamp, 'HH:mm'), "minutes", true).toFixed();

        if (Number(timeDifference) < THRESHOLD) {
            return true;
        } else {
            return false;
        }
    }

    const getMinutesWorkedFromStartTime = (timestamp) => {
        const now = moment(admissionsData.startTime, 'HH:mm');
        const timeDifference = moment(now, 'HH:mm').diff(moment(timestamp, 'HH:mm'), "minutes", true).toFixed();
        return timeDifference;
    }

    const timesDropdown = () => {
        return (
            <select
                className="timesdropdown"
                onChange={e => {
                    const startTime = e.target.value;
                    switch (startTime) {
                        case "FOURPM":
                            sortMain(FOURPM_DATA);
                            break;
                        case "FIVEPM":
                            sortMain(FIVEPM_DATA);
                            break;
                        case "SEVENPM":
                            sortMain(SEVENPM_DATA);
                            break;
                        default:
                            sortMain(FOURPM_DATA);
                            break;
                    }
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
            <Table>
                <Thead>
                    <Tr>
                        <Th>Role</Th>
                        <Th>Number of Admissions</Th>
                        <Th>Chronic Load Ratio</Th>
                        <Th>Last Admission Timestamp</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {admissionsData.shifts.map((admission) => (
                        <Tr className={admission.isStatic ? "statictr" : ""} key={admission.admissionsId}>
                            <Td className="grayinput">
                                <input
                                    name="name"
                                    value={admission.displayName} 
                                    type="text"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    disabled={true}
                                />
                            </Td>
                            <Td>
                                <input
                                    name="numberOfAdmissions"
                                    value={admission.numberOfAdmissions}
                                    type="text"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    placeholder="Enter number"
                                    disabled={admission.isStatic}
                                />
                            </Td>
                            <Td className="grayinput">
                                <input
                                    
                                    name="chronicLoadRatio"
                                    type="text"
                                    value={getChronicLoadRatio(admission)}
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    disabled={true}
                                />
                            </Td>
                            <Td>
                                <input
                                    name="timestamp"
                                    value={admission.timestamp}
                                    type="time"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    disabled={admission.isStatic}
                                />
                            </Td>

                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <section style={{ textAlign: "center", margin: "30px" }}>
                <button onClick={() => {
                    sortMain(admissionsData);
                }}>
                    Generate Queue
                </button>
            </section>
            <fieldset>
                <button
                    onClick={(ev) => {
                        navigator.clipboard.writeText(`Order of Admissions for ${moment(admissionsData.startTime, 'HH:mm').format('h')}PM: ${sorted}`);

                    }}>Copy</button>

                <h1>
                    {`Order of Admissions for ${moment(admissionsData.startTime, 'HH:mm').format('h')}PM:`}
                </h1>
                <h1>{`${sorted}`}</h1>
                <button className="seedetails" onClick={() => {
                    setSeeDetails(!seeDetails);
                }
                }>{seeDetails ? "(-)" : "(+)"}</button>
            </fieldset>
            {seeDetails && <fieldset className="notes">
                <h2>Explanation</h2>

                {explanation && explanation.map((line, lineIndex) => {
                    return <p>{line}</p>
                })}
            </fieldset>}
        </div>
    )

}

export default App;
