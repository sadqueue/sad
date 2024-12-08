import './App.css';
import React from "react";
import moment from "moment";
import {
    SHIFT_TYPES, START_TIMES, THRESHOLD,
    FOURPM_DATA, FIVEPM_DATA, SEVENPM_DATA, SCORE_NEW_ROLE
} from './constants';
import { table, thead, tbody, tr, th, td } from 'react-super-responsive-table';
// import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import copybutton from './images/copy.png' // relative path to image 


import cong from "./configuration"; // Assuming the correct path to your configuration file
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
        
        function writeUserData(userId, name, email, imageUrl) {
            const db = getDatabase(app);
            set(ref(db, 'users/' + userId), {
              username: name,
              email: email,
              profile_picture : imageUrl
            });
          }

          writeUserData("mm", "marika", "m@gmail.com", "url")

    }, []);

    const sortMain = (timeObj) => {

        if (timeObj.startTime === "16:00" || timeObj.startTime === "19:00") {
            return sortByCompositeScore(timeObj);
        } else {
            // return sortByChronicLoadAndAcuteLoad(timeObj);
            return sortByCompositeScore(timeObj);
        }
    }

    const sortByTimeStamp = (timeObj) => {

        timeObj.shifts.sort(function (a, b) {
            return a.timestamp.localeCompare(b.timestamp);
        });
        const sortRoles = [];
        timeObj.shifts.forEach((each, eachIndex) => {
            sortRoles.push(each.name);
        });

        setExplanation(["For 4PM, sort by last admission timestamp."])
        setAdmissionsData(timeObj);
        setSorted(sortRoles.join(", "));
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

            const partD = partC * (1-Number(weight));
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
                explanationArr.push("Role " + each.name + ": " + "(" + weight + " * " + each.chronicLoadRatio + ") + (" + (1-weight).toFixed(2) + " * ( 180 - " + each.minutesWorkedFromStartTime + " ) / 180) = " + each.score);
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

    const sortByChronicLoadAndAcuteLoad = (timeObj) => {
        /*
        Step 1: Sort by acute load (if the person worked within 90 minutes)
        Step 2: Sort the rest by chronic load ratio 
        */
        const sortA = [];
        const sortB = [];
        timeObj.shifts.forEach((a, aIndex) => {
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

        sortA.forEach((s, sIndex) => {
            explanationArr.push((sIndex + 1) + ": " + s.name + ` (${getMinutesWorkedFromStartTime(s.timestamp)} min ago)`);
        });

        explanationArr.push("Step 2: Retrieve the roles have NOT worked in the last 90 minutes. Then sort by chronic load ratio. ");

        sortB.forEach((s, sIndex) => {
            explanationArr.push((sIndex + 1) + ": " + s.name + ` (${getChronicLoadRatio(s)})`);
        });

        explanationArr.push("Step 3: Combine 'Step 2' queue with 'Step 1' queue. ");

        const finalSort = {};
        finalSort["startTime"] = timeObj.startTime;
        finalSort["shifts"] = sortB.concat(sortA);

        finalSort.shifts.forEach((s, sIndex) => {
            explanationArr.push((sIndex + 1) + ": " + s.name + ` (${getMinutesWorkedFromStartTime(s.timestamp)} min ago, ${getChronicLoadRatio(s)})`);
        });

        setExplanation(explanationArr);
        setAdmissionsData(finalSort);
        const sortRoles = [];
        finalSort.shifts.forEach((each, eachIndex) => {
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
        newObj["shifts"] = updatedShifts;

        setAdmissionsData(newObj);
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

    const getWorkedLast90Min = (timestamp) => {
        const now = moment(admissionsData.startTime, 'HH:mm');
        const timeDifference = moment(now, 'HH:mm').diff(moment(timestamp, 'HH:mm'), "minutes", true).toFixed();

        if (Number(timeDifference) < THRESHOLD) {
            return true;
        } else {
            return false;
        }
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

    const getDisplayName = (admission) => {
        let displayStartTimeToEndTime = "";
        SHIFT_TYPES.forEach((shift, shiftIndex) => {
            if (shift.type === admission.name) {
                displayStartTimeToEndTime = shift.displayStartTimeToEndTime;
            }
        });

        return `${admission.name}: ${admission.displayStartTimeToEndTime}`;
    }

    return (
        <div className="container">
            <h1 className="title">S.A.D. Queue</h1>
            <h2>Standardized Admissions Distribution</h2>
            {timesDropdown()}
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
            <table>
                <thead>
                    {openTable ? <tr>
                        <th>Role</th>
                        <th># of Admissions</th>
                        <th>Last Admission Time</th>
                        <th>Score</th>
                        <th> # Hours Worked</th>
                        <th> # Minutes Worked</th>
                        <th>Chronic Load Ratio</th>

                    </tr> :
                        <tr>
                            <th>Role</th>
                            <th># of Admissions</th>
                            <th>Last Admission Time</th>
                            <th>Score</th>
                        </tr>}
                </thead>
                <tbody>
                    {admissionsData.shifts.map((admission) => (
                        !admission.isStatic &&
                        <tr>
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
                            <td>
                                <input

                                    name="compositeScore"
                                    type="text"
                                    value={admission.score}
                                    disabled={true}
                                />
                            </td>
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
                    }}/>

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
        </div>
    )

}

export default App;
