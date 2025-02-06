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
    ROLES_WITH_DEFAULT_TIMES,
    CONSTANT_COMPOSITE_5PM,
    CONSTANT_COMPOSITE_7PM
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
// import CypressTestRunner from "./CypressTestRunner";

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
    const [array1, setArray1] = useState("");
    const [array2, setArray2] = useState("");
    const [inputManually, setInputManually] = useState("");
    const [clickedGenerateQueue, setClickedGenerateQueue] = useState(false);
    const [compositeScoreAlgorithm, setCompositeScoreAlgorithm] = useState(false);
    const [alr, setAlr] = useState(0.5);
    const [clr, setClr] = useState(0.5);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [alrWeight, setAlrWeight] = useState("");
    const [clrWeight, setClrWeight] = useState("");
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

    const sortMainOriginal = (timeObj, dropdownSelected, lastSavedTime = "") => {
        const orderOfAdmissions = [];
        timeObj && timeObj.shifts && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            each["startTime"] = timeObj.startTime ? timeObj.startTime : "";
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["numberOfAdmissions"] = each.numberOfAdmissions ? each.numberOfAdmissions : "";
            each["timestamp"] = each.timestamp ? each.timestamp : ""
            return each;
        });

        const explanationArr = [];
        explanationArr.push("Step 1: Rank Order Based on Acute Load (Time Since Last Admission). [ALR = 1 - (Current Time [17:00] - Last Admit Time)/180]");

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

                // If timestamps are equal, compare chronicLoadRatio
                if (a.numberOfAdmissions < b.numberOfAdmissions) return -1;
                if (a.numberOfAdmissions > b.numberOfAdmissions) return 1;

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
            explanationArr.push(`Step 2: De-prioritize Admitters with High Chronic Load (Admits/Hours Worked)`);

            newObject.shifts && newObject.shifts.forEach((each, eachIndex) => {
                if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                    if ((dropdownSelected == "17:00" && each.name === "S4" && each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD_S4) ||
                        (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD)) {
                        // explanationArr.push(getFormattedOutput(each));
                        explanationArr.push(`${each.name}: (${each.numberOfAdmissions ? each.numberOfAdmissions : " "}/${each.numberOfHoursWorked})=${each.chronicLoadRatio}`)

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
            explanationArr.push(`Step 4: Remove high-admission roles.`)
            shiftsCombined.forEach((each, eachIndex) => {
                if (each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_CAP) {
                    explanationArr.push(getFormattedOutput(each) + " (DONE)")
                }
            });

            /* Step 5: High chronic load scenarios */
            // explanationArr.push("\n");
            let scenario1 = false;
            let scenario2 = false;
            let scenario3 = false
            if (timeObj.startTime == "19:00") {
                shiftsCombined.forEach((each, eachIndex) => {
                    /* Scenario 1: 
                    // If S3 has 6 admissions,
                    // S4 has 6 admissions or
                    // N5 has 3+ admissions */
                    if ((each.name == "S3" && Number(each.numberOfAdmissions) == 6) ||
                        (each.name == "S4" && Number(each.numberOfAdmissions) == 6) ||
                        (each.name == "N5" && Number(each.numberOfAdmissions) >= 3 && each.name == "N5" && Number(each.numberOfAdmissions) <= 6)) {
                        scenario1 = true;
                        return;
                        /* Scenario 2: If S4 has 5 admissions */
                    } else if (each.name == "S4" && Number(each.numberOfAdmissions) == 5) {
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
                explanationArr.push("Step 5 (Scenario 1): 7PM High Chronic Load Scenario. If S3 or S4 has number of admission of 6 or N5 has number of admissions of 3+, then repeat (N1-N4)x2 and then insert at the end.");

                /* Step 1: Remove from Array 1. This means that we have to copy Array 1 to Array 2.*/
                const array1 = [];
                const array2 = [];

                let s4HasFiveAdmissions = false;
                let s4HasFiveAdmissions_obj = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5
                    ) {
                        s4HasFiveAdmissions = true;
                        s4HasFiveAdmissions_obj = innerEach;
                    }
                });

                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {

                    } else {
                        array2.push(innerEach);
                    }
                });

                if (s4HasFiveAdmissions) {
                    let index = array2.findIndex(obj => obj.name === "S4");

                    if (index !== -1) {
                        let [removed] = array2.splice(index, 1);

                        array2.splice(2, 0, removed);
                    }
                }

                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5) ||
                        (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                        explanationArr.push(getFormattedOutput(innerEach));
                    } else {
                        array1.push(innerEach);
                    }
                })

                /* Step 2: Create Array 2 but copying over from Array 1*/
                shiftsCombined = array1.concat(array2);

                setArray1(array1 && array1.map((each) => { return each.name }));
                setArray2(array2 && array2.map((each) => { return each.name }));
                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr;
            } else if (scenario2) {
                explanationArr.push("Step 5 (Scenario 2): 7PM High Chronic Load Scenario. If S4 has number of admissions of 5, then N1-N4, N1>N2>S4>N3>N4");

                /* If S4 has number of admissions of 5, then remove S4 from Array 1. This means that we have to copy Array 1 to Array 2. */
                const array1 = [];
                const array2 = [];
                let getS4 = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else if (innerEach.name == "S4") {
                        explanationArr.push(getFormattedOutput(innerEach))
                        getS4 = innerEach;
                    } else if (innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) {
                        array1.push(innerEach);
                    } else if (innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) {
                        array2.push(innerEach);
                    } else {
                        array1.push(innerEach);
                        array2.push(innerEach);
                    }
                });

                const newElement = getS4;

                let index = 0;
                for (let i = 0; i < array2.length; i++) {
                    if (array2[i].name == "N2") {
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
                setArray1(array1 && array1.map((each) => { return each.name }));
                setArray2(array2 && array2.map((each) => { return each.name }));
            } else if (scenario3) {
                const array1 = [];
                let getS3 = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else if (innerEach.name == "S3") {
                        getS3 = innerEach;
                    } else {
                        array1.push(innerEach);
                    }
                });
                const array2 = [];
                const copyArray2 = [...array1];
                copyArray2.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else {
                        array2.push(innerEach);
                    }
                })

                const newElement = getS3;

                let index = 0;
                for (let i = 0; i < array2.length; i++) {
                    if (array2[i].name == "N1") {
                        index = i;
                    }
                }

                if (index !== -1) {
                    // Insert the new element after the found element
                    array2.splice(index + 1, 0, newElement);
                }
                setArray1(array1 && array1.map((each) => { return each.name }));
                setArray2(array2 && array2.map((each) => { return each.name }));
                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr;
            }
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

    const sortMain = (timeObj, dropdownSelected, lastSavedTime = "") => {
        if (compositeScoreAlgorithm) {
            return sortMainByCompositeScore(timeObj, dropdownSelected, lastSavedTime);
        } else {
            return sortMainOriginal(timeObj, dropdownSelected, lastSavedTime);
        }
    }
    const sortMainByCompositeScore = (timeObj, dropdownSelected, lastSavedTime = "") => {
        const orderOfAdmissions = [];
        timeObj && timeObj.shifts && timeObj.shifts && timeObj.shifts.map((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                return each;
            } else {
                each["timestamp"] = "";
                each["numberOfAdmissions"] = "";
            }
            return each;
        });

        timeObj && timeObj.shifts && timeObj.shifts && timeObj.shifts.forEach((each, eachIndex) => {
            each["startTime"] = timeObj.startTime ? timeObj.startTime : "";
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            // each["score"] = getCompositeScore(each);
            each["numberOfAdmissions"] = each.numberOfAdmissions ? each.numberOfAdmissions : "";
            each["timestamp"] = each.timestamp ? each.timestamp : ""
            return each;
        });

        const explanationArr = [];
        const differenceArr = [];
        const alrArr = [];
        const clrArr = [];
        const clrExplanationArr = [];
        const alrExplanationArr = [];
        const compositeArr = [];
        const normalizedAlrExplanation = [];
        const normalizedClrExplanation = [];
        const compositeScore2Explanation = [];

        const getTimeDifference = (time1) => {

            if (time1) {
                const time2 = dropdownSelected;
                // Convert times to minutes
                const [hours1, minutes1] = time1.split(':').map(Number);
                const [hours2, minutes2] = time2.split(':').map(Number);

                const totalMinutes1 = hours1 * 60 + minutes1;
                const totalMinutes2 = hours2 * 60 + minutes2;

                // Calculate difference in minutes
                let diffMinutes = totalMinutes2 - totalMinutes1;

                // Convert back to HH:mm
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;

                // Format with leading zeros
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } else {
                return "00:00";
            }

        }

        const getTimeDifferenceExplanation = (each) => {
            return `${each.name}: ${each.difference}`
        }

        const alr_f = alr;//0.50;
        const clr_f = clr;//0.50;

        const getAlr = (difference) => {
            const split = difference.split(":");
            const hours = Number(split[0]);
            const minutes = Number(split[1]);
            return (1 - ((hours * 60 + minutes) / 180)).toFixed(3);
        }

        const getAlrExplanation = (each) => {
            const difference = each.difference;
            const split = difference.split(":");
            const hours = Number(split[0]);
            const minutes = Number(split[1]);
            const output = (1 - ((hours * 60 + minutes) / 180)).toFixed(3);
            return `${each.name}: 1-((${hours} * 60 + ${minutes}) / 180)=${output}`;
        }

        const getClr = (each) => {
            const admissions = Number(each.numberOfAdmissions);
            let clr = 0;

            if (dropdownSelected == "19:00") {
                if (each.name == "S2") {
                    clr = Number(admissions) / 8;
                } else if (each.name == "S3") {
                    clr = Number(admissions) / 6;
                } else if (each.name == "S4") {
                    clr = Number(admissions) / 5;
                } else if (each.name == "N5") {
                    clr = Number(admissions) / 2;
                }
                return clr.toFixed(3);
            } else if (dropdownSelected == "17:00") {
                if (each.name == "S1") {
                    clr = Number(admissions) / 7;
                } else if (each.name == "S2") {
                    clr = Number(admissions) / 6;
                } else if (each.name == "S3") {
                    clr = Number(admissions) / 4;
                } else if (each.name == "S4") {
                    clr = Number(admissions) / 3;
                }
                return clr.toFixed(3);
            }
        }
        const getClrExplanation = (each) => {
            const admissions = Number(each.numberOfAdmissions);
            let clr = 0;

            let str = "";
            if (dropdownSelected == "19:00") {
                if (each.name == "S2") {
                    clr = Number(admissions) / 8;
                    str = `${each.name}: ${admissions} / 8 = ${clr.toFixed(3)}`;
                } else if (each.name == "S3") {
                    clr = Number(admissions) / 6;
                    str = `${each.name}: ${admissions} / 6 = ${clr.toFixed(3)}`;

                } else if (each.name == "S4") {
                    clr = Number(admissions) / 5;
                    str = `${each.name}: ${admissions} / 5 = ${clr.toFixed(3)}`;

                } else if (each.name == "N5") {
                    clr = Number(admissions) / 2;
                    str = `${each.name}: ${admissions} / 2 = ${clr.toFixed(3)}`;

                }
                return str;
            } else if (dropdownSelected == "17:00") {
                if (each.name == "S1") {
                    clr = Number(admissions) / 7;
                    str = `${each.name}: ${admissions} / 7 = ${clr.toFixed(3)}`;

                } else if (each.name == "S2") {
                    clr = Number(admissions) / 6;
                    str = `${each.name}: ${admissions} / 6 = ${clr.toFixed(3)}`;

                } else if (each.name == "S3") {
                    clr = Number(admissions) / 4;
                    str = `${each.name}: ${admissions} / 4 = ${clr.toFixed(3)}`;

                } else if (each.name == "S4") {
                    clr = Number(admissions) / 3;
                    str = `${each.name}: ${admissions} / 3 = ${clr.toFixed(3)}`;

                }
                return str;
            }
        }

        const getComposite = (each, ratio, clr) => {
            const comp = ((alr_f * ratio) + (clr_f * clr)).toFixed(3);

            // explanationArr.push(`CS for ${each.name}: (${alr_f} * ${ratio}) + (${clr_f} * ${clr}) = ${comp}`);
            if (!comp || comp == "NaN") {
                return 0;
            }
            else {
                return comp;
            }
        }

        const getCompositeExplanation = (each) => {
            const alr = each.alr;
            const clr = each.clr;

            const comp = ((alr_f * alr) + (clr_f * clr)).toFixed(3);

            if (!comp || comp == "NaN") {
                return "";
            }
            else {
                return `${each.name}: (${alr_f} * ${alr}) + (${clr_f} * ${clr}) = ${comp}`;
            }
        }

        const getTimeDifferenceInMinutes = (date1, date2) => {
            const diffInMilliseconds = Math.abs(moment(date2, "HH:mm") - moment(date1, "HH:mm"));
            const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
            return diffInMinutes;
        }
        const getAlr2 = (each) => {
            //alr = 1 - (Current Time - Last Admit Time, convert to minutes / P95)

            let p95 = "";
            let currentTimeMinusLastAdmitTime = "";
            if (dropdown == "19:00") {
                p95 = 180;
                if (each.timestamp == "") {
                    currentTimeMinusLastAdmitTime = 0;
                } else {
                    currentTimeMinusLastAdmitTime = getTimeDifferenceInMinutes("19:00", each.timestamp)
                }

                if (currentTimeMinusLastAdmitTime > 180) {
                    currentTimeMinusLastAdmitTime = 180;
                }
            } else if (dropdown == "17:00") {
                p95 = 135;
                if (each.timestamp == "") {
                    currentTimeMinusLastAdmitTime = 0;

                } else {
                    currentTimeMinusLastAdmitTime = getTimeDifferenceInMinutes("17:00", each.timestamp)

                }

                if (currentTimeMinusLastAdmitTime > 135) {
                    currentTimeMinusLastAdmitTime = 135;
                }
            }
            const res = (Number(currentTimeMinusLastAdmitTime) / p95).toFixed(3);
            explanationArr.push(`${each.name}: 1 - (${dropdown} - ${each.timestamp}) / ${p95} = ${res}`)

            return Number(res);
        }

        const standardDeviation = (array) => {
            const n = array.length;
            const mean = array.reduce((a, b) => a + b) / n;
            return Math.sqrt(
                array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1)
            );
        }

        const getNormalizedAlr = (each) => {
            // Norm_ALR = ALR/P95
            // Norm_CLR = CLR/P95

            // At 5:00PM
            // P95 [ALR] at 5:00 PM = 1.00
            // P95 [CLR] at 7:00 PM =0.70

            // At 7:00PM
            // P95 [ALR] at 5:00 PM = 1.00
            // P95 [CLR] at 7:00 PM = 0.70

            let p95_alr = "";
            // let p95_clr = "";
            if (dropdown == "17:00") {
                p95_alr = 1.00;
                // p95_clr = 0.70;
            } else if (dropdown == "19:00") {
                p95_alr = 1.00;
                // p95_clr = 0.70;
            }

            const normalizedAlr = each.alr2 / p95_alr;
            return normalizedAlr.toFixed(3);
        }
        const getNormalizedClr = (each) => {
            // let p95_alr = "";
            let p95_clr = "";
            if (dropdown == "17:00") {
                // p95_alr = 1.00;
                p95_clr = 0.70;
            } else if (dropdown == "19:00") {
                // p95_alr = 1.00;
                p95_clr = 0.70;
            }

            const normalizedAlr = each.clr / p95_clr;
            return normalizedAlr.toFixed(3);
        }

        const getNormalizedAlrExplanation = (each) => {
            let p95_alr = "";
            // let p95_clr = "";
            if (dropdown == "17:00") {
                p95_alr = 1.00;
                // p95_clr = 0.70;
            } else if (dropdown == "19:00") {
                p95_alr = 1.00;
                // p95_clr = 0.70;
            }

            return `${each.name}: ${each.alr2} / ${p95_alr} = ${each.normalizedAlr}`

        }
        const getNormalizedClrExplanation = (each) => {
            // let p95_alr = "";
            let p95_clr = "";
            if (dropdown == "17:00") {
                // p95_alr = 1.00;
                p95_clr = 0.70;
            } else if (dropdown == "19:00") {
                // p95_alr = 1.00;
                p95_clr = 0.70;
            }

            return `${each.name}: ${each.clr} / ${p95_clr} = ${each.normalizedClr}`

        }

        const getCompositeScore2 = (each) => {
            //Composite Score = W[ALR] X Norm_ALR + W[CLR] X Norm_CLR
            // const alrWeight = (standardDeviation(alrArr)/(standardDeviation(alrArr)+standardDeviation(clrArr))).toFixed(3);
            // const clrWeight = (standardDeviation(clrArr)/(standardDeviation(alrArr)+standardDeviation(alrArr))).toFixed(3);
            let res = (alrWeight * each.normalizedAlr) + (clrWeight * each.normalizedClr);
            if (dropdown == "17:00") {
                Object.entries(CONSTANT_COMPOSITE_5PM).forEach((innerEach, innerEachIndex) => {
                    if (innerEach[0] == each.name) {
                        res = innerEach[1];
                        return;
                    }
                });
            }

            else if (dropdown == "19:00") {
                Object.entries(CONSTANT_COMPOSITE_7PM).forEach((innerEach, innerEachIndex) => {
                    if (innerEach[0] == each.name) {
                        res = innerEach[1];
                        return;
                    }
                })
            }
            return Number(res).toFixed(3);
        }

        const getCompositeScore2Explanation = (each) => {
            //Composite Score = W[ALR] X Norm_ALR + W[CLR] X Norm_CLR
            // const alrWeight = (standardDeviation(alrArr)/(standardDeviation(alrArr)+standardDeviation(clrArr))).toFixed(3);
            // const clrWeight = (standardDeviation(clrArr)/(standardDeviation(alrArr)+standardDeviation(alrArr))).toFixed(3);

            if (SHOW_ROWS_COPY[dropdown].includes(each.name)) {
                if (SHOW_ROWS_TABLE[dropdown].includes(each.name)) {
                    return `${each.name}: ${alrWeight} * ${each.normalizedAlr} + ${clrWeight} * ${each.normalizedClr} = ${each.compositeScore2}`;

                } else {
                    return `${each.name}: ${each.compositeScore2}`;
                }
            }
        }
        explanationArr.push(`Step 1: Calculate ALR.`)
        explanationArr.push(`ALR = 1 - (Current Time - Last Admit Time, convert to minutes / P95)`)

        timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                const difference = getTimeDifference(each.timestamp);
                const alr = getAlr(difference);
                const clr = getClr(each)
                const composite = getComposite(each, alr, clr);
                const alr2 = getAlr2(each);
                const normalizedAlr = getNormalizedAlr(each);
                const normalizedClr = getNormalizedClr(each);
                const compositeScore2 = getCompositeScore2(each);

                alrArr.push(Number(alr2));
                clrArr.push(Number(clr));

                each["difference"] = difference;
                each["alr"] = alr;
                each["clr"] = clr;
                each["composite"] = composite;
                each["alr2"] = alr2;
                each["normalizedAlr"] = normalizedAlr;
                each["normalizedClr"] = normalizedClr;
                each["compositeScore2"] = compositeScore2;
            }

            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                differenceArr.push(getTimeDifferenceExplanation(each));
                alrExplanationArr.push(getAlrExplanation(each));
                clrExplanationArr.push(getClrExplanation(each));
                compositeArr.push(getCompositeExplanation(each));
                normalizedAlrExplanation.push(getNormalizedAlrExplanation(each));
                normalizedClrExplanation.push(getNormalizedClrExplanation(each));
                compositeScore2Explanation.push(getCompositeScore2Explanation(each))

            }
        });


        const alrWeight_ = (standardDeviation(alrArr) / (standardDeviation(alrArr) + standardDeviation(clrArr))).toFixed(3);
        const clrWeight_ = (standardDeviation(clrArr) / (standardDeviation(alrArr) + standardDeviation(alrArr))).toFixed(3);
        setAlrWeight(Number(alrWeight_));
        setClrWeight(Number(clrWeight_));

        explanationArr.push("\n");
        explanationArr.push("Step 2: Calculate Chronic Load Ratio (CLR) for each Role.")
        clrExplanationArr.forEach((each, eachIndex) => {
            explanationArr.push(each);
        });


        explanationArr.push("\n");
        explanationArr.push(`Step 3: Calculate weights of ALR and CLR, based on Standard Deviations.`);
        explanationArr.push(`ALR Weight: ${alrWeight}`);
        explanationArr.push(`CLR Weight: ${clrWeight}`);


        explanationArr.push("\n");
        explanationArr.push("Step 4: Calculate Normalized ALR and CLR for each Role");

        normalizedAlrExplanation.forEach((each, eachIndex) => {
            explanationArr.push(each);
        })

        explanationArr.push("\n");
        explanationArr.push("Step 5: Calculate Composite Score: a Weighted Sum of Acute and Chronic Load Scores.");



        timeObj.shifts.sort((a, b) => {
            if (a.compositeScore2 > b.compositeScore2) {
                return 1;
            }
            if (a.compositeScore2 < b.compositeScore2) {
                return -1;
            }
            return 0;
        });

        timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                const getExplanation = getCompositeScore2Explanation(each);
                explanationArr.push(getExplanation);
            }
        })
        // compositeScore2Explanation.forEach((each, eachIndex) => {
        //     explanationArr.push(each);
        // })
        /*
        Step 1: Time Difference
        */
        // explanationArr.push("Step 1: Sort by the difference of the shift time with the timestamp.");
        // timeObj.shifts.sort((a, b) => {
        //     if (a.difference > b.difference) {
        //         return 1;
        //     }
        //     if (a.difference < b.difference) {
        //         return -1;
        //     }
        //     return 0;
        // });
        // timeObj.shifts.forEach((each, eachIndex) => {
        //     if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
        //         explanationArr.push(getTimeDifferenceExplanation(each));
        //         alrArr.push(getAlrExplanation(each));
        //         clrArr.push(getClrExplanation(each));
        //         compositeArr.push(getCompositeExplanation(each))
        //     }
        // });
        // explanationArr.push("\n");

        // timeObj.shifts.sort((a, b) => {
        //     if (a.composite < b.composite) {
        //         return -1;
        //     }
        //     if (b.composite > b.composite) {
        //         return 1;
        //     }
        //     return 0;
        // });

        // explanationArr.push(`Step 2: Calculate Acute Load Ratio (ALR) for each Role.`);

        // alrArr.map((each, eachIndex) => {
        //     explanationArr.push(each);
        // });

        // explanationArr.push("\n")
        // explanationArr.push(`Step 3: Calculate Chronic Load Ratio (CLR) for each Role. CLR = Admits/Hours Worked`);

        // clrArr.map((each, eachIndex) => {
        //     explanationArr.push(each);
        // });

        // timeObj.shifts.sort((a, b) => {
        //     if (Number(a.composite) > Number(b.composite)) {
        //         return 1;
        //     }
        //     if (Number(a.composite) < Number(b.composite)) {
        //         return -1;
        //     }
        //     return 0;
        // });
        // explanationArr.push("\n")
        // explanationArr.push(`Step 4: Generate the Order based on Composite Score, with Roles having the Lowest Composite Score being Prioritized First.`);

        // // compositeArr.map((each, eachIndex) => {
        // //     explanationArr.push(each);
        // // });
        // timeObj.shifts.forEach((each, eachIndex) => {
        //     if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
        //         explanationArr.push(getCompositeExplanation(each));
        //     }
        // })

        // explanationArr.push("\n")
        // explanationArr.push(`Step 5: De-prioritize Roles with High Composite Scores.`);

        let shiftsCombined = [];
        timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                shiftsCombined.push(each);
            }
        });
            // explanationArr.push("\n");
            let scenario1 = false;
            let scenario2 = false;
            let scenario3 = false
            if (timeObj.startTime == "19:00") {
                shiftsCombined.forEach((each, eachIndex) => {
                    /* Scenario 1: 
                    // If S3 has 6 admissions,
                    // S4 has 6 admissions or
                    // N5 has 3+ admissions */
                    if ((each.name == "S3" && Number(each.numberOfAdmissions) == 6) ||
                        (each.name == "S4" && Number(each.numberOfAdmissions) == 6) ||
                        (each.name == "N5" && Number(each.numberOfAdmissions) >= 3 && each.name == "N5" && Number(each.numberOfAdmissions) <= 6)) {
                        scenario1 = true;
                        return;
                        /* Scenario 2: If S4 has 5 admissions */
                    } else if (each.name == "S4" && Number(each.numberOfAdmissions) == 5) {
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
                explanationArr.push("\n");
                explanationArr.push("Step 5 (Scenario 1): 7PM High Chronic Load Scenario. If S3 or S4 has number of admission of 6 or N5 has number of admissions of 3+, then repeat (N1-N4)x2 and then insert at the end.");

                /* Step 1: Remove from Array 1. This means that we have to copy Array 1 to Array 2.*/
                const array1 = [];
                const array2 = [];

                let s4HasFiveAdmissions = false;
                let s4HasFiveAdmissions_obj = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5
                    ) {
                        s4HasFiveAdmissions = true;
                        s4HasFiveAdmissions_obj = innerEach;
                    }
                });

                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {

                    } else {
                        array2.push(innerEach);
                    }
                });

                if (s4HasFiveAdmissions) {
                    let index = array2.findIndex(obj => obj.name === "S4");

                    if (index !== -1) {
                        let [removed] = array2.splice(index, 1);

                        array2.splice(2, 0, removed);
                    }
                }

                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5) ||
                        (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                        explanationArr.push(getFormattedOutputCompositeScore2(innerEach));
                    } else {
                        array1.push(innerEach);
                    }
                })

                /* Step 2: Create Array 2 but copying over from Array 1*/
                // shiftsCombined = array1.concat(array2);

                setArray1(array1 && array1.map((each) => { return each.name }));
                setArray2(array2 && array2.map((each) => { return each.name }));
                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr;
            } else if (scenario2) {
                explanationArr.push("\n");
                explanationArr.push("Step 5 (Scenario 2): 7PM High Chronic Load Scenario. If S4 has number of admissions of 5, then N1-N4, N1>N2>S4>N3>N4");

                /* If S4 has number of admissions of 5, then remove S4 from Array 1. This means that we have to copy Array 1 to Array 2. */
                const array1 = [];
                const array2 = [];
                let getS4 = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else if (innerEach.name == "S4") {
                        explanationArr.push(getFormattedOutputCompositeScore2(innerEach))
                        getS4 = innerEach;
                    } else if (innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) {
                        array1.push(innerEach);
                    } else if (innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) {
                        array2.push(innerEach);
                    } else {
                        array1.push(innerEach);
                        array2.push(innerEach);
                    }
                });

                const newElement = getS4;

                let index = 0;
                for (let i = 0; i < array2.length; i++) {
                    if (array2[i].name == "N2") {
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
                setArray1(array1 && array1.map((each) => { return each.name }));
                setArray2(array2 && array2.map((each) => { return each.name }));
            } else if (scenario3) {
                explanationArr.push("\n");
                const array1 = [];
                let getS3 = {};
                shiftsCombined.forEach((innerEach, innerEachIndex) => {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else if (innerEach.name == "S3") {
                        getS3 = innerEach;
                    } else {
                        array1.push(innerEach);
                    }
                });
                const array2 = [];
                const copyArray2 = [...array1];
                copyArray2.forEach((innerEach, innerEachIndex) => {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else {
                        array2.push(innerEach);
                    }
                })

                const newElement = getS3;

                let index = 0;
                for (let i = 0; i < array2.length; i++) {
                    if (array2[i].name == "N1") {
                        index = i;
                    }
                }

                if (index !== -1) {
                    // Insert the new element after the found element
                    array2.splice(index + 1, 0, newElement);
                }
                setArray1(array1 && array1.map((each) => { return each.name }));
                setArray2(array2 && array2.map((each) => { return each.name }));
                const combinedArr = array1.concat(array2);
                shiftsCombined = combinedArr;
            }
            shiftsCombined.map((each, eachIndex) => {
                if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                    if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                        orderOfAdmissions.push(each.name);
                    }
                }
            })


        timeObj.shifts.map((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                    if (window.location.hostname === 'localhost') {
                        orderOfAdmissions.push(`${each.name}(${each.compositeScore2})`);
                    } else {
                        orderOfAdmissions.push(each.name);
                    }
                    // return `${each.name}(${each.alr},${each.clr},${each.composite})>`;

                }
            }
        })

        setOrderOfAdmissions(orderOfAdmissions.join(">"));
        setExplanation(explanationArr);

        setSortRoles(timeObj, dropdownSelected, lastSavedTime);

        setAllAdmissionsDataShifts(timeObj);
        sortByAscendingName(timeObj);

        return orderOfAdmissions.join(">");
    }

    const getFormattedOutput = (each) => {
        return `${each.name} [ ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} ] (${each.numberOfAdmissions ? each.numberOfAdmissions : " "}/${each.numberOfHoursWorked})=${each.chronicLoadRatio}`;
    }

    const getFormattedOutputCompositeScore = (each) => {
        return `${each.name} [ ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} ] (${each.numberOfAdmissions ? each.numberOfAdmissions : " "}/${each.numberOfHoursWorked})=${each.composite}`;
    }

    const getFormattedOutputCompositeScore2 = (each) => {
        return `${each.name} [ ${each.timestamp ? moment(each.timestamp, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"} ] (${each.numberOfAdmissions ? each.numberOfAdmissions : " "}/${each.numberOfHoursWorked})=${each.compositeScore2}`;
    }

    const getMomentTimeWithoutUndefined = (time) => {
        return time ? moment(time, TIME_FORMAT).format(TIME_FORMAT) : "--:-- --"
    }

    const convertTo12HourFormatSimple = (time24) => {
        const [hours] = time24 && time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:00${period}`;
    }

    const onChange = (e, admissionsId) => {
        if (dropdown == "17:00") {
            setClickedGenerateQueue(false);
        }
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

    const timesDropdown = () => {
        return (
            <select
                value={dropdown}
                name="timesdropdown"
                className={isMobileDevice() ? "timesdropdownwithoutsnapshot" : "timesdropdown"}
                id="timesdropdown"
                onChange={e => {
                    const startTime = e.target.value;
                    // console.log("clickedGenerateQueue", clickedGenerateQueue);
                    if (startTime == "19:00" && clickedGenerateQueue) {
                        const getMostRecentTransactionx = async (startTime) => {
                            const res = await getMostRecentTransaction(startTime);

                            if (!res.success) {
                                const newObj = {};
                                newObj["startTime"] = "19:00";
                                newObj["shifts"] = SHIFT_TYPES;
                                setDropdown("19:00");
                                sortMain(newObj, "19:00")
                            } else if (res && res.transaction) {
                                let getN5 = {};

                                res.transaction.admissionsObj.allAdmissionsDataShifts.shifts.forEach((each, eachIndex) => {
                                    if (each.name == "N5") {
                                        getN5 = each;
                                        return;
                                    }
                                })

                                const newObj = {};

                                const shifts = [];

                                allAdmissionsDataShifts.shifts.forEach((each, eachIndex) => {
                                    if (each.name == "N5") {
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
                        setClickedGenerateQueue(false);
                        setDropdown(startTime);
                        setLastSaved("")
                        setAllAdmissionsDataShifts({ shifts: SHIFT_TYPES, dropdown: startTime });
                        const getMostRecentTransactionx = async (startTime) => {
                            const res = await getMostRecentTransaction(startTime);

                            if (res && res.transaction) {
                                const order = res.transaction.order;
                                const allAdmissionsDataShifts = res.transaction.admissionsObj.allAdmissionsDataShifts;
                                const lastSavedTime = res.transaction.localDateTime;
                                if (allAdmissionsDataShifts) {
                                    setAllAdmissionsDataShifts(allAdmissionsDataShifts);
                                }

                                if (order.split(">").length > 10) {
                                    const splitArr = order.split(">");
                                    function splitArrayAtSecondOccurrence(arr, value) {
                                        let count = 0; // To track occurrences of the value
                                        let splitIndex = -1;

                                        // Iterate over the array to find the second occurrence
                                        for (let i = 0; i < arr.length; i++) {
                                            if (arr[i] === value) {
                                                count++;
                                                if (count === 2) {
                                                    splitIndex = i;
                                                    break;
                                                }
                                            }
                                        }

                                        // If the value is found twice, split the array
                                        if (splitIndex !== -1) {
                                            setArray1(arr.slice(0, splitIndex));
                                            setArray2(arr.slice(splitIndex));
                                            return [arr.slice(0, splitIndex), arr.slice(splitIndex)];
                                        } else {
                                            // If the value is not found twice, return the whole array as the first element
                                            return [arr];
                                        }
                                    }
                                    setOrderOfAdmissions(order);
                                    splitArrayAtSecondOccurrence(splitArr, "N1");

                                } else if (order) {
                                    setOrderOfAdmissions(order);
                                }

                                if (lastSavedTime) {
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
                alert('✅ Screenshot copied to clipboard!');
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
        // sortRoles.push("\n");

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

        emailjs.send(CONFIG.REACT_APP_EMAILJS_SERVICE_ID, CONFIG.REACT_APP_EMAILJS_TEMPLATE_ID, { message: "lll", title: title }, CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY).then(
            (response) => {
                console.log("SUCCESS!", response.status, response.text);
            },
            (error) => {
                console.log("FAILED...", error);
            },
        );

    };

    const handleGenerateQueue = (e) => {
        setClickedGenerateQueue(true);
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

        if (navigator.platform == "MacIntel") {//"Win32"){
            let content = "";
            explanation && explanation.map((line, lineIndex) => {
                if (line == "\n") {
                    // return <br></br>
                    content += "\n";
                } else {
                    // return <p>{line}</p>
                    content += line;
                }
            });
            // sendEmail(e, content, `SADQ ${lastSaved} ${orderOfAdmissions}`);
        }
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
                <h1 className="title">S.A.D.Q.</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
            </div>

            {loading ? <div className="loading">
                <div class="spinner">
                    {/* Loading... */}
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div> :
                <div className="container">
                    {/* <CypressTestRunner /> */}
                    <div className="flex-container-just1item">
                        {timesDropdown()}
                    </div>
                    {!isMobileDevice() && <img
                        alt="copy button"
                        className="copybutton"
                        id="snapshot-button"
                        src={snapshotImg}
                        onClick={(ev) => {
                            takeScreenshot();

                        }} />}
                    <table id="screenshotimg">
                        <table id="reacttable">
                            <thead>
                                {openTable ? (
                                    <tr>
                                        {EXPAND_TABLE.map((each, eachIndex) => {
                                            if (each[0] == "name") {
                                                return (
                                                    <th className="th_10percent" key={eachIndex}>{each[1]}</th>
                                                );
                                            } else if (each[0] == "timestamp" || each[0] == "numberOfAdmissions" || each[0] == "chronicLoadRatio") {
                                                return (
                                                    <th className="th_25percent" key={eachIndex}>{each[1]}</th>
                                                );
                                            }
                                            return (<th key={eachIndex}>{each[1]}</th>);
                                        })}
                                    </tr>
                                ) : (
                                    <tr>
                                        {MINIMIZE_TABLE.map((each, eachIndex) => {
                                            if (each[0] == "name") {
                                                return (
                                                    <th className="th_10percent" key={eachIndex}>{each[1]}</th>
                                                );
                                            } else if (each[0] == "timestamp" || each[0] == "numberOfAdmissions" || each[0] == "chronicLoadRatio") {
                                                return (
                                                    <th className="th_25percent" key={eachIndex}>{each[1]}</th>
                                                );
                                            }
                                            return (<th key={eachIndex}>{each[1]}</th>);
                                        })}
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {allAdmissionsDataShifts.shifts &&
                                    allAdmissionsDataShifts.shifts.length > 0 &&
                                    allAdmissionsDataShifts.shifts.map((admission, indexx) => {
                                        let index = 0;
                                        if (SHOW_ROWS_TABLE[dropdown] && SHOW_ROWS_TABLE[dropdown].includes(admission.name)) {
                                            index = SHOW_ROWS_TABLE[dropdown].findIndex((user) => user == admission.name);
                                            return (
                                                !admission.isStatic && (
                                                    <tr
                                                        style={SHOW_ROWS_TABLE[dropdown] && SHOW_ROWS_TABLE[dropdown].includes(admission.name) ? {} : { display: "none" }}
                                                        id={"admissionsDataRow_" + index}
                                                        className={"admissionsDataRow"}
                                                        key={admission.admissionsId}
                                                    >
                                                        <td>
                                                            <input name={`name_${index}`} className="bold-fields" value={admission.name || ""} type="text" disabled={true} />
                                                        </td>
                                                        {openTable && (
                                                            <td>
                                                                <input name="shiftTimePeriod" value={admission.shiftTimePeriod} type="text" disabled={true} />
                                                            </td>
                                                        )}
                                                        <td className="usercanedit" tabIndex={-1} onKeyDown={(e) => handleKeyDown(e, index)}>
                                                            <input
                                                                id={`timestamp_${index}`}
                                                                name="timestamp"
                                                                className="timestamp"
                                                                value={admission.timestamp || ""}
                                                                type="time"
                                                                onChange={(e) => onChange(e, admission.admissionsId)}
                                                                disabled={admission.isStatic}
                                                            />
                                                        </td>
                                                        <td className="usercanedit" tabIndex={-1} onKeyDown={(e) => handleKeyDown(e, index)}>
                                                            <input
                                                                id={`numberOfAdmissions_${index}`}
                                                                name="numberOfAdmissions"
                                                                className="numberOfAdmissions"
                                                                value={admission.numberOfAdmissions || ""}
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
                                                            <div className="progress-cell">
                                                                <div className="progress-container">
                                                                    <div
                                                                        className="progress-bar"
                                                                        style={{
                                                                            width: `${(admission.chronicLoadRatio || 0) * 100}%`,
                                                                            background: (admission.chronicLoadRatio || 0) > 0.5
                                                                                ? "linear-gradient(to right, #1a0dab, #1a0dab)" /* Red gradient */
                                                                                : "linear-gradient(to right,  #1a0dab, #1a0dab)" /* Green gradient */
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="progress-text">
                                                                    {Math.round((admission.chronicLoadRatio || 0) * 100)}%
                                                                </span>
                                                            </div>
                                                        </td>


                                                        {openTable && (
                                                            <td>
                                                                <input
                                                                    name="numberHoursWorked"
                                                                    value={admission.numberOfHoursWorked || ""}
                                                                    type="number"
                                                                    placeholder="Enter number"
                                                                    disabled={true}
                                                                />
                                                            </td>
                                                        )}
                                                    </tr>
                                                )
                                            );
                                        }
                                    })}
                            </tbody>
                        </table>
                        {/* highlighted order of admissions below table */}
                        <p className="endoutputcenter" id="orderofadmissions_title">{`Order of Admits ${lastSaved.split(" ")[0] + " " + convertTo12HourFormatSimple(dropdown)}`}</p>
                        {window.location.hostname === 'localhost' && compositeScoreAlgorithm ?
                            <p className="endoutputcenter" id="orderofadmissions_output">
                                {/* {
                                allAdmissionsDataShifts.shifts.map((each, eachIndex) => {
                                    if (SHOW_ROWS_TABLE[dropdown].includes(each.name)){
                                        return `${each.name}(${each.alr},${each.clr},${each.composite})>`;
                                    }
                                })
                            } */}
                                {orderOfAdmissions && orderOfAdmissions}
                            </p>
                            : hasTwoOccurrences(orderOfAdmissions, "N1") ?
                                <div>
                                    <p className="endoutputcenter" id="orderofadmissions_output">{array1 ? array1.join(">") + ">" : ""}<br></br>{array2 && array2.join(">")}</p>
                                </div>
                                : <p className="endoutputcenter" id="orderofadmissions_output">{orderOfAdmissions}</p>
                        }
                        <div className="lastsaved-yellowmessage">
                            {"Generated " + lastSaved + " @ https://sadqueue.github.io/sad"}

                        </div>
                    </table>

                    <section>
                        <button id="generateQueue" onClick={(e) => {
                            handleGenerateQueue(e);
                        }}>
                            Generate Queue
                        </button>
                    </section>

                    <button className="seedetails" id="seedetails" onClick={() => {
                        setSeeDetails(!seeDetails);
                        // setShow1( false);
                        setShow2(false);
                        setShow3(false);
                        setShow4(false);
                    }
                    }>{seeDetails ? "Hide Explanation" : "Show Explanation"}</button>

                    {seeDetails && <fieldset className="notes">
                        <p className="bold">Explanation</p>

                        {/* Part 1: Order of Admits */}
                        {/* <button className="explanation" onClick={() => {
                            setShow1(!show1);
                        }
                        }>{!show1 ? "> Order of Admissions" : "< Order of Admissions"}</button><br></br>
                        
                        {show1 && <div id="fieldsettocopy_min">
                            
                            { compositeScoreAlgorithm && 
                            <div>
                                <p> Composite score algorithm is being used. </p>
                                {
                                    allAdmissionsDataShifts.shifts.map((each, eachIndex) => {
                                        if (SHOW_ROWS_TABLE[dropdown].includes(each.name)){

                                            return <p> {getFormattedOutputCompositeScore(each)} </p>
                                        }
                                    })
                                }
                            </div>
                                
                            }

                            { !compositeScoreAlgorithm && 
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
                        </div>} */}

                        {/* Part 2: Explanation */}
                        <button className="explanation" onClick={() => {
                            setShow2(!show2);
                        }
                        }>{!show2 ? "> Step by Step Details" : "< Step by Step Details"}</button><br></br>

                        {show2 && <div>
                            {explanation && explanation.map((line, lineIndex) => {
                                if (line == "\n") {
                                    return <br></br>
                                } else {
                                    return <p>{line}</p>
                                }
                            })}<br></br>
                        </div>}
                        {/* Part 3: Copy Message */}

                        <button className="explanation"
                            onClick={() => {
                                setShow3(!show3);
                            }}>{!show3 ? "> Copy Messages" : "< Copy Messages"}</button><br></br>

                        {show3 && <CopyMessages />}


                        {/* Part 4: Set Composite Score */}
                        <button className="explanation" onClick={() => {
                            setShow4(!show4);
                        }
                        }>{!show4 ? "> Set Composite Algorithm" : "< Set Composite Algorithm"}</button><br></br>

                        {show4 && <div className="flex">
                            <input
                                id="compositeScoreCheckbox"
                                placeholder="Composite Score Algorithm"
                                className="input-left"
                                label="Composite Score Algorithm"
                                type="checkbox"
                                onChange={(e) => {
                                    // setAllAdmissionsDataShifts({startTime: dropdown, shifts: SHIFT_TYPES})
                                    setCompositeScoreAlgorithm(e.target.checked);
                                }}
                            />
                            <p>Composite Score Algorithm</p>

                        </div>
                        }                       {show4 && compositeScoreAlgorithm &&
                            <div>
                                {/* <div className="flex"><p className="weightwidth">ALR: </p><input
                                    id="alr"
                                    placeholder="ALR"
                                    className="input-left"
                                    label="ALR"
                                    type="number"
                                    onChange={(e) => {
                                        setAlr(e.target.value);
                                        if (Number(e.target.value)) {
                                            setClr((1 - Number(e.target.value)).toFixed(2));

                                        }
                                    }}
                                    value={alr}
                                /></div>
                                <div className="flex"><p className="weightwidth">CLR: </p><input
                                    id="clr"
                                    placeholder="CLR"
                                    className="input-left"
                                    label="CLR"
                                    type="number"
                                    onChange={(e) => {
                                        setClr(e.target.value);
                                        if (Number(e.target.value)) {
                                            setAlr((1 - Number(e.target.value)).toFixed(2));
                                        }
                                    }}
                                    value={clr}
                                /></div> */}
                                <p>Select the Generate Queue button above</p>


                            </div>
                        }


                    </fieldset>}
                    <div className="footer">
                        <img
                            alt="copy button"
                            className="githubbutton"
                            src={githublogo}
                            onClick={(ev) => {
                                window.open("https://github.com/sadqueue/sad/tree/main", '_blank');
                            }} />
                        <p>&copy; {new Date().getFullYear()} S.A.D.Q. All rights reserved.</p>
                    </div>
                </div>}
        </div>
    )

}

export default App;