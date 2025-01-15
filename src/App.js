import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
    SHIFT_TYPES,
    START_TIMES,
    SCORE_NEW_ROLE,
    DATA_TYPE_INT,
    DATA_TYPE_TIME,
    CHRONIC_LOAD_RATIO_THRESHOLD,
    ADMISSIONS_FORMAT,
    TIME_FORMAT,
    MINIMIZE_TABLE,
    EXPAND_TABLE,
    ROLE_ORDER,
    SHOW_ROWS_TABLE,
    SHOW_ROWS_COPY,
    CHRONIC_LOAD_RATIO_THRESHOLD_S4,
    CHRONIC_LOAD_RATIO_THRESHOLD_N1_N2_N3_N4,
    NUMBER_OF_ADMISSIONS_CAP
} from "./constants";
import copybuttonImg from "./images/copy.png";
import snapshotImg from "./images/snapshot.png";
import githublogo from "./images/github-mark.png"
import emailjs from "@emailjs/browser";
import CONFIG1 from "./config";
import CopyMessages from "./CopyMessages";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import { addTransaction, deleteAllTransactions, getMostRecentTransaction, getLast10Transactions } from "./transactionsApi";
import html2canvas from "html2canvas";

// import Last10Transactions from "./Last10Transactions";

const CONFIG = CONFIG1;

export function App() {
    const [allAdmissionsDataShifts, setAllAdmissionsDataShifts] = useState({ startTime: "16:00", shifts: SHIFT_TYPES })

    const [sorted, setSorted] = useState("");
    const [seeDetails, setSeeDetails] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [openTable, setOpenTable] = useState(false);
    const [weight, setWeight] = useState(0.3);
    const [isCopied, setIsCopied] = useState(false);
    const [isCleared, setIsCleared] = useState(false);
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
    // const [dropdown, setDropdown] = useState(localStorage.getItem("dropdown") ? localStorage.getItem("dropdown") : "16:00");
    const [dropdown, setDropdown] = useState("16:00");
    const [admissionsOutput, setAdmissionsOutput] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [lastSaved, setLastSaved] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        emailjs.init(CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY);
        const fetchTransactions = async () => {
            const data = await getLast10Transactions();
            setTransactions(data);
        };
        let localDateTime = "";
        const fetchRecentTransaction = async () => {
            const result = await getMostRecentTransaction();

            if (result.success) {
                // console.log("most recent transaction saved: ", new Date(result.transaction.timestamp), result.transaction);
                const timestamp = new Date(result.transaction.timestamp);
                const month = String(timestamp.getMonth() + 1); // Months are zero-based
                const day = String(timestamp.getDate());
                const year = timestamp.getFullYear() % 100;
                let hours = timestamp.getHours();
                const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

                localDateTime = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;

                setLastSaved(localDateTime);
                if (result.transaction.admissionsObj.allAdmissionsDataShifts && result.transaction.admissionsObj.allAdmissionsDataShifts.shifts) {
                    setAllAdmissionsDataShifts(result.transaction.admissionsObj.allAdmissionsDataShifts);
                }
                setDropdown(result.transaction.admissionsObj.startTime);
            } else {
                //   setError(result.message || "Failed to fetch the most recent transaction.");
            }
            setLoading(false);
            // fetchTransactions();
            sortMain(result.transaction ? result.transaction.admissionsObj.allAdmissionsDataShifts : allAdmissionsDataShifts, localDateTime);
        };
        fetchRecentTransaction();

    }, [])

    const sortMain = (timeObj, lastSavedTime = "") => {
        return sortByTimestampAndCompositeScore(timeObj, lastSavedTime);
    }

    const sortByTimestampAndCompositeScore = (timeObj, lastSavedTime = "") => {
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
        //if same chronic load ratio, then pick the one with lower number of admissions to go first
        timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[timeObj.startTime].includes(each.name)) {
                explanationArr.push(`${each.name} | ${each.numberOfAdmissions}/${each.numberOfHoursWorked}=${each.chronicLoadRatio} | ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"}`)
            }
        });

        /*
        Step 2: For each admitter, if chronic load ratio is >0.66, then deprioritize in the order 
        (either putting in back or pushing back by X spots depending on how great the ratio is)
        */
        const shiftsLessThanThreshold = [];
        const shiftsGreaterThanThreshold = [];
        explanationArr.push("\n");
        explanationArr.push(`Step 2: Determine the admitters with high chronic load.`);

        timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[timeObj.startTime].includes(each.name)) {
                if ((timeObj.startTime == "17:00" && each.name === "S4" && each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD_S4) ||
                    (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD)) {
                    explanationArr.push(`${each.name} [${each.numberOfAdmissions}/${each.numberOfHoursWorked}=${each.chronicLoadRatio}] ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"}`);
                    shiftsGreaterThanThreshold.push(each);
                } else {
                    shiftsLessThanThreshold.push(each);
                }
            }
        });

        // /*
        // Step 2a: If chronic load ratio is the same, the higher number of admissions will go first
        // */
        // explanationArr.push("\n");
        // explanationArr.push(`Step 2a: If chronic load ratio is the same, the higher number of admissions will go first.`);
        // shiftsGreaterThanThreshold.sort((a, b) => {
        //     if (a.chronicLoadRatio === b.chronicLoadRatio) {
        //         explanationArr.push(`${a.name} and ${b.name} have the same chronic load ratio.`);
        //         return b.numberOfAdmissions - a.numberOfAdmissions; // higher admissions go first
        //     }
        // });

        // /*
        // Step 2b: If timestamp is the same, the lesser number of admissions will go first
        // */
        // explanationArr.push("\n");
        // explanationArr.push(`Step 2b: If the number of admissions is the same, the higher number of admissions will go first.`);
        // shiftsGreaterThanThreshold.sort((a, b) => {
        //     if (a.timestamp === b.timestamp) {
        //         explanationArr.push(`${a.name} and ${b.name} have the same number of admissions.`);
        //         return b.numberOfAdmissions - a.numberOfAdmissions;
        //     }
        // });

        explanationArr.push("\n");
        explanationArr.push(`Step 3: De-prioritize admitters with high chronic load to the back of the queue.`)
        const shiftsCombined = shiftsLessThanThreshold.concat(shiftsGreaterThanThreshold);

        shiftsCombined.forEach((each, eachIndex) => {
            explanationArr.push(`${each.name} [${each.numberOfAdmissions}/${each.numberOfHoursWorked}=${each.chronicLoadRatio}] ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"}`)
        });

        explanationArr.push("\n");
        explanationArr.push(`Step 4: Roles with number of admissions greater than ${NUMBER_OF_ADMISSIONS_CAP} are removed from the order of admissions.`)
        shiftsCombined.forEach((each, eachIndex) => {
            if (each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_CAP){
                explanationArr.push(`${each.name} [${each.numberOfAdmissions}/${each.numberOfHoursWorked}=${each.chronicLoadRatio}] ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} (DONE)`)
            }
        });

        explanationArr.push("\n");
        explanationArr.push("Notes: Chronic Load Ratio: Number of Admissions / Numbers of hours worked");

        timeObj.shifts = shiftsCombined;

        setExplanation(explanationArr);

        setSortRoles(timeObj, lastSavedTime);

        handleSetAllAdmissionsDataShifts(timeObj);
        sortByAscendingName(timeObj);
    }

    const setInitialForDropdown = (timeObj) => {
        setSortRoles(timeObj);
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
        setAllAdmissionsDataShifts({ startTime: obj.startTime, shifts: newObj });
        // localStorage.setItem("allAdmissionsDataShifts", JSON.stringify({ startTime: obj.startTime, shifts: newObj }));
    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const newObj = {};

        const updatedShifts = allAdmissionsDataShifts && allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        updatedShifts.map((each, eachIndex) => {
            each["startTime"] = allAdmissionsDataShifts.startTime;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
            return each;
        });

        newObj["startTime"] = allAdmissionsDataShifts.startTime;
        newObj["shifts"] = updatedShifts ? updatedShifts : [];

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
        let admissionId = 1;
        let userInputTime = moment(customTime, TIME_FORMAT);
        if (userInputTime.isBefore(moment("07:00", TIME_FORMAT))) {
            userInputTime = moment(customTime, TIME_FORMAT).add(1, "days");
        }

        SHIFT_TYPES.forEach((each, eachIndex) => {

            const role = each.name;

            let carryOverRole = "";
            allAdmissionsDataShifts.shifts.map((fromAdmissionsDataEach, fromAdmissionsDataEachIndex) => {
                if (role == fromAdmissionsDataEach.name) {
                    carryOverRole = fromAdmissionsDataEach;
                    if ((customTime == "17:00" && role == "N5") ||
                        (customTime == "19:00" && (role == "N1" || role == "N2" || role == "N3" || role == "N4"))) {
                        carryOverRole.timestamp = fromAdmissionsDataEach.startWithThreshold;
                        carryOverRole.numberOfAdmissions = "0";
                        carryOverRole.chronicLoadRatio = getChronicLoadRatio(fromAdmissionsDataEach);
                    }
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
        });
        customObj["startTime"] = customTime;
        customObj["shifts"] = customShifts;

        sortMain(customObj);

        return customObj;
    }

    const timesDropdown = () => {
        return (
            <select
                value={dropdown}
                name="timesdropdown"
                className="timesdropdown"
                id="timesdropdown"
                onChange={e => {
                    const startTime = e.target.value;
                    setDropdown(startTime);
                    localStorage.setItem("dropdown", startTime);

                    let getObj = {};
                    switch (startTime) {
                        case "16:00":
                            getObj = getValuesFromExistingAdmissionsDate(moment("16:00", TIME_FORMAT).format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                        case "17:00":
                            getObj = getValuesFromExistingAdmissionsDate(moment("17:00", TIME_FORMAT).format("HH:mm"));
                            setInitialForDropdown(getObj);
                            break;
                        case "19:00":
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

        handleSetAllAdmissionsDataShifts(returnObj);
    }

    const takeScreenshot = () => {
        document.getElementById("snapshot-button").addEventListener("click", async () => {
            const fieldset = document.getElementById("fieldsettocopy_min");
            
            try {
              // Convert the fieldset into a canvas
              const canvas = await html2canvas(fieldset);
              
              // Convert the canvas to a data URL (base64 image)
              const dataUrl = canvas.toDataURL("image/png");
          
              // Copy the image to the clipboard (modern browsers only)
              const response = await fetch(dataUrl);
              const blob = await response.blob();

              if (navigator.clipboard && navigator.clipboard.write) {
                // Clipboard functionality available
                await navigator.clipboard.write([
                  new ClipboardItem({ "image/png": blob }),
                ]);
                alert("Snapshot copied to clipboard!");
              } else {
                // Fallback to download
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "snapshot.png";
                link.click();
                alert("Snapshot downloaded.");
              }
          
            } catch (error) {
              console.error("Failed to take snapshot:", error);
              alert("Could not copy the snapshot. Please check your browser compatibility.");
            }
          });
    }

    const setSortRoles = (admissionsDatax, lastSavedTime = "") => {
        const sortRoles = [];
        const sortRolesNameOnly = [];
        sortRoles.push("\n");

        let timeObjShifts = admissionsDatax.shifts;

        timeObjShifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[each.startTime].includes(each.name)) {
                if (each.numberOfHoursWorked + "" !== "0") {
                    if (each.numberOfAdmissions >= NUMBER_OF_ADMISSIONS_CAP){
                        sortRoles.push(`${each.name} [${each.numberOfAdmissions}/${each.numberOfHoursWorked}=${each.chronicLoadRatio}] ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} (DONE)`);
                    } else{
                        sortRoles.push(`${each.name} [${each.numberOfAdmissions}/${each.numberOfHoursWorked}=${each.chronicLoadRatio}] ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} (DONE)`);
                    }
                }
                if (each.numberOfAdmissions < NUMBER_OF_ADMISSIONS_CAP){
                    if (window.location.hostname === 'localhost') {
                        sortRolesNameOnly.push(`${each.name}(${each.chronicLoadRatio})`);
                    } else {
                        sortRolesNameOnly.push(each.name);
                    }
                }
            }
        });

        sortRoles.push("\n");

        sortRoles.push(sortRolesNameOnly.length > 0 ? `\nOrder ${lastSaved ? lastSaved.split(" ") && lastSaved.split(" ").length > 0 && lastSaved.split(" ")[0] : lastSavedTime.split(" ") && lastSavedTime.split(" ").length > 0 && lastSavedTime.split(" ")[0]} ${moment(admissionsDatax.startTime, TIME_FORMAT).format(TIME_FORMAT)}` : "");
        sortRoles.push(`${sortRolesNameOnly.join(">")}`);

        setAdmissionsOutput(sortRolesNameOnly.join(">"));

        // sortRoles.push("\n");
        // sortRoles.push(`Generated by sadqueue.github.io/sad`);
        setSorted(sortRoles);

        return timeObjShifts;
    }

    const handleSort = (key) => {

        sortConfig[key] = !sortConfig[key];

        setSortConfig(sortConfig);

        const updatedShifts = allAdmissionsDataShifts && allAdmissionsDataShifts.shifts.sort((a, b) => {
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
        returnObj.startTime = allAdmissionsDataShifts.startTime;
        returnObj.shifts = updatedShifts;

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
        const data = allAdmissionsDataShifts.shifts;
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
            {loading ? <div className="container">Loading...</div> :
                <div className="container">
                    <div className="flex-container-just1item">
                        {timesDropdown()}
                    </div>
                    <div className="flex-container">
                        <span className="left-text backgroundcoloryellow">
                            {"Last Saved: " + lastSaved}
                        </span>
                        <span className="right-text">
                            <button className="clearall" onClick={() => {
                                allAdmissionsDataShifts.shifts.map((each, eachIndex) => {
                                    each.timestamp = "";
                                    each.numberOfAdmissions = "";
                                    each.chronicLoadRatio = "";
                                })
                                setAllAdmissionsDataShifts(allAdmissionsDataShifts);

                                setIsCleared(true);
                                setTimeout(() => setIsCleared(false), 1000);
                            }}>{"Clear All"}</button>

                        </span>

                        <span className={`cleared-message ${isCleared ? 'visible' : ''}`}>Cleared!</span>

                    </div>
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
                            {allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.length > 0 && allAdmissionsDataShifts.shifts.map((admission, indexx) => {
                                let index = 0;
                                if (SHOW_ROWS_TABLE[admission.startTime] && SHOW_ROWS_TABLE[admission.startTime].includes(admission.name)) {
                                    index = Number(admission.admissionsId);
                                    return (
                                        !admission.isStatic &&
                                        <tr
                                            style={SHOW_ROWS_TABLE[admission.startTime] && SHOW_ROWS_TABLE[admission.startTime].includes(admission.name) ? {} : { display: "none" }}
                                            className={"admissionsDataRow_" + index}
                                            key={admission.admissionsId}

                                        >
                                            <td>
                                                <input
                                                    name={`name_${index}`}
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
                                                    id={`timestamp_${index}`}
                                                    name="timestamp"
                                                    className="timestamp"
                                                    value={admission.timestamp}
                                                    type="time"
                                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                                    disabled={admission.isStatic}
                                                />
                                            </td>
                                            <td className="usercanedit"

                                                tabIndex={-1}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                            >
                                                <input
                                                    id={`numberOfAdmissions_${index}`}
                                                    name="numberOfAdmissions"
                                                    className="numberOfAdmissions"
                                                    value={admission.numberOfAdmissions}
                                                    step="1"
                                                    type="number"
                                                    placeholder="---"
                                                    onChange={(e) => onChange(e, admission.admissionsId)}
                                                    disabled={admission.isStatic}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    name={`chronicLoadRatio_${index}`}
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

                                        </tr>);
                                }

                            })}
                        </tbody>
                    </table>
                    <button className="seedetails" onClick={() => {
                        setOpenTable(!openTable);
                    }}>{openTable ? "Minimize Table" : "Expand Table"}</button>
                    <section style={{ textAlign: "center", margin: "30px" }}>
                        <button onClick={() => {
                            sortMain(allAdmissionsDataShifts);
                            addTransaction({ allAdmissionsDataShifts, admissionsOutput: admissionsOutput, startTime: allAdmissionsDataShifts.startTime });

                            // console.log(transactions);
                            const fetchRecentTransaction = async () => {
                                const result = await getMostRecentTransaction();

                                if (result.success) {
                                    // console.log("most recent transaction saved: ", new Date(result.transaction.timestamp), result.transaction);
                                    const timestamp = new Date(result.transaction.timestamp);
                                    const month = timestamp.getMonth() + 1; // Months are zero-based
                                    const day = timestamp.getDate();
                                    const year = timestamp.getFullYear() % 100;
                                    let hours = timestamp.getHours();
                                    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

                                    const localDateTime = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;

                                    setLastSaved(localDateTime);
                                    setAllAdmissionsDataShifts(result.transaction.admissionsObj.allAdmissionsDataShifts);
                                    setDropdown(result.transaction.admissionsObj.startTime);
                                } else {
                                    //   setError(result.message || "Failed to fetch the most recent transaction.");
                                }
                            };

                            fetchRecentTransaction();

                        }}>
                            Generate Queue
                        </button>
                    </section>
                    {/* <Last10Transactions /> */}
                    {/* {transactions.length === 0 ? (
                    <p>No transactions found.</p>
                ) : (
                    <ul>
                        {transactions.map((transaction) => {
                            console.log(transaction);
                            return (<li key={transaction.id}>
                                <strong> Time: </strong> {transaction.admissionsObj.startTime} | <strong>Order:</strong> {transaction.admissionsObj.admissionsOutput} | <strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}
                            </li>);
                        })}
                    </ul>
                )} */}

                    <fieldset className="fieldsettocopy" id="fieldsettocopy">
                       
                            {allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.length > 0 &&
                                (
                                    <div>
                                        <img
                                            alt="copy button"
                                            className="copybutton"
                                            id="snapshop-button"
                                            src={snapshotImg}
                                            onClick={(ev) => {
                                                /* let copiedMessage = "";
                                                sorted.map((each, eachIndex) => {
                                                    if (each == "\n") {
                                                    } else if (eachIndex == sorted.length - 1) {
                                                        copiedMessage += each;
                                                    } else {
                                                        copiedMessage += each + "\n";
                                                    }
                                                });

                                                navigator.clipboard.writeText(`${copiedMessage}`);
                                                // sendEmail(ev, copiedMessage, title);
                                                setIsCopied(true);
                                                setTimeout(() => setIsCopied(false), 1000); */
                                                takeScreenshot();

                                            }} />
                                           
                                        <span className={`copied-message ${isCopied ? 'visible' : ''}`}>Copied!</span>

                                    </div>)
                            }
                            <div id="fieldsettocopy_min">
                                <p className="boldCopy">
                                    <br />
                                    {allAdmissionsDataShifts.startTime ? `Admissions Update ${lastSaved}` : `Select a time. No roles in the queue.`}
                                    {/* ${moment(allAdmissionsDataShifts.startTime, TIME_FORMAT).format(TIME_FORMAT)} */}
                                </p>
                                {
                                sorted && sorted.map((each, eachIndex) => {
                                    if (each == "\n") {
                                        return <br></br>
                                    } else if (eachIndex == sorted.length - 1) {
                                        return <div className="sortedWithButton">
                                            <p id="endoutput">{each}
                                                {/*allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.length > 0 &&
                                                <img
                                                    alt="copy button"
                                                    className="copybuttonjust1line"
                                                    src={copybuttonImg}
                                                    onClick={(ev) => {

                                                        navigator.clipboard.writeText(sorted[sorted.length - 1]);
                                                        // sendEmail(ev, copiedMessage, title);
                                                        setIsCopied(true);
                                                        setTimeout(() => setIsCopied(false), 1000);

                                                    }} />*/}
                                            </p>

                                        </div>

                                    } else {
                                        return <p className="sorted">{each}</p>
                                    }
                                })
                            }</div>
                          

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
                    </fieldset>}

                    <CopyMessages />
                    
                    <div className="footer">
                        <img
                            alt="copy button"
                            className="githubbutton"
                            src={githublogo}
                            onClick={(ev) => {
                                window.open("https://github.com/sadqueue/sad/tree/main", '_blank');
                            }} />
                        <p>&copy; <span>{new Date().getFullYear()}</span> SAD Queue. All rights reserved.</p>
                    </div>
                </div>}
        </div>
    )

}

export default App;