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
    NUMBER_OF_ADMISSIONS_CAP,
    NUMBER_OF_ADMISSIONS_S4_CAP,
    ROLES_WITH_DEFAULT_TIMES
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
    const [allAdmissionsDataShifts, setAllAdmissionsDataShifts] = useState({ startTime: "17:00", shifts: SHIFT_TYPES })

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
    const [dropdown, setDropdown] = useState("17:00");
    const [admissionsOutput, setAdmissionsOutput] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [lastSaved, setLastSaved] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderOfAdmissions, setOrderOfAdmissions] = useState("");
    useEffect(() => {
        // deleteAllTransactions();
        emailjs.init(CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY);
        // const fetchTransactions = async () => {
        //     const data = await getLast10Transactions();
        //     setTransactions(data);
        // };
        let localDateTime = "";
        const fetchRecentTransaction = async () => {
            const result = await getMostRecentTransaction(allAdmissionsDataShifts.startTime);

            if (result.success) {
                // console.log("most recent transaction saved: ", new Date(result.transaction.timestamp), result.transaction);
                const timestamp = new Date(result.transaction.timestamp);
                const month = String(timestamp.getMonth() + 1); // Months are zero-based
                const day = String(timestamp.getDate());
                const year = timestamp.getFullYear();
                let hours = timestamp.getHours();
                const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

                localDateTime = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;

                setLastSaved(localDateTime);
                if (result.transaction.admissionsObj.allAdmissionsDataShifts && result.transaction.admissionsObj.allAdmissionsDataShifts.shifts) {
                    setAllAdmissionsDataShifts(result.transaction.admissionsObj.allAdmissionsDataShifts);
                    setDropdown(result.transaction.admissionsObj.startTime);
                    sortMain(result.transaction.admissionsObj.allAdmissionsDataShifts, localDateTime);

                    let orderOfAdmissions = [];
                    result.transaction.admissionsObj.allAdmissionsDataShifts.shifts.map((each, eachIndex) => {
                        if (SHOW_ROWS_COPY[result.transaction.admissionsObj.startTime].includes(each.name)) {
                            if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                                orderOfAdmissions.push(each.name);
                            }
                        }
                    });
                    setOrderOfAdmissions(orderOfAdmissions.join(" > "));

                }



                // setLoading(false);

            } else {
                setAllAdmissionsDataShifts({ startTime: "17:00", shifts: SHIFT_TYPES });
                // setLoading(false);
                sortMain(allAdmissionsDataShifts, localDateTime);

                //   setError(result.message || "Failed to fetch the most recent transaction.");
            }
            setLoading(false);
            // fetchTransactions();
        };
        fetchRecentTransaction();

    }, [])

    const sortMain = (timeObj, lastSavedTime = "") => {
        return sortByTimestampAndCompositeScore(timeObj, lastSavedTime);
    }
    const getFormattedOutput = (each) => {
        return `${each.name} [ ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} ] (${each.numberOfAdmissions ? each.numberOfAdmissions : " "}/${each.numberOfHoursWorked})=${each.chronicLoadRatio}`;
    }
    const sortByTimestampAndCompositeScore = (timeObj, lastSavedTime = "") => {
        timeObj && timeObj.shifts && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            each["startTime"] = timeObj.startTime ? timeObj.startTime : "";
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
            each["numberOfAdmissions"] = each.numberOfAdmissions ? each.numberOfAdmissions : "";
            each["timestamp"] = each.timestamp ? each.timestamp : ""
            return each;
        });

        const explanationArr = [];
        explanationArr.push("\n");
        explanationArr.push("Step 1: Merge with nights based on last timestamp.");

        /*
        Step 1: Step 1: Sort based on timestamp 
        */
        const newObject = JSON.parse(JSON.stringify(timeObj))
        if (newObject.shifts) {
            newObject.shifts.map((each, eachIndex) => {
                if (ROLES_WITH_DEFAULT_TIMES[dropdown] && ROLES_WITH_DEFAULT_TIMES[dropdown].includes(each.name)) {
                    each.timestamp = each.timestampDefault;
                }
                return each;
            });

            newObject && newObject.shifts && newObject.shifts.sort(function (a, b) {
                return moment(a.timestamp, TIME_FORMAT).diff(moment(b.timestamp, TIME_FORMAT));
            });
            //if same chronic load ratio, then pick the one with lower number of admissions to go first
            newObject.shifts && newObject.shifts.forEach((each, eachIndex) => {
                if (SHOW_ROWS_COPY[dropdown].includes(each.name)) {
                    explanationArr.push(getFormattedOutput(each))
                }
            });
            /*
        Step 2: For each admitter, if chronic load ratio is >0.67, then deprioritize in the order 
        (either putting in back or pushing back by X spots depending on how great the ratio is)
        */
            const shiftsLessThanThreshold = [];
            const shiftsGreaterThanThreshold = [];
            explanationArr.push("\n");
            explanationArr.push(`Step 2: Determine the admitters with high chronic load.`);

            newObject.shifts && newObject.shifts.forEach((each, eachIndex) => {
                if (SHOW_ROWS_COPY[allAdmissionsDataShifts.startTime].includes(each.name)) {
                    if ((allAdmissionsDataShifts.startTime == "17:00" && each.name === "S4" && each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD_S4) ||
                        (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD)) {
                        explanationArr.push(getFormattedOutput(each));
                        shiftsGreaterThanThreshold.push(each);
                    } else {
                        shiftsLessThanThreshold.push(each);
                    }
                }

            });

            explanationArr.push("\n");
            explanationArr.push(`Step 3: De-prioritize admitters with high chronic load to the back of the queue.`)
            const shiftsCombined = shiftsLessThanThreshold.concat(shiftsGreaterThanThreshold);

            shiftsCombined.forEach((each, eachIndex) => {
                explanationArr.push(getFormattedOutput(each))
            });

            explanationArr.push("\n");
            explanationArr.push(`Step 4: Roles with number of admissions greater than ${NUMBER_OF_ADMISSIONS_CAP} are removed from the order of admissions.`)
            shiftsCombined.forEach((each, eachIndex) => {
                if (each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_CAP) {
                    explanationArr.push(getFormattedOutput(each) + " (DONE)")
                }
            });
            explanationArr.push("\n");
            explanationArr.push("Notes: Chronic Load Ratio: Number of Admissions / Numbers of hours worked");

            // timeObj.shifts = shiftsCombined;

            const orderOfAdmissions = [];
            shiftsCombined.map((each, eachIndex) => {
                if (SHOW_ROWS_COPY[dropdown].includes(each.name)) {
                    if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                        orderOfAdmissions.push(each.name);
                    }
                }
            })


            setOrderOfAdmissions(orderOfAdmissions.join(">"));
            setExplanation(explanationArr);

            setSortRoles(timeObj, lastSavedTime);

            handleSetAllAdmissionsDataShifts(timeObj);
            sortByAscendingName(timeObj);
        }


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
        setAllAdmissionsDataShifts(obj);
        // localStorage.setItem("allAdmissionsDataShifts", JSON.stringify({ startTime: obj.startTime, shifts: newObj }));
    }

    const convertTo12HourFormatSimple = (time24) => {
        const [hours] = time24 && time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:00${period}`;
    }

    const onChange = (e, admissionsId) => {
        const { name, value } = e.target

        const newObj = {};

        const updatedShifts = allAdmissionsDataShifts && allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.map((item) =>
            item.admissionsId === admissionsId && name ? { ...item, [name]: value } : item
        )

        updatedShifts.map((each, eachIndex) => {
            each["startTime"] = dropdown;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["score"] = getCompositeScore(each);
            return each;
        });

        newObj["startTime"] = dropdown;
        newObj["shifts"] = updatedShifts ? updatedShifts : [];
        // allAdmissionsDataShifts.startTime = dropdown;
        // allAdmissionsDataShifts.shifts = updatedShifts;
        handleSetAllAdmissionsDataShifts(newObj);
    }

    const getChronicLoadRatio = (admission) => {
        const timeDifference = admission.numberOfHoursWorked;
        const chronicLoadRatio = (Number(admission.numberOfAdmissions) / (Number(timeDifference))).toFixed(2);

        if (chronicLoadRatio == "NaN" || chronicLoadRatio == "Infinity") {
            return "0.00";
        } else {
            return chronicLoadRatio ? chronicLoadRatio : "";

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
        return timeDifference ? timeDifference : "";

    }

    const getMinutesWorkedFromStartTime = (admission) => {
        const now = getMomentTimeWithoutUndefined(admission.startTime);
        const timeDifference = moment(now, TIME_FORMAT).diff(moment(admission.timestamp, TIME_FORMAT), "minutes", true).toFixed();
        return timeDifference ? timeDifference : "";
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
                    // if ((customTime == "17:00" && role == "N5") ||
                    //     (customTime == "19:00" && (role == "N1" || role == "N2" || role == "N3" || role == "N4"))) {
                    //     carryOverRole.timestamp = fromAdmissionsDataEach.startWithThreshold;
                    //     carryOverRole.numberOfAdmissions = "0";
                    //     carryOverRole.chronicLoadRatio = getChronicLoadRatio(fromAdmissionsDataEach);
                    // }
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
                    const newObj = {};
                    const getMostRecentTransactionx = async (startTime) => {
                        const res = await getMostRecentTransaction(startTime);
                        newObj["startTime"] = startTime;
                        let whichShifts = res.transaction ? res.transaction.admissionsObj.allAdmissionsDataShifts.shifts : SHIFT_TYPES;
                        newObj["shifts"] = whichShifts;

                        setAllAdmissionsDataShifts(newObj);
                        setInitialForDropdown(newObj);

                        const orderOfAdmissions = [];
                        whichShifts.map((each, eachIndex) => {
                            if (SHOW_ROWS_COPY[startTime].includes(each.name)) {
                                if (dropdown == "19:00" && Number(each.numberOfAdmissions) >= NUMBER_OF_ADMISSIONS_CAP) {

                                } else {
                                    orderOfAdmissions.push(each.name);
                                }
                            }
                        })
                        setOrderOfAdmissions(orderOfAdmissions.join(">"));
                    }
                    getMostRecentTransactionx(startTime);

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

    const isMobileDevice = () => {
      if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) {
        console.log("User is on a phone or tablet.");
        return true;
      } else {
        console.log("User is on a desktop.");
        return false;
      }
    }

    const takeScreenshot = async () => {
        // const fieldset = document.getElementById("fieldsettocopy_min");
        const element = document.getElementById("screenshotimg");

        // Capture the div as a canvas
        const canvas = await html2canvas(element);

        // Convert the canvas to a Blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert('Failed to capture the screenshot.');
                return;
            }

            // Copy the Blob to the clipboard
            try {
                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([clipboardItem]);
                alert('Screenshot copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy the screenshot to the clipboard:', err);
                alert('Failed to copy the screenshot. Check your browser permissions.');
            }
        });

    }

    const setSortRoles = (admissionsDatax, lastSavedTime = "") => {
        const sortRoles = [];
        let sortRolesNameOnly = [];
        // sortRoles.push("\n");

        let timeObjShifts = admissionsDatax.shifts;

        //sort by name
        const customOrder = ["DA", "S1", "S2", "S3", "S4", "N5", "N1", "N2", "N3", "N4"];

        // Sort the data based on the custom order
        timeObjShifts && Array.isArray(timeObjShifts) && timeObjShifts.sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);

            // If the names are not in the custom order, move them to the end
            return (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity);
        });


        // let sevenPmS4greaterThanCap = false;
        timeObjShifts && Array.isArray(timeObjShifts) && timeObjShifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdown].includes(each.name)) {
                // if (admissionsDatax.startTime == "19:00" && each.name == "S4" && each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_S4_CAP){
                //     sevenPmS4greaterThanCap = true;
                // }
                if (each.numberOfHoursWorked + "" !== "0") {
                    if (each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_CAP) {
                        sortRoles.push(getFormattedOutput(each) + " (DONE)");
                    } else {
                        sortRoles.push(getFormattedOutput(each));
                    }
                }
                if (each.numberOfAdmissions <= NUMBER_OF_ADMISSIONS_CAP) {
                    if (window.location.hostname === 'localhost') {
                        sortRolesNameOnly.push(`${each.name}(${each.chronicLoadRatio})`);
                    } else {
                        sortRolesNameOnly.push(each.name);
                    }
                }
            }
        });

        /* If 7PM and S4 has 6 or more admissions, then concatenate N1-N4 to the beginning of the order of admissions */
        // if (sevenPmS4greaterThanCap){
        //     // for (let i=1; i<5; i++){
        //     //     sortRolesNameOnly.push(`N${i}`);
        //     // }
        //     sortRolesNameOnly = ["N1", "N2", "N3", "N4", ...sortRolesNameOnly];
        // }

        sortRoles.push("\n");

        sortRoles.push(`${sortRolesNameOnly.join(">")}`);
        // setOrderOfAdmissions(`${sortRolesNameOnly.join(">")}`);

        // setAdmissionsOutput(sortRolesNameOnly.join(">"));

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
        returnObj.startTime = dropdown;
        returnObj.shifts = updatedShifts;

        handleSetAllAdmissionsDataShifts(returnObj);
    };


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
        } else if (e.target.name == "numberOfAdmissions" && e.key === "ArrowLeft") {

            const getElementById = document.getElementById(`timestamp_${rowIndex}`);
            if (getElementById) {
                getElementById.focus();
            }
        } else if (e.target.name == "timestamp" && e.key === "ArrowRight") {

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
            {loading ? <div className="loading">Loading...</div> :
                <div className="container">
                    <div className="flex-container-just1item">
                        {timesDropdown()}
                    </div>
                    <div className="flex-container">
                        <span className={`cleared-message ${isCleared ? 'visible' : ''}`}>Cleared!</span>
                    </div>
                    {!isMobileDevice() && <img
                        alt="copy button"
                        className="copybutton"
                        id="snapshot-button"
                        src={snapshotImg}
                        onClick={(ev) => {
                            takeScreenshot();

                        }} />}
                    <div id="screenshotimg">
                        <table id="reacttable">
                            <thead>
                                {openTable ? <tr>
                                    {
                                        EXPAND_TABLE.map((each, eachIndex) => {
                                            return (
                                                /*<th onClick={() => handleSort(each[0])}>
                                                    {each[1]} {sortConfig[each.name] ? (sortConfig[each.name] ? "↑" : "↓") : "↑"}
                                                </th>*/
                                                <th>
                                                    {each[1]}
                                                </th>
                                            );
                                        })
                                    }
                                </tr> :
                                    <tr>
                                        {
                                            MINIMIZE_TABLE.map((each, eachIndex) => {
                                                return (
                                                    <th >
                                                        {each[1]}
                                                    </th>
                                                    /*<th onClick={() => {
                                                        handleSort(each[0]);
                                                    }}>
                                                        {each[1]} {sortConfig[each.name] ? (sortConfig[each.name] ? "↑" : "↓") : "↑"}
                                                    </th>*/
                                                );
                                            })
                                        }
                                    </tr>}
                            </thead>
                            <tbody>
                                {allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.length > 0 && allAdmissionsDataShifts.shifts.map((admission, indexx) => {
                                    let index = 0;
                                    if (SHOW_ROWS_TABLE[dropdown] && SHOW_ROWS_TABLE[dropdown].includes(admission.name)) {
                                        // index = Number(admission.admissionsId);
                                        index = SHOW_ROWS_TABLE[dropdown].findIndex((user) => {
                                            return user == admission.name
                                        });
                                        return (
                                            !admission.isStatic &&
                                            <tr
                                                style={SHOW_ROWS_TABLE[dropdown] && SHOW_ROWS_TABLE[dropdown].includes(admission.name) ? {} : { display: "none" }}
                                                id={"admissionsDataRow_" + index}
                                                className={"admissionsDataRow"}
                                                key={admission.admissionsId}

                                            >
                                                <td>
                                                    <input
                                                        name={`name_${index}`}
                                                        className="bold-fields"
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
                                                <td className="backgroundlightgray">
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
                                            </tr>);
                                    }

                                })}
                            </tbody>
                        </table>
                        {/* highlighted order of admissions below table */}
                        <p className="endoutputcenter" id="orderofadmissions_title">{`Order of Admits ${lastSaved.split(" ")[0] + " " + convertTo12HourFormatSimple(dropdown)}`}</p>
                        <p className="endoutputcenter" id="orderofadmissions_output">{orderOfAdmissions}</p>
                        <div className="flex-container">

                            <span className="left-text backgroundcoloryellow">
                                {"Last Saved: " + lastSaved}

                            </span>

                            <span className="right-text">
                                <button className="seedetails" onClick={() => {
                                    setOpenTable(!openTable);
                                }}>{openTable ? "Minimize Table" : "Expand Table"}</button>
                            </span>

                        </div>
                    </div>

                    <section>
                        <button onClick={() => {
                            sortMain(allAdmissionsDataShifts);

                            addTransaction({ allAdmissionsDataShifts, admissionsOutput: admissionsOutput, startTime: dropdown });

                            console.log(transactions);
                            const fetchRecentTransaction = async () => {
                                const result = await getMostRecentTransaction(allAdmissionsDataShifts.startTime);

                                if (result.success) {
                                    // console.log("most recent transaction saved: ", new Date(result.transaction.timestamp), result.transaction);
                                    const timestamp = new Date(result.transaction.timestamp);
                                    const month = timestamp.getMonth() + 1; // Months are zero-based
                                    const day = timestamp.getDate();
                                    const year = timestamp.getFullYear();
                                    let hours = timestamp.getHours();
                                    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

                                    const localDateTime = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;

                                    setLastSaved(localDateTime);
                                    setAllAdmissionsDataShifts(allAdmissionsDataShifts);
                                    setDropdown(dropdown);
                                } else {
                                    //   setError(result.message || "Failed to fetch the most recent transaction.");
                                }
                            };
                            fetchRecentTransaction();
                            setAllAdmissionsDataShifts(allAdmissionsDataShifts);
                            setDropdown(dropdown);
                        }}>
                            Generate Queue
                        </button>
                    </section>

                    <fieldset className="fieldsettocopy" id="fieldsettocopy">

                        {allAdmissionsDataShifts.shifts && allAdmissionsDataShifts.shifts.length > 0 &&
                            (
                                <div>

                                    <img
                                        alt="copy button"
                                        className="copybutton"
                                        src={copybuttonImg}
                                        onClick={(ev) => {
                                            let copiedMessage = document.getElementById("fieldsettocopy_min") && document.getElementById("fieldsettocopy_min").innerText.replaceAll("\n\n", "\n").replaceAll("\n\n", "\n");
                                            if (copiedMessage.charAt(0) == "\n") {
                                                copiedMessage = copiedMessage.substring(1);
                                            }
                                            navigator.clipboard.writeText(`${copiedMessage}`);
                                            // sendEmail(ev, copiedMessage, title);
                                            setIsCopied(true);
                                            setTimeout(() => setIsCopied(false), 1000);
                                        }} />

                                    <span className={`copied-message ${isCopied ? 'visible' : ''}`}>Copied!</span>

                                </div>)
                        }
                        <div id="fieldsettocopy_min">
                            <p className="boldCopy">
                                <br />
                                {dropdown ? `Order of Admits` : `Select a time. No roles in the queue.`}
                            </p>
                            <p>{`${lastSaved && lastSaved.split(" ")[0]} ${convertTo12HourFormatSimple(dropdown)}`}</p>
                            <p id="endoutput">{orderOfAdmissions}</p>
                            {
                                sorted && sorted.map((each, eachIndex) => {
                                    if (each == "\n") {
                                        return <br></br>
                                    }
                                    else if (eachIndex == sorted.length - 1) {
                                    }
                                    else {
                                        return <p className="sorted">{each}</p>
                                    }
                                })
                            }
                            
                            <p>{`Updated ${lastSaved}`}</p>
                            <p>{`@ sadqueue.github.io/sad`}</p>

                        </div>


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