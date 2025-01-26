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
import sadqueuelogo_bluebackgroundImg from "./images/sadqueuelogo_bluebackground.png";
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
    // deleteAllTransactions("17:00")
    // deleteAllTransactions("16:00")
    // deleteAllTransactions("19:00")
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
    const [array1, setArray1] =  useState("");
    const [array2, setArray2] =  useState("");
    useEffect(() => {
        emailjs.init(CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY);
        let localDateTime = "";

        const fetchRecentTransaction = async () => {
            function default5PMIfBetween7AMAnd6PM() {
                const now = new Date(); 
                const currentHour = now.getHours();
              
                return currentHour >= 7 && currentHour < 18;
              }
            const result = await getMostRecentTransaction(default5PMIfBetween7AMAnd6PM() ? "17:00" : "19:00");

            if (result.success) { 
                setLastSaved(result.transaction.localDateTime);
                if (result.transaction.admissionsObj.allAdmissionsDataShifts && result.transaction.admissionsObj.allAdmissionsDataShifts.shifts) {
                    setDropdown(result.transaction.admissionsObj.startTime);
                    sortMain(result.transaction.admissionsObj.allAdmissionsDataShifts, result.transaction.admissionsObj.startTime ? result.transaction.admissionsObj.startTime : "17:00", localDateTime);

                }

            } else {
                sortMain(allAdmissionsDataShifts, "17:00", localDateTime);
            }
            setLoading(false);
        };
        fetchRecentTransaction();

    }, [])

    const sortMain = (timeObj, dropdownSelected, lastSavedTime = "") => {
        const orderOfAdmissions = [];
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
        Step 1: Step 1: Sort based on timestamp. If timestamp is the same, sort by chronic load ratio
        */
        const newObject = JSON.parse(JSON.stringify(timeObj))
        if (newObject.shifts) {
            newObject.shifts.map((each, eachIndex) => {
                if (ROLES_WITH_DEFAULT_TIMES[dropdownSelected] && ROLES_WITH_DEFAULT_TIMES[dropdownSelected].includes(each.name)) {
                    each.timestamp = each.timestampDefault;
                }
                return each;
            });

            /* sort by timestamp. if timestamp is the same, sort by chronic load */
            newObject && newObject.shifts && newObject.shifts.sort((a, b) => {
                // Compare timestamps first
                if (a.timestamp < b.timestamp) return -1;
                if (a.timestamp > b.timestamp) return 1;
            
                // If timestamps are equal, compare chronicLoadRatio
                if (a.chronicLoadRatio < b.chronicLoadRatio) return -1;
                if (a.chronicLoadRatio > b.chronicLoadRatio) return 1;
            
                return 0; // If both are equal
            }); 
            //if same chronic load ratio, then pick the one with lower number of admissions to go first
            newObject.shifts && newObject.shifts.forEach((each, eachIndex) => {
                if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
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
                if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                    if ((dropdownSelected == "17:00" && each.name === "S4" && each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD_S4) ||
                        (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD)) {
                        explanationArr.push(getFormattedOutput(each));
                        shiftsGreaterThanThreshold.push(each);
                    } else {
                        shiftsLessThanThreshold.push(each);
                    }
                }

            });

            /* Step 3: De-prioritize admitters with high chronic load to the back of the queue */
            explanationArr.push("\n");
            explanationArr.push(`Step 3: De-prioritize admitters with high chronic load to the back of the queue.`)
            let shiftsCombined = shiftsLessThanThreshold.concat(shiftsGreaterThanThreshold);

            shiftsCombined.forEach((each, eachIndex) => {
                explanationArr.push(getFormattedOutput(each))
            });

            /* Step 4: Remove roles with number of admissions greater than 7 */
            explanationArr.push("\n");
            explanationArr.push(`Step 4: Roles with number of admissions greater than ${NUMBER_OF_ADMISSIONS_CAP} are removed from the order of admissions.`)
            shiftsCombined.forEach((each, eachIndex) => {
                if (each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_CAP) {
                    explanationArr.push(getFormattedOutput(each) + " (DONE)")
                }
            });

            /* Step 5: High chronic load scenarios */

            explanationArr.push("\n");
            let scenario1 = false;
            let scenario2 = false;
            let scenario3 = false
            if (timeObj.startTime == "19:00"){
                shiftsCombined.forEach((each, eachIndex) => {
                    /* Scenario 1: If S3 or S4 has number of admissions == 6 or N5 has number of admissions of 3+ */
                    if ((each.name == "S3" && Number(each.numberOfAdmissions) == 6) ||
                        (each.name == "S4" && Number(each.numberOfAdmissions) == 6) ||
                        (each.name == "N5" && Number(each.numberOfAdmissions) >= 3 && each.name == "N5" && Number(each.numberOfAdmissions) <= 6)){
                            scenario1 = true;
                            return;
                    } else if (each.name == "S4" && Number(each.numberOfAdmissions) == 5){
                        scenario1 = false;
                        scenario2 = true;
                        
                        return;
                    //If S3 has number of admissions of 5, then (N1-N4), N1>S3>N2>N3>N4 “Insert after N1 in Array2”
                    } 
                    /*else if (each.name == "S3" && Number(each.numberOfAdmissions) == 5){
                        explanationArr.push(`Step 5: If S3 has number of admissions of 5, then (N1-N4), N1>S3>N2>N3>N4`);
                        scenario3 = true;
                        return;
                    }*/
                });
            }
            if (scenario1) {
                explanationArr.push("Step 5: 7PM High Chronic Load Scenario. If S3 or S4 has number of admission of 6 or N5 has number of admissions of 3+, then repeat (N1-N4)x2 and then insert at the end.");

                /* Step 1: Remove from Array 1. This means that we have to copy Array 1 to Array 2.*/
                const array1 = [];
                const array2 = [];
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                    Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP){

                    } else {
                        array2.push(innerEach);
                    }
                });

                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                    (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                    (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3) ||
                    Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP){
                        explanationArr.push(getFormattedOutput(innerEach));
                    } else {
                        array1.push(innerEach);
                    }                        
                })

                /* Step 2: Create Array 2 but copying over from Array 1*/
                shiftsCombined = array1.concat(array2);
                
                setArray1(array1 && array1.map((each)=>{ return each.name }));
                setArray2(array2 && array2.map((each)=>{ return each.name }));
                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr;
            } else if (scenario2){
                explanationArr.push("Step 5: 7PM High Chronic Load Scenario. If S4 has number of admissions of 5, then N1-N4, N1>N2>S4>N3>N4");

                /* If S4 has number of admissions of 5, then remove S4 from Array 1. This means that we have to copy Array 1 to Array 2. */
                const array1 = [];
                
                let getS4 = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP){
                    } else if (innerEach.name == "S4"){
                        explanationArr.push(getFormattedOutput(innerEach))
                        getS4 = innerEach;
                    } else {
                        array1.push(innerEach);
                    }
                });
                const array2 = [...array1];
            
                const newElement = getS4; 

                let index = 0;
                for (let i=0; i<array2.length; i++){
                    if (array2[i].name == "N2"){
                        index = i;
                    }
                }

                if (index !== -1) {
                // Insert the new element after the found element
                    array2.splice(index + 1, 0, newElement);
                }

                // N5 is inserted after N4, if S4 qualifies then S4 inserted After N4, if S3 qualifies then S3 inserted after N4 

                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr
                setArray1(array1 && array1.map((each)=>{ return each.name }));
                setArray2(array2 && array2.map((each)=>{ return each.name }));
            } else if (scenario3){
                const array1 = [];
                let getS3 = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP){
                    } else if (innerEach.name == "S3"){
                        getS3 = innerEach;
                    } else {
                        array1.push(innerEach);
                    }
                });
                const array2 = [];
                const copyArray2 = [...array1];
                copyArray2.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                    Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP){
                    } else {
                        array2.push(innerEach);
                    }
                })

                const newElement = getS3; 

                let index = 0;
                for (let i=0; i<array2.length; i++){
                    if (array2[i].name == "N1"){
                        index = i;
                    }
                }

                if (index !== -1) {
                // Insert the new element after the found element
                    array2.splice(index + 1, 0, newElement);
                }
                setArray1(array1 && array1.map((each)=>{ return each.name }));
                setArray2(array2 && array2.map((each)=>{ return each.name }));
                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr;
            }

            // explanationArr.push("Notes: Chronic Load Ratio = Number of Admissions / Numbers of hours worked");

            // timeObj.shifts = shiftsCombined;

            // const orderOfAdmissions = [];
            shiftsCombined.map((each, eachIndex) => {
                if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                    if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                        orderOfAdmissions.push(each.name);
                    }
                }
            })

            setOrderOfAdmissions(orderOfAdmissions.join(">"));
            setExplanation(explanationArr);

            setSortRoles(timeObj, dropdownSelected, lastSavedTime);

            setAllAdmissionsDataShifts(timeObj);
            sortByAscendingName(timeObj);
        }
        return orderOfAdmissions.join(">");
    }
    const getFormattedOutput = (each) => {
        return `${each.name} [ ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} ] (${each.numberOfAdmissions ? each.numberOfAdmissions : " "}/${each.numberOfHoursWorked})=${each.chronicLoadRatio}`;
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
        setAllAdmissionsDataShifts(newObj);
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

        sortMain(customObj, customTime);

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

                    if (startTime == "19:00"){

                        const getMostRecentTransactionx = async (startTime) => {
                            const res = await getMostRecentTransaction(startTime);

                            if (res && res.transaction){
                                let getN5 = {};

                                res.transaction.admissionsObj.allAdmissionsDataShifts.shifts.forEach((each, eachIndex) => {
                                    if (each.name == "N5"){
                                        getN5 = each;
                                        return;
                                    }
                                })

                                const newObj = {};
                                
                                const shifts = [];

                                allAdmissionsDataShifts.shifts.forEach((each, eachIndex) => {
                                    if (each.name == "N5"){
                                        each = getN5;
                                    }
                                    shifts.push(each);
                                })
                                newObj["startTime"] = "19:00";
                                newObj["shifts"] = shifts;
                                setDropdown("19:00");
                                // setAllAdmissionsDataShifts(newObj);
                                sortMain(newObj, "19:00")
                                // setLastSaved("")

                            }
                        }
                        getMostRecentTransactionx("19:00");
  
                    } else {
                        setDropdown(startTime);
                        setLastSaved("")
                        setAllAdmissionsDataShifts({shifts: SHIFT_TYPES, dropdown: startTime});
                        const getMostRecentTransactionx = async (startTime) => {
                            const res = await getMostRecentTransaction(startTime);

                            if (res && res.transaction){
                                const order = res.transaction.order;
                                const allAdmissionsDataShifts = res.transaction.admissionsObj.allAdmissionsDataShifts;
                                const lastSavedTime = res.transaction.localDateTime;
                                if (allAdmissionsDataShifts){
                                    setAllAdmissionsDataShifts(allAdmissionsDataShifts);
                                }

                                if (order){
                                    setOrderOfAdmissions(order);
                                }

                                if (lastSavedTime){
                                    setLastSaved(lastSavedTime);
                                }
                                setSortRoles(allAdmissionsDataShifts, startTime, lastSavedTime);
                            }
                        }
                        getMostRecentTransactionx(startTime);
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

        setAllAdmissionsDataShifts(returnObj);
    }

    const isMobileDevice = () => {
        if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) {
            // console.log("User is on a phone or tablet.");
            return true;
        } else {
            // console.log("User is on a desktop.");
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

    const setSortRoles = (admissionsDatax, dropdownSelected, lastSavedTime = "") => {
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
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                // if (admissionsDatax.startTime == "19:00" && each.name == "S4" && each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_S4_CAP){
                //     sevenPmS4greaterThanCap = true;
                // }
                if (each.numberOfHoursWorked + "" !== "0") {
                    if (Number(each.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                        sortRoles.push(getFormattedOutput(each) + " (DONE)");
                    } else {
                        sortRoles.push(getFormattedOutput(each));
                    }
                }
                if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                    if (window.location.hostname === 'localhost') {
                        sortRolesNameOnly.push(`${each.name}(${each.chronicLoadRatio})`);
                    } else {
                        sortRolesNameOnly.push(each.name);
                    }
                }
            }
        });
        sortRoles.push("\n");

        sortRoles.push(`${sortRolesNameOnly.join(">")}`);
        // console.log("sort roles", sorted);
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

        setAllAdmissionsDataShifts(returnObj);
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

    const handleGenerateQueue = () => {
        const orderOfAdmissions_ = sortMain(allAdmissionsDataShifts, dropdown);

        addTransaction(
            { allAdmissionsDataShifts, admissionsOutput: admissionsOutput, startTime: dropdown }, 
            orderOfAdmissions_
            // sorted
        );

        const fetchRecentTransaction = async () => {
            const result = await getMostRecentTransaction(allAdmissionsDataShifts.startTime);

            if (result.success) {
                setLastSaved(result.transaction.localDateTime);
                setAllAdmissionsDataShifts(allAdmissionsDataShifts);
                setDropdown(dropdown);
            } else {
                //   setError(result.message || "Failed to fetch the most recent transaction.");
            }
        };
        fetchRecentTransaction();
        // setAllAdmissionsDataShifts(allAdmissionsDataShifts);
        // setDropdown(dropdown);
    }
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

    function hasTwoOccurrences(str, target) {
        // Split the string by the target substring and check if there are more than 2 parts
        const parts = str.split(target);
        return parts.length > 2;
      }
      
    return (
        <div>
            <div className="header">
            {/* <img
            alt="clock"
            className="clock"
            id="clock-button"
            src={sadqueuelogo_bluebackgroundImg}/> */}
                <h1 className="title">S.A.D.Q.</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
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
                                                        value={admission.name ? admission.name : ""}
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
                                                        value={admission.timestamp ? admission.timestamp : ""}
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
                                                        value={admission.numberOfAdmissions ? admission.numberOfAdmissions : ""}
                                                        step="1"
                                                        type="number"
                                                        placeholder="---"
                                                        onChange={(e) => onChange(e, admission.admissionsId)}
                                                        disabled={admission.isStatic}
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                    />
                                                </td>
                                                <td className="backgroundlightgray">
                                                    <input
                                                        name={`chronicLoadRatio_${index}`}
                                                        type="text"
                                                        value={admission.chronicLoadRatio ? admission.chronicLoadRatio : ""}
                                                        disabled={true}
                                                    />
                                                </td>
                                                {openTable && <td>
                                                    <input
                                                        name="numberHoursWorked"
                                                        value={admission.numberOfHoursWorked ? admission.numberOfHoursWorked : ""}
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
                        {hasTwoOccurrences(orderOfAdmissions, "N1") ?
                            <div>
                                <p className="endoutputcenter" id="orderofadmissions_output">{array1 ? array1.join(">") + ">" : ""}<br></br>{array2 && array2.join(">")}</p>
                            </div>
                        : <p className="endoutputcenter" id="orderofadmissions_output">{orderOfAdmissions}</p>
                        }
                        {/* <p className="endoutputcenter" id="orderofadmissions_output">{orderOfAdmissions}</p> */}
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
                        <button id="generateQueue" onClick={() => {
                            handleGenerateQueue();
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
                                            // const divText = document.getElementById("fieldsettocopy_min").innerText; // Get the plain text of the div
                                            // const linkText = "sadqueue.github.io/sad"; // Get the link part

                                            // // Create the hyperlink HTML part for the link
                                            // const hyperlink = "https://" + linkText;

                                            // // Combine the text (keeping the link as a hyperlink)
                                            // const contentToCopy = divText.replace(linkText, hyperlink);

                                            // // Copy the combined content (HTML with the link as hyperlink)
                                            // navigator.clipboard.write([
                                            //     new ClipboardItem({
                                            //         "text/html": new Blob([contentToCopy], { type: "text/html" }), // Copy as HTML
                                            //         "text/plain": new Blob([divText.replace(linkText, `https://${linkText}`)], { type: "text/plain" }) // Copy as plain text (with link as URL)
                                            //     })
                                            // ])
                                            //     .then(() => {
                                            //         console.log("Link and text copied to clipboard!");
                                            //     })
                                            //     .catch((err) => {
                                            //         console.error("Failed to copy: ", err);
                                            //     });
                                            const contentToCopy = document.getElementById("fieldsettocopy_min") && document.getElementById("fieldsettocopy_min").innerText.replaceAll("\n\n","\n").replaceAll("\n\n","\n");

                                            navigator.clipboard.writeText(contentToCopy);


                                            // sendEmail(ev, copiedMessage, title);
                                            setIsCopied(true);
                                            setTimeout(() => setIsCopied(false), 1000);
                                        }} />

                                    <span className={`copied-message ${isCopied ? 'visible' : ''}`}>Copied!</span>

                                </div>)
                        }
                        <div id="fieldsettocopy_min">
                            <p className="boldCopy">
                                {dropdown ? `Order of Admits` : `Select a time. No roles in the queue.`}
                            </p>
                            <p>{`${lastSaved && lastSaved.split(" ")[0]} ${convertTo12HourFormatSimple(dropdown)}`}</p>
                            {/* <p id="endoutput">{orderOfAdmissions}</p> */}
                            {hasTwoOccurrences(orderOfAdmissions, "N1") ?
                                <div>
                                    <p className="endoutput" id="orderofadmissions_output">{array1 ? array1.join(">") + ">" : ""}<br></br>{array2 && array2.join(">")}</p>
                                </div>
                            : <p className="endoutput" id="orderofadmissions_output">{orderOfAdmissions}</p>
                            }<br></br>
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
                            <p>{"@ "}<a id="sadqueuelink" href="">{`sadqueue.github.io/sad`}</a></p>

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
                        <p>&copy; {new Date().getFullYear()} S.A.D. Queue. All rights reserved.</p>
                    </div>
                </div>}
        </div>
    )

}

export default App;