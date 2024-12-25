import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
    SHIFT_TYPES,
    START_TIMES,
    FOURPM_DATA,
    SCORE_NEW_ROLE,
    CUSTOM_DATA,
    DATA_TYPE_INT,
    DATA_TYPE_TIME,
    CHRONIC_LOAD_RATIO_THRESHOLD,
    ADMISSIONS_FORMAT,
    TIME_FORMAT,
    MINIMIZE_TABLE,
    EXPAND_TABLE,
    ROLE_ORDER,
    STATIC_TIMES,
    DONT_SHOW_ROWS
} from "./constants";
import copybuttonImg from "./images/copy.png";
import githublogo from "./images/github-mark.png"
import emailjs from "@emailjs/browser";
import CONFIG1 from "./config";

const CONFIG = CONFIG1;
const DONT_SHOW_ROWS1 = DONT_SHOW_ROWS;

export function App() {
    // const localStorage_admissionsData = localStorage.getItem("admissionsData");
    // const localStorage_selectDropdown = localStorage.getItem("selectDropdown");
    const [admissionsData, setAdmissionsData] = useState(FOURPM_DATA)
    const [allAdmissionsDataShifts, setAllAdmissionsDataShifts] = useState([])
    const [sorted, setSorted] = useState("");
    const [seeDetails, setSeeDetails] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [openTable, setOpenTable] = useState(false);
    const [weight, setWeight] = useState(0.3);
    // const [sortedTableToDisplay, setSortedTableToDisplay] = useState(admissionsData && admissionsData.shifts ? admissionsData.shifts : []);
    const [isCopied, setIsCopied] = useState(false)
    const [sortConfig, setSortConfig] = useState(
        {
            "name": true,
            "numberOfAdmissions": true,
            "timestamp": true,
            "chronicLoadRatio": true,
            "numberOfHours": true,
            "score": true
        }
    );

    useEffect(() => {
        emailjs.init(CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY);
        if (localStorage.getItem("admissionsData")) {
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
        return sortByTimestampAndCompositeScore(timeObj);
    }

    const sortByTimestampAndCompositeScore = (timeObj) => {
        timeObj && timeObj.shifts && timeObj.shifts.map((each, eachIndex) => {
            each["startTime"] = timeObj.startTime;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
            each["numberOfAdmissions"] = each.numberOfAdmissions ? each.numberOfAdmissions : "";
            return each;
        });

        const explanationArr = [];
        explanationArr.push("\n");
        explanationArr.push("Step 1: Merge with nights based on last timestamp.");

        /*
        Step 1: Step 1: Sort based on timestamp 
        */
        timeObj && timeObj.shifts && timeObj.shifts.sort(function (a, b) {
            return moment(a.timestamp, TIME_FORMAT).diff(moment(b.timestamp, TIME_FORMAT));
        });
        timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            explanationArr.push(`${each.name}: ${getMomentTimeWithoutUndefined(each.timestamp)} | ${each.chronicLoadRatio}`)
        });

        /*
        Step 2: For each admitter, if chronic load ratio is >0.66, then deprioritize in the order 
        (either putting in back or pushing back by X spots depending on how great the ratio is)
        */
        const shiftsLessThanThreshold = [];
        const shiftsGreaterThanThreshold = [];
        explanationArr.push("\n");
        explanationArr.push(`Step 2: Determine the admitters with chronic load ratio >${CHRONIC_LOAD_RATIO_THRESHOLD}`);

        timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            if (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD) {
                explanationArr.push(`${each.name}: ${getMomentTimeWithoutUndefined(each.timestamp)} | ${each.chronicLoadRatio}`);
                shiftsGreaterThanThreshold.push(each);
            } else {
                shiftsLessThanThreshold.push(each);
            }
        });
        explanationArr.push("\n");
        explanationArr.push(`Step 3: De-prioritize admitters with high chronic loads to the back of the queue.`)
        const shiftsCombined = shiftsLessThanThreshold.concat(shiftsGreaterThanThreshold);

        shiftsCombined.forEach((each, eachIndex) => {
            explanationArr.push(`${each.name}: ${getMomentTimeWithoutUndefined(each.timestamp)} | ${each.chronicLoadRatio}`)
        });

        explanationArr.push("\n");
        explanationArr.push("Chronic Load Ratio: Number of Admissions / Numbers of hours worked");

        timeObj.shifts = shiftsCombined;

        setExplanation(explanationArr);

        setSortRoles(timeObj);
        setAdmissionsData(timeObj);

        handleSetAllAdmissionsDataShifts(timeObj);
        sortByAscendingName(timeObj);
    }

    const setInitialForDropdown = (timeObj) => {
        timeObj && timeObj.shifts && timeObj.shifts.map((each, eachIndex) => {
            let findRole = {};
            allAdmissionsDataShifts.map((innereach, innereachIndex) => {
                if (each.name == innereach.name) {
                    findRole = innereach;
                    return;
                }
            })
            if (findRole) {
                each = findRole;
                each["startTime"] = timeObj.startTime;
                each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(findRole);
                each["numberOfHoursWorked"] = getNumberOfHoursWorked(findRole);
                each["chronicLoadRatio"] = getChronicLoadRatio(findRole);
                each["score"] = getCompositeScore(findRole);
                each["numberOfAdmissions"] = findRole.numberOfAdmissions ? findRole.numberOfAdmissions : "";
                return each;
            } else {
                each["startTime"] = timeObj.startTime;
                each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
                each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
                each["chronicLoadRatio"] = getChronicLoadRatio(each);
                each["score"] = getCompositeScore(each);
                each["numberOfAdmissions"] = each.numberOfAdmissions ? each.numberOfAdmissions : "";
                return each;
            }

        });


        const sortRoles = [];
        const sortRolesNameOnly = [];
        sortRoles.push("\n");
        timeObj && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            if (each.numberOfHoursWorked + "" !== "0") {
                sortRoles.push(`${each.name} ${each.numberOfAdmissions} / ${each.numberOfHoursWorked} ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"}`);
            }
            sortRolesNameOnly.push(each.name);

        });

        sortRoles.push("\n");
        sortRoles.push(sortRolesNameOnly.length > 0 ? `\nOrder ${moment(timeObj.startTime, TIME_FORMAT).format(TIME_FORMAT)}` : "");
        sortRoles.push(`${sortRolesNameOnly.join(">")}`);

        setSorted(sortRoles);
        setAdmissionsData(timeObj);
        handleSetAllAdmissionsDataShifts(timeObj);

    }

    const getMomentTimeWithoutUndefined = (time) => {
        return time ? moment(time, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"
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
        return score ? score : "";
    }

    const handleSetAllAdmissionsDataShifts = (obj) => {
        const newObj = Object.assign([], allAdmissionsDataShifts, obj.shifts)
        setAllAdmissionsDataShifts(newObj);
    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const newObj = {};

        const updatedShifts = admissionsData && admissionsData.shifts && admissionsData.shifts.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        updatedShifts.map((each, eachIndex) => {
            each["startTime"] = admissionsData.startTime;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
            return each;
        });

        newObj["startTime"] = admissionsData.startTime;
        newObj["shifts"] = updatedShifts ? updatedShifts : [];

        setAdmissionsData(newObj);
        handleSetAllAdmissionsDataShifts(newObj);
    }

    const getChronicLoadRatio = (admission) => {
        const timeDifference = admission.numberOfHoursWorked;
        const chronicLoadRatio = (Number(admission.numberOfAdmissions) / (Number(timeDifference))).toFixed(2);

        if (chronicLoadRatio == "NaN" || chronicLoadRatio == "Infinity") {
            return "0.00";
        } else {
            return chronicLoadRatio;

        }

    }

    const getNumberOfHoursWorked = (admission) => {
        let startTime = "";
        SHIFT_TYPES.forEach((shift, shiftIndex) => {
            if (shift.name === admission.name) {
                startTime = shift.start;
            }
        });

        const now = admission.startTime;
        const timeDifference = moment(now, TIME_FORMAT).diff(moment(startTime, TIME_FORMAT), "hours", true).toFixed();
        return timeDifference;

    }

    const getMinutesWorkedFromStartTime = (admission) => {
        const now = getMomentTimeWithoutUndefined(admission.startTime);
        const timeDifference = moment(now, TIME_FORMAT).diff(moment(admission.timestamp, TIME_FORMAT), "minutes", true).toFixed();
        return timeDifference;
    }

    const getValuesFromExistingAdmissionsDate = (customTime) => {
        const customShifts = [];
        const customObj = {};
        let admissionId = 0;
        let userInputTime = moment(customTime, TIME_FORMAT);
        if (userInputTime.isBefore(moment("07:00", TIME_FORMAT))) {
            userInputTime = moment(customTime, TIME_FORMAT).add(1, "days");
        }

        SHIFT_TYPES.forEach((each, eachIndex) => {

            const momentStart = moment(each.startWithThreshold, TIME_FORMAT);
            let momentEndWithThreshold = moment(each.endWithThreshold, TIME_FORMAT);

            if (each.name.includes("N")) {
                momentEndWithThreshold = momentEndWithThreshold.add("1", "days");
            }

            if (userInputTime.isAfter(momentStart) && userInputTime.isBefore(momentEndWithThreshold)) {
                const role = each.name;

                let carryOverRole = "";
                allAdmissionsDataShifts.map((fromAdmissionsDataEach, fromAdmissionsDataEachIndex) => {
                    if (role == fromAdmissionsDataEach.name) {
                        carryOverRole = fromAdmissionsDataEach;
                        return;
                    }
                });

                if (carryOverRole) {
                    customShifts.push({
                        ...carryOverRole,
                        admissionsId: admissionId + ""
                    });
                }
                else {
                    customShifts.push({
                        admissionsId: admissionId + "",
                        minutesWorkedFromStartTime: getMinutesWorkedFromStartTime(each),
                        numberOfHoursWorked: getNumberOfHoursWorked(each),
                        chronicLoadRatio: getChronicLoadRatio(each),
                        score: getCompositeScore(each),
                        numberOfAdmissions: each.numberOfAdmissions,
                        name: each.name,
                        displayName: each.name + " " + each.displayStartTimeToEndTime,
                        shiftTimePeriod: each.shiftTimePeriod,
                        roleStartTime: each.start,
                        timestamp: each.timestamp ? each.timestamp : ""
                    });
                }

                admissionId++;
            }
        });
        customObj["startTime"] = customTime;
        customObj["shifts"] = customShifts;

        setAdmissionsData(customObj);
        sortMain(customObj);

        return customObj;
    }

    const timesDropdown = () => {
        return (
            <select
                className="timesdropdown"
                onChange={e => {
                    const startTime = e.target.value;
                    let getObj = {};
                    switch (startTime) {
                        case "FOURPM":
                            getObj = getValuesFromExistingAdmissionsDate(moment("16:00", TIME_FORMAT).format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                        case "FIVEPM":
                            getObj = getValuesFromExistingAdmissionsDate(moment("17:00", TIME_FORMAT).format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                        case "SEVENPM":
                            getObj = getValuesFromExistingAdmissionsDate(moment("19:00", TIME_FORMAT).format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                        case "CUSTOM":
                            getObj = getValuesFromExistingAdmissionsDate(moment().format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                        default:
                            getObj = getValuesFromExistingAdmissionsDate(moment().format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                    }

                }
                }>
                {START_TIMES.map((startTime, startTimeIndex) => {
                    return (<option
                        value={`${startTime.value}`}>
                        {`${startTime.label}`}
                    </option>);
                })}
            </select>
        );
    }

    const sortByAscendingName = (admissionsDatax) => {
        const returnObjShifts = admissionsDatax.shifts.sort((a, b) => {
            return ROLE_ORDER.indexOf(a.name) - ROLE_ORDER.indexOf(b.name);
        });

        let returnObj = {};
        returnObj.startTime = admissionsDatax.startTime;
        returnObj.shifts = returnObjShifts;

        setAdmissionsData(returnObj);
        handleSetAllAdmissionsDataShifts(returnObj);
    }

    const setSortRoles = (admissionsDatax) => {
        const sortRoles = [];
        const sortRolesNameOnly = [];
        sortRoles.push("\n");

        let timeObjShifts = admissionsDatax.shifts;
        
        timeObjShifts.forEach((each, eachIndex) => {
            if (each.numberOfHoursWorked + "" !== "0") {
                sortRoles.push(`${each.name} ${each.numberOfAdmissions} / ${each.numberOfHoursWorked} ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"}`);
            }
            sortRolesNameOnly.push(each.name);

        });

        sortRoles.push("\n");
        sortRoles.push(sortRolesNameOnly.length > 0 ? `\nOrder ${moment(admissionsDatax.startTime, TIME_FORMAT).format(TIME_FORMAT)}` : "");
        sortRoles.push(`${sortRolesNameOnly.join(">")}`);

        setSorted(sortRoles);

        return timeObjShifts;
    }

    const handleSort = (key) => {

        sortConfig[key] = !sortConfig[key];

        setSortConfig(sortConfig);

        const updatedShifts = admissionsData && admissionsData.shifts.sort((a, b) => {
            if (DATA_TYPE_TIME.includes(key)) {
                if (moment(a[key], TIME_FORMAT).isBefore(moment(b[key], TIME_FORMAT))) {
                    return sortConfig[key] ? -1 : 1;
                } else {
                    return sortConfig[key] ? 1 : -1;
                }
            } else if (DATA_TYPE_INT.includes(key)) {
                if (Number(a[key]) < Number(b[key])) {
                    return sortConfig[key] ? -1 : 1;
                } else {
                    return sortConfig[key] ? 1 : -1;
                }
            } else {
                if (a[key] < b[key]) {
                    return sortConfig[key] ? -1 : 1;
                } else {
                    return sortConfig[key] ? 1 : -1;
                }
            }

        });
        let returnObj = {};
        returnObj.startTime = admissionsData.startTime;
        returnObj.shifts = updatedShifts;

        setAdmissionsData(returnObj);
        handleSetAllAdmissionsDataShifts(returnObj);
    };

    const handleCustomTime = (target) => {
        getValuesFromExistingAdmissionsDate(target);
    }

    const sendEmail = (e, copiedContent, title) => {
        e.preventDefault();

        emailjs.send(CONFIG.REACT_APP_EMAILJS_SERVICE_ID, CONFIG.REACT_APP_EMAILJS_TEMPLATE_ID, { message: copiedContent, title: title }, CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY).then(
            (response) => {
                console.log("SUCCESS!", response.status, response.text);
            },
            (error) => {
                console.log("FAILED...", error);
            },
        );

    };

    const handleKeyDown = (e, rowIndex) => {
        const data = admissionsData.shifts;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (rowIndex < data.length - 1) {
                const getInputById = document.getElementById(`${e.target.name}_${rowIndex + 1}`);

                if (getInputById) {
                    getInputById.focus();
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); // Prevent the default action (scrolling)
            // Move to the previous row
            if (rowIndex > 0) {
                const getInputById = document.getElementById(`${e.target.name}_${rowIndex - 1}`);

                if (getInputById) {
                    getInputById.focus();
                }
            }
        } else if (e.target.name == "numberOfAdmissions" && e.key === "ArrowRight") {

            const getElementById = document.getElementById(`timestamp_${rowIndex}`);
            if (getElementById) {
                getElementById.focus();
            }
        } else if (e.target.name == "timestamp" && e.key === "ArrowLeft") {

            const getElementById = document.getElementById(`numberOfAdmissions_${rowIndex}`);
            if (getElementById) {
                getElementById.focus();
            }
        }
    };
    return (
        <div>
            <div className="header">
                <h1 className="title">S.A.D. Queue</h1>
                <h2 className="subtitle">Standardized Admissions Distribution</h2>
            </div>
            <div className="container">
                {timesDropdown()}
                {!STATIC_TIMES.includes(admissionsData.startTime) && <input
                    className="customtime"
                    name="customTime"
                    type="time"
                    onChange={(e) => {
                        handleCustomTime(e.target.value);
                    }}
                    placeholder="Enter time"
                    defaultValue={moment().format("HH:mm")}
                />}
                <table>
                    <thead>
                        {openTable ? <tr>
                            {
                                EXPAND_TABLE.map((each, eachIndex) => {
                                    return (
                                        <th onClick={() => handleSort(each[0])}>
                                            {each[1]} {sortConfig[each.name] ? (sortConfig[each.name] ? "↑" : "↓") : "↑"}
                                        </th>
                                    );
                                })
                            }
                        </tr> :
                            <tr>
                                {
                                    MINIMIZE_TABLE.map((each, eachIndex) => {
                                        return (
                                            <th onClick={() => {
                                                handleSort(each[0]);
                                            }}>
                                                {each[1]} {sortConfig[each.name] ? (sortConfig[each.name] ? "↑" : "↓") : "↑"}
                                            </th>
                                        );
                                    })
                                }
                            </tr>}
                    </thead>
                    <tbody>
                        {admissionsData.shifts.map((admission, index) => (
                            !admission.isStatic &&
                            <tr
                                style={DONT_SHOW_ROWS1[admission.startTime] && DONT_SHOW_ROWS1[admission.startTime].includes(admission.name) ? { display: "none"} : { }}
                                className={"admissionsDataRow_" + index}
                                key={admission.admissionsId}

                            >
                                <td>
                                    <input
                                        name="name"
                                        value={admission.name}
                                        type="text"
                                        disabled={true}
                                    />
                                </td>
                                {openTable && <td>
                                    <input
                                        name="shiftTimePeriod"
                                        value={admission.shiftTimePeriod}
                                        type="text"
                                        disabled={true}
                                    />
                                </td>}
                                <td className="usercanedit"

                                    tabIndex={-1}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                >
                                    <input
                                        id={`numberOfAdmissions_${index}`}
                                        name="numberOfAdmissions"
                                        value={admission.numberOfAdmissions}
                                        step="1"
                                        type="text"
                                        placeholder="---"
                                        onChange={(e) => onChange(e, admission.admissionsId)}
                                        disabled={admission.isStatic}
                                    />
                                </td>
                                <td className="usercanedit"
                                    tabIndex={-1}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                >
                                    <input
                                        id={`timestamp_${index}`}
                                        name="timestamp"
                                        value={admission.timestamp}
                                        type="time"
                                        onChange={(e) => onChange(e, admission.admissionsId)}
                                        disabled={admission.isStatic}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="chronicLoadRatio"
                                        type="text"
                                        value={admission.chronicLoadRatio}
                                        disabled={true}
                                    />
                                </td>
                                {openTable && <td>
                                    <input
                                        name="numberHoursWorked"
                                        value={admission.numberOfHoursWorked}
                                        type="number"
                                        placeholder="Enter number"
                                        disabled={true}
                                    />
                                </td>}
                                {openTable && <td>
                                    <input
                                        name="score"
                                        type="text"
                                        value={admission.score}
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

                    }}>
                        Generate Queue
                    </button>
                </section>

                <fieldset className="fieldsettocopy">
                    {admissionsData.shifts && admissionsData.shifts.length > 0 &&
                        (
                            <div>
                                <img
                                    alt="copy button"
                                    className="copybutton"
                                    src={copybuttonImg}
                                    onClick={(ev) => {
                                        let copiedMessage = "";
                                        sorted.map((each, eachIndex) => {
                                            if (each == "\n") {
                                            } else if (eachIndex == sorted.length - 1) {
                                                copiedMessage += each;
                                            } else {
                                                copiedMessage += each + "\n";
                                            }
                                        });


                                        const title = `Admissions Update`; // ${forWhatTime}

                                        navigator.clipboard.writeText(`${copiedMessage}`);
                                        // sendEmail(ev, copiedMessage, title);
                                        setIsCopied(true);
                                        setTimeout(() => setIsCopied(false), 1000);

                                    }} />
                                <span className={`copied-message ${isCopied ? 'visible' : ''}`}>Copied!</span>

                            </div>)
                    }
                    <p className="boldCopy">
                        <br />
                        {admissionsData.startTime ? `Admissions Update` : `Select a time. No roles in the queue.`}
                        {/* ${moment(admissionsData.startTime, TIME_FORMAT).format(TIME_FORMAT)} */}
                    </p>
                    {
                        sorted && sorted.map((each, eachIndex) => {
                            if (each == "\n") {
                                return <br></br>
                            } else if (eachIndex == sorted.length - 1) {
                                return <div className="sortedWithButton">
                                    <p>{each}
                                        {admissionsData.shifts && admissionsData.shifts.length > 0 && <img
                                            alt="copy button"
                                            className="copybuttonjust1line"
                                            src={copybuttonImg}
                                            onClick={(ev) => {

                                                navigator.clipboard.writeText(sorted[sorted.length - 1]);
                                                // sendEmail(ev, copiedMessage, title);

                                            }} />}
                                    </p>

                                </div>

                            } else {
                                return <p className="sorted">{each}</p>
                            }
                        })
                    }

                </fieldset>
                <p className="admissionsorderlastline">{ADMISSIONS_FORMAT}</p>

                <button className="seedetails" onClick={() => {
                    setSeeDetails(!seeDetails);
                }
                }>{seeDetails ? "Hide Explanation" : "Show Explanation"}</button>

                {seeDetails && <fieldset className="notes">
                    <p className="bold">Explanation</p>

                    {explanation && explanation.map((line, lineIndex) => {
                        if (line == "\n") {
                            return <br></br>
                        } else {
                            return <p>{line}</p>
                        }
                    })}
                    {/* Set Weight <input
                    className="weight"
                    name="weight"
                    type="number"
                    step=".1"
                    value={weight}
                    onChange={(ev) => {
                        setWeight(ev.target.value);
                    }}
                    placeholder={"Set weight"}
                /> */}
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