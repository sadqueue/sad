import './App.css';
import React, { useState } from "react";
import moment from "moment";
import {
    SHIFT_TYPES, START_TIMES, THRESHOLD,
    FOURPM_DATA, FIVEPM_DATA, SEVENPM_DATA, SCORE_NEW_ROLE
} from './constants';
import copybutton from './images/copy.png' // relative path to image 
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";


export function App() {
    const [admissionsData, setAdmissionsData] = React.useState(FOURPM_DATA)
    const [sorted, setSorted] = React.useState("");
    const [seeDetails, setSeeDetails] = React.useState(false);
    const [explanation, setExplanation] = React.useState("");
    const [openTable, setOpenTable] = React.useState(false);
    const [weight, setWeight] = React.useState(0.3)

    React.useEffect(() => {
        sortMain(admissionsData);

        const firebaseConfig = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
            measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID

        };
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }, []);

    const sortMain = (timeObj) => {

        if (timeObj.startTime === "16:00" || timeObj.startTime === "19:00") {
            return sortByCompositeScore(timeObj);
        } else {
            return sortByCompositeScore(timeObj);
        }
    }

    const getCompositeScore = (admission) => {
        let score = "";
        if (SCORE_NEW_ROLE[admission.startTime].includes(admission.name)) {
            const partB = 180 - admission.minutesWorkedFromStartTime;
            const partC = partB / 180;

            score = partC.toFixed(3);
        } else {
            const partA = Number(weight) * admission.chronicLoadRatio;
            const partB = 180 - admission.minutesWorkedFromStartTime;
            const partC = partB / 180;

            const partD = partC * (1 - Number(weight));
            const compositeScore = partA + partD;
            score = Number(compositeScore.toFixed(3));
        }
        return score;
    }

    const sortByCompositeScore = (timeObj) => {
        timeObj.shifts.forEach((each, eachIndex) => {
            each["startTime"] = timeObj.startTime;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
        });

        timeObj.shifts.sort(function (a, b) {
            return a.score - b.score;
        });

        const explanationArr = [];
        explanationArr.push("Formula to get a composite score for each role:")
        timeObj.shifts.forEach((each, eachIndex) => {
            if (SCORE_NEW_ROLE[each.startTime].includes(each.name)) {
                explanationArr.push("Role " + each.name + ": " + "( 180 - " + each.minutesWorkedFromStartTime + " ) / 180 = " + each.score);
            } else {
                explanationArr.push("Role " + each.name + ": " + "(" + weight + " * " + each.chronicLoadRatio + ") + (" + (1 - weight).toFixed(3) + " * ( 180 - " + each.minutesWorkedFromStartTime + " ) / 180) = " + each.score);
            }
        })
        setExplanation(explanationArr);

        const sortRoles = [];
        timeObj.shifts.forEach((each, eachIndex) => {
            sortRoles.push(each.name);
        });

        setSorted(sortRoles.join(", "));
        setAdmissionsData(timeObj);

    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const newObj = {};

        const updatedShifts = admissionsData.shifts.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        newObj["startTime"] = admissionsData.startTime;
        newObj["shifts"] = updatedShifts;

        setAdmissionsData(newObj);
        setSortedTableToDisplay(newObj.shifts);
    }

    const getChronicLoadRatio = (admission) => {
        if (admission.isStatic) {
            return admission.chronicLoadRatio;
        } else {
            const timeDifference = admission.numberOfHoursWorked;
            const chronicLoadRatio = (Number(admission.numberOfAdmissions) / (timeDifference)).toFixed(2);

            return chronicLoadRatio;
        }
    }

    const getNumberOfHoursWorked = (admission) => {
        let startTime = "";
        SHIFT_TYPES.forEach((shift, shiftIndex) => {
            if (shift.type === admission.name) {
                startTime = shift.start;
            }
        });

        const now = admission.startTime;
        const timeDifference = moment(now, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
        return timeDifference;

    }

    const getMinutesWorkedFromStartTime = (admission) => {
        const now = moment(admission.startTime, 'HH:mm');
        const timeDifference = moment(now, 'HH:mm').diff(moment(admission.timestamp, 'HH:mm'), "minutes", true).toFixed();
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

    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'ascending',
    });

    const [sortedTableToDisplay, setSortedTableToDisplay] = useState(admissionsData.shifts);

    const sortedData = [...admissionsData.shifts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setSortedTableToDisplay(sortedData);
    };

    return (
        <div className="container">
            <h1 className="title">S.A.D. Queue</h1>
            <h2>Standardized Admissions Distribution</h2>
            {timesDropdown()}
            <table>
                <thead>
                    {openTable ? <tr>

                        <th onClick={() => handleSort('name')}>
                            Role {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>
                        <th onClick={() => handleSort('numberOfAdmissions')}>
                            # of Admission {sortConfig.key === 'numberOfAdmissions' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>
                        <th onClick={() => handleSort('timestamp')}>
                            Last Admission Time {sortConfig.key === 'timestamp' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>
                        <th onClick={() => handleSort('compositeScore')}>
                            Score {sortConfig.key === 'compositeScore' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>
                        <th onClick={() => handleSort('numberHoursWorked')}>
                            # Hours Worked {sortConfig.key === 'numberHoursWorked' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>
                        <th onClick={() => handleSort('numberMinutesWorked')}>
                            # Minutes Worked {sortConfig.key === 'numberMinutesWorked' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>
                        <th onClick={() => handleSort('chronicLoadRatio')}>
                            Chronic Load Ratio{sortConfig.key === 'chronicLoadRatio' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                        </th>

                    </tr> :
                        <tr>
                            <th onClick={() => handleSort('name')}>
                                Role {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                            </th>
                            <th onClick={() => handleSort('numberOfAdmissions')}>
                                # of Admission {sortConfig.key === 'numberOfAdmissions' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                            </th>
                            <th onClick={() => handleSort('timestamp')}>
                                Last Admission Time {sortConfig.key === 'timestamp' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↑'}
                            </th>
                        </tr>}
                </thead>
                <tbody>
                    {sortedTableToDisplay.map((admission) => (
                        !admission.isStatic &&
                        <tr
                            className={admissionsData.shifts[0].name == admission.name ? "firstup" : ""}
                            key={admission.admissionsId}>
                            <td>
                                <input
                                    name="name"
                                    value={admission.displayName}
                                    type="text"
                                    disabled={true}
                                />
                            </td>
                            <td className="usercanedit">
                                <input
                                    name="numberOfAdmissions"
                                    value={admission.numberOfAdmissions}
                                    step="1"
                                    type="number"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    placeholder="Enter number"
                                    disabled={admission.isStatic}
                                />
                            </td>
                            <td className="usercanedit">
                                <input
                                    name="timestamp"
                                    value={admission.timestamp}
                                    type="time"
                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                    disabled={admission.isStatic}
                                />
                            </td>
                            {openTable && <td>
                                <input

                                    name="compositeScore"
                                    type="text"
                                    value={admission.score}
                                    disabled={true}
                                />
                            </td>}
                            {openTable && <td>
                                <input
                                    name="numberHoursWorked"
                                    value={admission.numberOfHoursWorked}
                                    type="number"
                                    placeholder="Enter number"
                                    disabled={admission.isStatic}
                                />
                            </td>}
                            {openTable && <td>
                                <input
                                    name="numberMinutesWorked"
                                    value={admission.minutesWorkedFromStartTime}
                                    type="number"
                                    placeholder="Enter number"
                                    disabled={admission.isStatic}
                                />
                            </td>}
                            {openTable && <td>
                                <input

                                    name="chronicLoadRatio"
                                    type="text"
                                    value={admission.chronicLoadRatio}
                                    disabled={true}
                                />
                            </td>}

                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="seedetails" onClick={() => {
                setOpenTable(!openTable);
            }}>{openTable ? "(-)" : "(+)"}</button>
            <section style={{ textAlign: "center", margin: "30px" }}>
                <button onClick={() => {
                    sortMain(admissionsData);
                    setSortedTableToDisplay(admissionsData.shifts);
                }}>
                    Generate Queue
                </button>
            </section>
            <fieldset>
                <img
                    className="copybutton"
                    src={copybutton}
                    onClick={(ev) => {
                        navigator.clipboard.writeText(`Order of Admissions for ${moment(admissionsData.startTime, 'HH:mm').format('h')}PM: ${sorted}`);
                        alert("Order of admissions is successfully copied to your clipboard.")
                    }} />

                <button className="seedetails" onClick={() => {
                    setSeeDetails(!seeDetails);
                }
                }>{seeDetails ? "(-)" : "(+)"}</button>

                <h1>
                    {`Admissions Order for ${moment(admissionsData.startTime, 'HH:mm').format('h')}PM:`}
                </h1>
                <h1>{`${sorted}`}</h1>

            </fieldset>
            {seeDetails && <fieldset className="notes">
                <h2>Explanation</h2>

                {explanation && explanation.map((line, lineIndex) => {
                    return <p>{line}</p>
                })}
            </fieldset>}
            <input
                className="weight"
                name="weight"
                type="number"
                step=".1"
                value={weight}
                onChange={(ev) => {
                    setWeight(ev.target.value);
                }}
                placeholder={"Set weight"}
            />
        </div>
    )

}

export default App;
