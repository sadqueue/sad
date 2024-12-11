import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
    SHIFT_TYPES,
    START_TIMES,
    FOURPM_DATA,
    FIVEPM_DATA,
    SEVENPM_DATA,
    SCORE_NEW_ROLE,
    CUSTOM_DATA,
} from "./constants";
import copybutton from "./images/copy.png";
import githublogo from "./images/github-mark.png"
import sadqueuelogo from "./images/sadqueuelogo.png";
import emailjs from "@emailjs/browser";
import CONFIG1 from "./config";
const CONFIG = CONFIG1;

export function App() {
    const localData = localStorage.getItem('admissionsData');

    const [admissionsData, setAdmissionsData] = useState(localData ? JSON.parse(localData) : FOURPM_DATA)
    const [sorted, setSorted] = useState("");
    const [seeDetails, setSeeDetails] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [openTable, setOpenTable] = useState(false);
    const [weight, setWeight] = useState(0.3);
    const [sortedTableToDisplay, setSortedTableToDisplay] = useState(admissionsData && admissionsData.shifts ? admissionsData.shifts : []);
    const [selectCustom, setSelectCustom] = useState(false);
    useEffect(() => {
        emailjs.init(CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY);
        if (localStorage.getItem("admissionsData")){
            const admissionsDataLocalStorage = JSON.parse(localStorage.getItem("admissionsData"));
            setAdmissionsData(admissionsDataLocalStorage);     
        }

        sortMain(admissionsData);

        /*const firebaseConfig = {
            apiKey: CONFIG.REACT_APP_FIREBASE_API_KEY,
            authDomain: CONFIG.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: CONFIG.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: CONFIG.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: CONFIG.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: CONFIG.REACT_APP_FIREBASE_APP_ID,
            measurementId: CONFIG.REACT_APP_FIREBASE_MEASUREMENT_ID

        };
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();*/
    }, []);

    const sortMain = (timeObj) => {
        return sortByCompositeScore(timeObj);
    }

    const getCompositeScore = (admission) => {
        let score = "";
        if (SCORE_NEW_ROLE[admission.startTime] && SCORE_NEW_ROLE[admission.startTime].includes(admission.name)) {
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
        timeObj && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            each["startTime"] = timeObj.startTime;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
        });

        timeObj && timeObj.shifts && timeObj.shifts.sort(function (a, b) {
            return a.score - b.score;
        });

        const explanationArr = [];
        explanationArr.push("Formula to get a composite score for each role:")
        timeObj && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            if (SCORE_NEW_ROLE[each.startTime] && SCORE_NEW_ROLE[each.startTime].includes(each.name)) {
                explanationArr.push(`Role ${each.name}: (180 - ${each.minutesWorkedFromStartTime}) / 180 = ${each.score}`);
            } else {
                explanationArr.push(`Role ${each.name}: (${weight} * ${each.chronicLoadRatio}) + (${(1 - weight).toFixed(3)} * (180 - ${each.minutesWorkedFromStartTime}) / 180) = ${each.score}`);
            }
        })
        setExplanation(explanationArr);

        const sortRoles = [];
        const sortRolesNameOnly = [];
        timeObj && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            sortRolesNameOnly.push(each.name);
            sortRoles.push(`${each.name} ${each.numberOfAdmissions} ${each.numberOfHoursWorked} ${moment(each.timestamp, "H:mm").format("H:mm")}`);

        });

        sortRoles.push(sortRolesNameOnly.length > 0 ? `\nOrder ${moment(timeObj.startTime, "H:mm").format("H:mma")}` : "");
        sortRoles.push(`${sortRolesNameOnly.join(">")}`);

        setSorted(sortRoles);
        setSortedTableToDisplay(timeObj.shifts);
        setAdmissionsData(timeObj);
    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const newObj = {};

        const updatedShifts = admissionsData && admissionsData.shifts && admissionsData.shifts.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        newObj["startTime"] = admissionsData.startTime;
        newObj["shifts"] = updatedShifts ? updatedShifts : [];

        setAdmissionsData(newObj);
        setSortedTableToDisplay(newObj.shifts);
        localStorage.setItem("admissionsData", JSON.stringify(newObj));
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
        const timeDifference = moment(now, "HH:mm").diff(moment(startTime, "HH:mm"), "hours", true).toFixed();
        return timeDifference;

    }

    const getMinutesWorkedFromStartTime = (admission) => {
        const now = moment(admission.startTime, "HH:mm");
        const timeDifference = moment(now, "HH:mm").diff(moment(admission.timestamp, "HH:mm"), "minutes", true).toFixed();
        return timeDifference;
    }

    const timesDropdown = () => {
        return (
            <select
                className="timesdropdown"
                onChange={e => {
                    const startTime = e.target.value;
                    setSelectCustom(false);

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
                        case "CUSTOM":
                            setSelectCustom(true);
                            sortMain(CUSTOM_DATA);
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
        key: "name",
        direction: "ascending",
    });

    const sortedData = admissionsData && [...admissionsData.shifts].sort((a, b) => {
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }


        return 0;
    });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
        setSortedTableToDisplay(sortedData);
    };

    const handleCustomTime = (target) => {
        const customTime = target;
        const customShifts = [];
        const customObj = {};
        let admissionId = 0;
        let userInputTime = moment(customTime, "hh:mma");
        if (userInputTime.isBefore(moment("07:00", "hh:mma"))) {
            userInputTime = moment(customTime, "hh:mma").add(1, "days");
        }

        SHIFT_TYPES.forEach((each, eachIndex) => {

            const momentStartWithThreshold = moment(each.startWithThreshold, "hh:mma");
            let momentEndWithThreshold = moment(each.endWithThreshold, "hh:mma");

            if (each.type.includes("N")) {
                momentEndWithThreshold = momentEndWithThreshold.add("1", "days");
            }

            if (userInputTime.isAfter(momentStartWithThreshold) && userInputTime.isBefore(momentEndWithThreshold)) {
                customShifts.push({
                    admissionsId: admissionId + "",
                    name: each.type,
                    displayName: each.type + " " + each.displayStartTimeToEndTime,
                    numberOfAdmissions: "",
                    timestamp: ""
                });
                admissionId++;
            }
        });
        customObj["startTime"] = customTime;
        customObj["shifts"] = customShifts;

        sortMain(customObj);
    }

    const sendEmail = (e, copiedContent, title) => {
        e.preventDefault();

        emailjs.send(CONFIG.REACT_APP_EMAILJS_SERVICE_ID, CONFIG.REACT_APP_EMAILJS_TEMPLATE_ID, { message: copiedContent, title: title }, CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY).then(
            (response) => {
                console.log('SUCCESS!', response.status, response.text);
            },
            (error) => {
                console.log('FAILED...', error);
            },
        );

    };
    return (
        <div>
            <div className="header">
                <h1 className="title">S.A.D. Queue</h1>
                <h2 className="subtitle">Standardized Admissions Distribution</h2>
            </div>
            <div className="container">
                {timesDropdown()}
                {selectCustom && <input
                    className="customtime"
                    name="customTime"
                    type="time"
                    onChange={(e) => {
                        handleCustomTime(e.target.value);
                    }}
                    placeholder="Enter time"
                    defaultValue={"12:00"}
                />}
                <table>
                    <thead>
                        {openTable ? <tr>

                            <th onClick={() => handleSort("name")}>
                                Role {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>
                            <th className="numberofadmissions" onClick={() => handleSort("numberOfAdmissions")}>
                                # of Admissions {sortConfig.key === "numberOfAdmissions" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>
                            <th onClick={() => handleSort("timestamp")}>
                                Last Admission Time {sortConfig.key === "timestamp" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>
                            <th onClick={() => handleSort("compositeScore")}>
                                Score {sortConfig.key === "compositeScore" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>
                            <th onClick={() => handleSort("numberHoursWorked")}>
                                # Hours Worked {sortConfig.key === "numberHoursWorked" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>
                            <th onClick={() => handleSort("numberMinutesWorked")}>
                                # Minutes Worked {sortConfig.key === "numberMinutesWorked" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>
                            <th onClick={() => handleSort("chronicLoadRatio")}>
                                Chronic Load Ratio{sortConfig.key === "chronicLoadRatio" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                            </th>

                        </tr> :
                            <tr>
                                <th onClick={() => handleSort("name")}>
                                    Role {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                                </th>
                                <th onClick={() => handleSort("numberOfAdmissions")}>
                                    # of Admission {sortConfig.key === "numberOfAdmissions" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                                </th>
                                <th onClick={() => handleSort("timestamp")}>
                                    Last Admission Time {sortConfig.key === "timestamp" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "↑"}
                                </th>
                            </tr>}
                    </thead>
                    <tbody>
                        {sortedTableToDisplay.map((admission) => (
                            !admission.isStatic &&
                            <tr
                                className={admissionsData.shifts && admissionsData.shifts && admissionsData.shifts.length && admissionsData.shifts[0].name === admission.name ? "firstup" : ""}
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
                }}>{openTable ? "Minimize Table" : "Expand Table"}</button>
                <section style={{ textAlign: "center", margin: "30px" }}>
                    <button onClick={() => {
                        sortMain(admissionsData);
                        if (admissionsData && admissionsData.shifts) {
                            setSortedTableToDisplay(admissionsData.shifts);
                        }
                    }}>
                        Generate Queue
                    </button>
                </section>
                
                    <fieldset className="fieldsettocopy">
                        <img
                            alt="copy button"
                            className="copybutton"
                            src={copybutton}
                            onClick={(ev) => {
                                const forWhatTime = moment(admissionsData.startTime, "hh:mm").format("h:mmA");
                                const copiedMessage = `${sorted.join("\n")}`;
                                const title = `Admissions by ${forWhatTime}`;

                                navigator.clipboard.writeText(`${copiedMessage}`);
                                // sendEmail(ev, copiedMessage, title);

                                alert("Order of admissions is successfully copied to your clipboard.")
                            }} />

                        <p className="bold">
                            <br/>
                            {admissionsData.startTime ? `Admissions by ${moment(admissionsData.startTime, "hh:mm").format("h:mmA")}` : `Select a time. No roles in the queue.`}
                        </p>
                        {
                            sorted && sorted.map((each, eachIndex) => {
                                return <p className="sorted">{each}</p>
                            })
                        }</fieldset>
                        <p className="admissionsorderlastline">{"(Role) (Number of admits) / (Hours worked so far) (Last timestamp)"}</p>

<button className="seedetails" onClick={() => {
    setSeeDetails(!seeDetails);
}
}>{seeDetails ? "Hide Explanation" : "Show Explanation"}</button>
                    
                {seeDetails && <fieldset className="notes">
                    <p className="bold">Explanation</p>

                    {explanation && explanation.map((line, lineIndex) => {
                        return <p>{line}</p>
                    })}
                    Set Weight <input
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
                </fieldset>}
                
                <div className="footer">
                    <img
                        alt="copy button"
                        className="copybutton"
                        src={githublogo}
                        onClick={(ev) => {
                            window.location.href = "https://github.com/sadqueue/sad/tree/main";
                        }} />
                </div>
            </div>
        </div>
    )

}

export default App;
