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
    const [seeDetails, setSeeDetails] = React.useState(false);
    const [scenarioFivePM, setScenarioFivePM] = React.useState("")

    React.useEffect(() => {
        const sortRoles = sortMain();
        setSorted(sortRoles);
    }, []);

    const sortMain = () => {
        if (selectedStartTime == "17:00") {
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

        /*
        Step 1: Sort by acute load (if the person worked within 90 minutes)
        Step 2: Sort the rest by chronic load ratio 
        */
        const sortA = [];
        const sortB = [];
        admissionsData.map((a, aIndex) => {
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


        const sortARoles = sortA.map((s) => s.name)
        const sortBRoles = sortB.map((s) => s.name);
        const finalSort = sortA.concat(sortB);

        const finalSortRoles = finalSort.map((s) => s.name);

        setScenarioFivePM("These roles have worked in the last 90 minutes: (" + sortARoles + ").  \
            Now we will sort by chronic load ratio for those who did not work the last 90 minutes (" + sortBRoles +"). \
            Therefore, the order is (" + finalSortRoles + ").");

        
        const sortRoles = [];
        finalSort.map((each, eachIndex) => {
            sortRoles.push(each.name);
        })
        console.log("Combine the 2 arrays: ", finalSort);
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

        const timeDifference = moment(selectedStartTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
        return timeDifference;
    }

    const getWorkedLast90Min = (timestamp) => {
        const now = moment(selectedStartTime, 'HH:mm');
        const timeDifference = moment(now, 'HH:mm').diff(moment(timestamp, 'HH:mm'), "minutes", true).toFixed();

        if (Number(timeDifference) < THRESHOLD) {
            return true;
        } else {
            return false
        }
    }

    const timesDropdown = () => {
        return (
            <select
                className="timesdropdown"
                onChange={e => {
                    const startTime = e.target.value;
                    let selectedAdmissionsData = "";
                    switch (startTime) {
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
                <button onClick={() => {
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
            <button className="seedetails" onClick={()=>{
                setSeeDetails(!seeDetails);
            }

            }>See Details</button>
            {seeDetails && <fieldset className="notes">
                <h2>4PM Scenario</h2>
                <p>
                    Sort by timestamp.
                </p>
                <h2>5PM Scenario</h2>
                <p>
                    {scenarioFivePM}
                    {/* Admissions that have happened in the past 90 minutes will be placed in the end of the queue.
                    Sort the rest of the queue by chronic load ratio. */}

                </p>
            </fieldset>}
        </div>
    )

}

export default App;
