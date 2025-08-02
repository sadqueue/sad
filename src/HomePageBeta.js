import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
    SHIFT_TYPES,
    START_TIMES,
    CHRONIC_LOAD_RATIO_THRESHOLD,
    TIME_FORMAT,
    ROLE_ORDER,
    SHOW_ROWS_TABLE,
    SHOW_ROWS_COPY,
    CHRONIC_LOAD_RATIO_THRESHOLD_S4,
    NUMBER_OF_ADMISSIONS_CAP,
    ROLES_WITH_DEFAULT_TIMES,
    // CONSTANT_COMPOSITE_5PM,
    // CONSTANT_COMPOSITE_7PM,
    // config.CONSTANT_COMPOSITE_5PM_N5,
    // config.CONSTANT_COMPOSITE_7PM_N1,
    // config.CONSTANT_COMPOSITE_7PM_N2,
    // config.CONSTANT_COMPOSITE_7PM_N3,
    // config.CONSTANT_COMPOSITE_7PM_N4,
    // config.P95_7PM,
    // config.P95_5PM,
    MINIMIZE_TABLE_STATIC_COMPOSITE_WEB,
    MINIMIZE_TABLE_STATIC_COMPOSITE_MOBILE,
    // config.ALR_5PM,
    // config.CLR_5PM,
    // config.ALR_7PM,
    // config.CLR_7PM
} from "./constants";
import snapshotImg from "./images/snapshot.png";
import githublogo from "./images/github-mark.png"
import emailjs from "@emailjs/browser";
import CONFIG1 from "./config";
import CopyMessages from "./CopyMessages";
import {
    addTransaction, deleteAllTransactions, getMostRecentTransaction,
    fetchConfigValues
} from "./transactionsApi";
import html2canvas from "html2canvas";

const CONFIG = CONFIG1;

export function App() {
    // deleteAllTransactions("17:00")
    // deleteAllTransactions("16:00")
    // deleteAllTransactions("19:00")
    const [allAdmissionsDataShifts, setAllAdmissionsDataShifts] = useState({ startTime: "17:00", shifts: SHIFT_TYPES })

    const [seeDetails, setSeeDetails] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [openTable, setOpenTable] = useState(false);
    const [dropdown, setDropdown] = useState("17:00");
    const [lastSaved, setLastSaved] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderOfAdmissions, setOrderOfAdmissions] = useState("");
    const [array1, setArray1] = useState("");
    const [array2, setArray2] = useState("");
    const [clickedGenerateQueue, setClickedGenerateQueue] = useState(false);
    const [originalAlgorithm, setOriginalAlgorithm] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [config, setConfig] = useState({
        // config.ALR_5PM: config.ALR_5PM,
        // config.CLR_5PM: config.CLR_5PM,
        // config.ALR_7PM: config.ALR_7PM,
        // config.CLR_7PM: config.CLR_7PM,

        // config.P95_7PM: config.P95_7PM,
        // config.P95_5PM: config.P95_5PM,
        // config.CONSTANT_COMPOSITE_5PM_N5: config.CONSTANT_COMPOSITE_5PM_N5,
        // config.CONSTANT_COMPOSITE_7PM_N1: config.CONSTANT_COMPOSITE_7PM_N1,
        // config.CONSTANT_COMPOSITE_7PM_N2: config.CONSTANT_COMPOSITE_7PM_N2,
        // config.CONSTANT_COMPOSITE_7PM_N3: config.CONSTANT_COMPOSITE_7PM_N3,
        // config.CONSTANT_COMPOSITE_7PM_N4: config.CONSTANT_COMPOSITE_7PM_N4
        // config.ALR_5PM: config.ALR_5PM,
        // config.CLR_5PM: config.CLR_5PM,
        // config.ALR_7PM: config.ALR_7PM,
        // config.CLR_7PM: config.CLR_7PM,

        // config.P95_7PM: config.P95_7PM,
        // config.P95_5PM: config.P95_5PM,
        // config.CONSTANT_COMPOSITE_5PM_N5: config.CONSTANT_COMPOSITE_5PM_N5,
        // config.CONSTANT_COMPOSITE_7PM_N1: config.CONSTANT_COMPOSITE_7PM_N1,
        // config.CONSTANT_COMPOSITE_7PM_N2: config.CONSTANT_COMPOSITE_7PM_N2,
        // config.CONSTANT_COMPOSITE_7PM_N3: config.CONSTANT_COMPOSITE_7PM_N3,
        // config.CONSTANT_COMPOSITE_7PM_N4: config.CONSTANT_COMPOSITE_7PM_N4
    });
    const [lastSaved5Pm, setLastSaved5Pm] = useState({})

    useEffect(() => {
        emailjs.init(CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY);
    
    
        const loadConfig = async () => {
            try {
                const data = await fetchConfigValues();
                console.log("Config values fetched:", data); // Debugging
                setConfig(data);
            } catch (err) {
                console.log("Failed to load configuration.", err);
            } finally {
                setLoading(false);
            }
        };
    
        loadConfig();
    }, []);
    
    useEffect(() => {
        let localDateTime = "";

        if (Object.keys(config).length === 0) {
            console.log("Config not yet loaded, waiting...");
            return;
        }
    
        const fetchRecentTransaction = async () => {
            function default5PMIfBetween7AMAnd6PM() {
                const now = new Date();
                const currentHour = now.getHours();
                return currentHour >= 7 && currentHour < 18;
            }
    
            const result = await getMostRecentTransaction(
                default5PMIfBetween7AMAnd6PM() ? "17:00" : "19:00"
            );
    
            if (result.success) {
                setLastSaved(result.transaction.localDateTime);
                if (
                    result.transaction.admissionsObj.allAdmissionsDataShifts &&
                    result.transaction.admissionsObj.allAdmissionsDataShifts.shifts
                ) {
                    setDropdown(result.transaction.admissionsObj.startTime);
                    sortMain(
                        result.transaction.admissionsObj.allAdmissionsDataShifts,
                        result.transaction.admissionsObj.startTime
                            ? result.transaction.admissionsObj.startTime
                            : "17:00",
                        localDateTime
                    );
                }
            } else {
                sortMain(
                    allAdmissionsDataShifts,
                    default5PMIfBetween7AMAnd6PM() ? "17:00" : "19:00",
                    localDateTime
                );
            }
        };
    
        fetchRecentTransaction();
    
        const fetchRecent5PMTransaction = async () => {
            const result = await getMostRecentTransaction("17:00");
    
            if (result.success) {
                setLastSaved5Pm(result.transaction.admissionsObj.allAdmissionsDataShifts);
            }
        };
    
        fetchRecent5PMTransaction();
    }, [config]);

    const isXIn2Hours = (each) => {
        let isXIn2Hours = false;

        if (dropdown == "19:00") {
            lastSaved5Pm && lastSaved5Pm.shifts && lastSaved5Pm.shifts.forEach((fivePm, eachIndex) => {
                if (each.name == fivePm.name) {
                    if (fivePm.numberOfAdmissions !== "" &&
                        (Number(fivePm.numberOfAdmissions)) + 2 <= Number(each.numberOfAdmissions)) {
                        isXIn2Hours = true;
                        return true;
                    }
                }
            });
        }
        return isXIn2Hours;
    }

    const getXIn2Hours = (each) => {
        let isXIn2Hours = "";

        if (dropdown == "19:00") {
            if (each.name == "N5" && each.numberOfAdmissions >= 2) {
                return each.numberOfAdmissions;
            } else {
                lastSaved5Pm && lastSaved5Pm.shifts && lastSaved5Pm.shifts.forEach((fivePm, eachIndex) => {
                    if (each.name == fivePm.name) {
                        if (fivePm.numberOfAdmissions !== "" &&
                            (Number(fivePm.numberOfAdmissions)) + 2 <= Number(each.numberOfAdmissions)) {
                            isXIn2Hours = Number(each.numberOfAdmissions) - Number(fivePm.numberOfAdmissions);
                            return true;
                        }
                    }
                });
            }

        }
        return isXIn2Hours;
    }

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
        explanationArr.push("Step 1: Rank Order Based on Acute Load (Time Since Last Admission). [ALR = 1 - (Current Time [17:00] - Last Admit Time)/config.P95_7PM]");

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
                    if ((dropdownSelected == "17:00" && each.name === "S4" && (dropdown == "19:00" && (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD_S4))) ||
                        (!window.Cypress && isXIn2Hours(each)) ||
                        (dropdown == "19:00" && (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD))
                    ) {
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
                if (dropdown == "17:00") {
                    explanationArr.push(getFormattedOutput(each) + " (DONE)")
                } else if (dropdown == "19:00") {
                    if (each.numberOfAdmissions > NUMBER_OF_ADMISSIONS_CAP) {
                        explanationArr.push(getFormattedOutput(each) + " (DONE)")
                    }
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
                    if (dropdown == "17:00") {
                        if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6)) {

                        } else {
                            array2.push(innerEach);
                        }
                    } else if (dropdown == "19:00") {
                        if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                            Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {

                        } else {
                            array2.push(innerEach);
                        }
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
                    if (dropdown == "17:00") {
                        if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                            (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                            (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5) ||
                            (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3)) {
                            explanationArr.push(getFormattedOutput(innerEach));
                        } else {
                            array1.push(innerEach);
                        }
                    } else if (dropdown == "19:00") {
                        if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                            (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                            (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5) ||
                            (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3) ||
                            Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                            explanationArr.push(getFormattedOutput(innerEach));
                        } else {
                            array1.push(innerEach);
                        }
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
                    if (dropdown == "17:00") {
                        if (innerEach.name == "S4") {
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
                    } else if (dropdown == "19:00") {
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
                    if (dropdown == "17:00") {
                        if (innerEach.name == "S3") {
                            getS3 = innerEach;
                        } else {
                            array1.push(innerEach);
                        }
                    } else if (dropdown == "19:00") {
                        if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                        } else if (innerEach.name == "S3") {
                            getS3 = innerEach;
                        } else {
                            array1.push(innerEach);
                        }
                    }

                });
                const array2 = [];
                const copyArray2 = [...array1];
                copyArray2.forEach((innerEach, innerEachIndex) => {
                    if (dropdown == "17:00") {
                        if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6)) {
                        } else {
                            array2.push(innerEach);
                        }
                    } else if (dropdown == "19:00") {
                        if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                            Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                        } else {
                            array2.push(innerEach);
                        }
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
                    if (dropdown == "17:00") {
                        if (window.location.hostname === 'localhost') {
                            orderOfAdmissions.push(`${each.name}(${each.chronicLoadRatio})`)
                        } else {
                            orderOfAdmissions.push(each.name);
                        }
                    } else if (dropdown == "19:00") {
                        if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                            if (window.location.hostname === 'localhost') {
                                orderOfAdmissions.push(`${each.name}(${each.chronicLoadRatio})`)
                            } else {
                                orderOfAdmissions.push(each.name);

                            }
                        }
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
        console.log("config...", config);
        if (originalAlgorithm) {
            return sortMainOriginal(timeObj, dropdownSelected, lastSavedTime);
        }
        return sortMainByCompositeScoreStatic(timeObj, dropdownSelected, lastSavedTime);
    }
    const sortMainByCompositeScoreStatic = (timeObj, dropdownSelected, lastSavedTime = "") => {
        setDropdown(dropdownSelected);
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
            each["numberOfAdmissions"] = each.numberOfAdmissions ? each.numberOfAdmissions : "";
            each["timestamp"] = each.timestamp ? each.timestamp : ""
            return each;
        });

        const explanationArr = [];
        const differenceArr = [];
        const alrArr = [];
        const clrArr = [];
        const compositeArr = [];
        const normalizedAlrExplanation = [];
        const normalizedClrExplanation = [];
        const compositeArrExplanation = [];

        const getTimeDifferenceExplanation = (each) => {
            if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {
                return `${each.name}: ${dropdownSelected} - ${each.timestamp} = ${each.difference}`;
            }
        }

        const getAlrExplanation = (each, alrx) => {
            if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {
                let p95 = "";
                if (dropdownSelected == "19:00") {
                    p95 = config.P95_7PM;
                } else if (dropdownSelected == "17:00") {
                    p95 = config.P95_5PM;
                }

                let fixedDiff = each.difference;
                if (each.difference > p95) {
                    fixedDiff = p95;
                }
                return `${each.name}: 1-(${fixedDiff} minutes / ${p95}) = ${alrx}`;
            }
        }


        const getClrExplanation = (each, clrx) => {
            if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {

                const admissions = Number(each.numberOfAdmissions);
                let clr = Number(clrx);

                let str = "";
                if (dropdownSelected == "19:00") {
                    if (each.name == "S2") {
                        // clr = Number(admissions) / 8;
                        str = `${each.name}: ${admissions} / 8 = ${clr.toFixed(3)}`;
                    } else if (each.name == "S3") {
                        // clr = Number(admissions) / 6;
                        str = `${each.name}: ${admissions} / 6 = ${clr.toFixed(3)}`;

                    } else if (each.name == "S4") {
                        // clr = Number(admissions) / 5;
                        str = `${each.name}: ${admissions} / 5 = ${clr.toFixed(3)}`;

                    } else if (each.name == "N5") {
                        // clr = Number(admissions) / 2;
                        str = `${each.name}: ${admissions} / 2 = ${clr.toFixed(3)}`;

                    }
                    return str;
                } else if (dropdownSelected == "17:00") {
                    if (each.name == "S1") {
                        // clr = Number(admissions) / 7;
                        str = `${each.name}: ${admissions} / 7 = ${clr.toFixed(3)}`;

                    } else if (each.name == "S2") {
                        // clr = Number(admissions) / 6;
                        str = `${each.name}: ${admissions} / 6 = ${clr.toFixed(3)}`;

                    } else if (each.name == "S3") {
                        // clr = Number(admissions) / 4;
                        str = `${each.name}: ${admissions} / 4 = ${clr.toFixed(3)}`;

                    } else if (each.name == "S4") {
                        // clr = Number(admissions) / 3;
                        str = `${each.name}: ${admissions} / 3 = ${clr.toFixed(3)}`;

                    }
                    return str;
                }
            }
        }


        const getCompositeExplanation = (each, normalizedAlr, normalizedClr, isFinalExplanation) => {
            const alr_f = dropdownSelected == "17:00" ? config.ALR_5PM : config.ALR_7PM;
            const clr_f = dropdownSelected == "17:00" ? config.CLR_5PM : config.CLR_7PM;
            let res = ((alr_f * Number(normalizedAlr)) + (clr_f * Number(normalizedClr))).toFixed(3);
            if (dropdownSelected == "17:00") {
                if (each.name == "N5") {
                    res = config.CONSTANT_COMPOSITE_5PM_N5;
                    return `${each.name}: ${config.CONSTANT_COMPOSITE_5PM_N5}`;
                }
            }
            else if (dropdownSelected == "19:00") {
                if (each.name == "N1") {
                    res = config.CONSTANT_COMPOSITE_7PM_N1;
                    return `${each.name}: ${config.CONSTANT_COMPOSITE_7PM_N1}`;
                } else if (each.name == "N2") {
                    res = config.CONSTANT_COMPOSITE_7PM_N2;
                    return `${each.name}: ${config.CONSTANT_COMPOSITE_7PM_N2}`;
                } else if (each.name == "N3") {
                    res = config.CONSTANT_COMPOSITE_7PM_N3;
                    return `${each.name}: ${config.CONSTANT_COMPOSITE_7PM_N3}`;
                } else if (each.name == "N4") {
                    res = config.CONSTANT_COMPOSITE_7PM_N4;
                    return `${each.name}: ${config.CONSTANT_COMPOSITE_7PM_N4}`;
                }
            }

            if (isFinalExplanation) {
                return `${each.name}: ${res}`;

            } else {
                if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {
                    return `${each.name}: (${alr_f} * ${normalizedAlr}) + (${clr_f} * ${normalizedClr}) = ${res}`;

                }

            }

        }


        const getNormalizedAlrExplanation = (each) => {
            if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {
                let p95_alr = "";
                if (dropdownSelected == "17:00") {
                    p95_alr = 1.00;
                } else if (dropdownSelected == "19:00") {
                    p95_alr = 1.00;
                }

                return `${each.name}: ${each.alr} / ${p95_alr} = ${each.normalizedAlr}`
            }
        }
        const getNormalizedClrExplanation = (each) => {
            if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {
                let p95_clr = "";
                if (dropdownSelected == "17:00") {
                    p95_clr = 1.00;
                } else if (dropdownSelected == "19:00") {
                    p95_clr = 1.00;
                }

                return `${each.name}: ${each.clr} / ${p95_clr} = ${each.normalizedClr}`
            }
        }

        explanationArr.push("Step 1: Calculate Acute Load Ratio (ALR) for each Role.");

        timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                const difference = getTimeDifference(each.timestamp);
                const alrx = getAlr(each, difference, dropdownSelected);
                const clrx = getClr(each, dropdownSelected)
                const normalizedAlr = getNormalizedAlr(each, alrx, dropdownSelected);
                const normalizedClr = getNormalizedClr(each, clrx, dropdownSelected);
                const composite = getComposite(each, normalizedAlr, normalizedClr, dropdownSelected);

                each["difference"] = difference;
                each["alr"] = alrx;
                each["clr"] = clrx;
                each["composite"] = composite;
                each["normalizedAlr"] = normalizedAlr;
                each["normalizedClr"] = normalizedClr;

                compositeArrExplanation.push(getCompositeExplanation(each, normalizedAlr, normalizedClr));
                alrArr.push(getAlrExplanation(each, alrx));
                clrArr.push(getClrExplanation(each, clrx));
                normalizedAlrExplanation.push(getNormalizedAlrExplanation(each));
                normalizedClrExplanation.push(getNormalizedClrExplanation(each));
            }
        });

        /*
        Step 1: Time Difference
        */
        timeObj.shifts.sort((a, b) => {
            if (a.difference > b.difference) {
                return 1;
            }
            if (a.difference < b.difference) {
                return -1;
            }
            return 0;
        });

        timeObj.shifts.sort((a, b) => {
            if (a.composite < b.composite) {
                return -1;
            }
            if (b.composite > b.composite) {
                return 1;
            }
            return 0;
        });

        explanationArr.push(`ALR = 1 - (Minutes Before The Hour/ P95)`);

        alrArr.map((each, eachIndex) => {
            explanationArr.push(each);
        });

        explanationArr.push("\n")
        explanationArr.push(`Step 2: Calculate Chronic Load Ratio (CLR) for each Role.`);
        explanationArr.push("CLR = Number of Admits / Hours Worked So Far")


        clrArr.map((each, eachIndex) => {
            explanationArr.push(each);
        });

        explanationArr.push("\n")
        explanationArr.push(`Step 3: Calculate Normalized ALR.`);

        normalizedAlrExplanation.map((each, eachIndex) => {
            explanationArr.push(each);
        });

        explanationArr.push("\n")
        explanationArr.push(`Step 4: Calculate Normalized CLR.`);

        normalizedClrExplanation.map((each, eachIndex) => {
            explanationArr.push(each);
        });

        explanationArr.push("\n")
        explanationArr.push(`Step 5: Calculate composite score: a weighted sum of acute and chronic load scores.`);

        compositeArrExplanation.forEach((each, eachIndex) => {
            explanationArr.push(each);
        })

        timeObj.shifts.sort((a, b) => {
            if (Number(a.composite) > Number(b.composite)) {
                return 1;
            }
            if (Number(a.composite) < Number(b.composite)) {
                return -1;
            }
            return 0;
        });

        explanationArr.push("\n")
        explanationArr.push("Step 6: Generate the order based on composite score, with roles having the lowest composite score being prioritized first.");

        timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_TABLE[dropdownSelected].includes(each.name)) {
                explanationArr.push(`${each.name}: ${each.composite}`)
            }
        });

        const lessThan2Hours = [];
        const greaterThan2Hours = [];

        let hasAnyGreaterThan2Hours = false;

        timeObj.shifts.forEach((each, eachIndex) => {
            if (SHOW_ROWS_COPY[dropdownSelected].includes(each.name)) {
                if ((dropdownSelected == "19:00" && !window.Cypress && isXIn2Hours(each)) || (dropdownSelected == "19:00" && (each.chronicLoadRatio > CHRONIC_LOAD_RATIO_THRESHOLD_S4))) {
                    greaterThan2Hours.push(each);
                    hasAnyGreaterThan2Hours = true;
                } else {
                    lessThan2Hours.push(each);
                }
            }
        });
        greaterThan2Hours.sort((a, b) => {
            if (a.composite > b.composite) {
                return 1;
            } else if (a.composite < b.composite) {
                return -1;
            }
            return 0;
        });


        if (hasAnyGreaterThan2Hours) {
            explanationArr.push("\n")
            explanationArr.push("Step 7: Check if any roles have had 2 or more admissions in the last 2 hours. Then sort by composite score.");
            greaterThan2Hours && greaterThan2Hours.forEach((each) => {
                explanationArr.push(`${each.name}: had ${getXIn2Hours(each)} admissions in the last 2 hours /  Composite Score: ${each.composite}`);
            })
        }


        let shiftsCombined = lessThan2Hours.concat(greaterThan2Hours);


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
            // explanationArr.push("\n");
            // explanationArr.push("7PM High Chronic Load Scenario. If S3 or S4 has number of admission of 6 or N5 has number of admissions of 3+, then repeat (N1-N4)x2 and then insert at the end.");

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
                if (dropdownSelected == "17:00") {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6)) {

                    } else {
                        array2.push(innerEach);
                    }
                } else if (dropdownSelected == "19:00") {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {

                    } else {
                        array2.push(innerEach);
                    }
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
                if (dropdownSelected == "17:00") {
                    if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5) ||
                        (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3)) {
                        // explanationArr.push(getFormattedOutputCompositeScore2(innerEach));
                    } else {
                        array1.push(innerEach);
                    }
                } else if (dropdownSelected == "19:00") {
                    if ((innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 6) ||
                        (innerEach.name == "S4" && Number(innerEach.numberOfAdmissions) == 5) ||
                        (innerEach.name == "N5" && Number(innerEach.numberOfAdmissions) >= 3) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                        // explanationArr.push(getFormattedOutputCompositeScore2(innerEach));
                    } else {
                        array1.push(innerEach);
                    }
                }

            })

            /* Step 2: Create Array 2 but copying over from Array 1*/
            // shiftsCombined = array1.concat(array2);

            setArray1(array1 && array1.map((each) => { return each.name }));
            setArray2(array2 && array2.map((each) => { return each.name }));
            const combinedArr = array1.concat(array2);
            shiftsCombined = combinedArr;
        } else if (scenario2) {
            // explanationArr.push("\n");
            // explanationArr.push("7PM High Chronic Load Scenario. If S4 has number of admissions of 5, then N1-N4, N1>N2>S4>N3>N4");

            /* If S4 has number of admissions of 5, then remove S4 from Array 1. This means that we have to copy Array 1 to Array 2. */
            const array1 = [];
            const array2 = [];
            let getS4 = {};
            shiftsCombined.forEach((innerEach, innerEachIndex) => {
                if (dropdownSelected == "17:00") {
                    if (innerEach.name == "S4") {
                        // explanationArr.push(getFormattedOutputCompositeScore2(innerEach))
                        getS4 = innerEach;
                    } else if (innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) {
                        array1.push(innerEach);
                    } else if (innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) {
                        array2.push(innerEach);
                    } else {
                        array1.push(innerEach);
                        array2.push(innerEach);
                    }
                } else if (dropdownSelected == "19:00") {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else if (innerEach.name == "S4") {
                        // explanationArr.push(getFormattedOutputCompositeScore2(innerEach))
                        getS4 = innerEach;
                    } else if (innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) {
                        array1.push(innerEach);
                    } else if (innerEach.name == "S3" && Number(innerEach.numberOfAdmissions) == 6) {
                        array2.push(innerEach);
                    } else {
                        array1.push(innerEach);
                        array2.push(innerEach);
                    }
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
            // explanationArr.push("\n");
            const array1 = [];
            let getS3 = {};
            shiftsCombined.forEach((innerEach, innerEachIndex) => {
                if (dropdownSelected == "17:00") {
                    if (innerEach.name == "S3") {
                        getS3 = innerEach;
                    } else {
                        array1.push(innerEach);
                    }
                } else if (dropdownSelected == "19:00") {
                    if (Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else if (innerEach.name == "S3") {
                        getS3 = innerEach;
                    } else {
                        array1.push(innerEach);
                    }
                }

            });
            const array2 = [];
            const copyArray2 = [...array1];
            copyArray2.forEach((innerEach, innerEachIndex) => {
                if (dropdownSelected == "17:00") {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6)) {
                    } else {
                        array2.push(innerEach);
                    }
                } else if (dropdownSelected == "19:00") {
                    if ((innerEach.name == "S2" && Number(innerEach.numberOfAdmissions) == 6) ||
                        Number(innerEach.numberOfAdmissions) > NUMBER_OF_ADMISSIONS_CAP) {
                    } else {
                        array2.push(innerEach);
                    }
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
                if (dropdownSelected == "17:00") {
                    if (window.location.hostname === 'localhost') {
                        orderOfAdmissions.push(`${each.name}(${each.normalizedAlr},${each.normalizedClr},${each.composite})`)
                    } else {
                        orderOfAdmissions.push(each.name);

                    }
                } else if (dropdownSelected == "19:00") {
                    if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                        if (window.location.hostname === 'localhost') {
                            orderOfAdmissions.push(`${each.name}(${each.normalizedAlr},${each.normalizedClr},${each.composite})`)

                        } else {
                            orderOfAdmissions.push(each.name);

                        }

                    }
                }

            }
        });
        if (shiftsCombined && shiftsCombined.length == 0) {
            shiftsCombined = timeObj.shifts;
        }

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
            const timeDiff = getTimeDifference(each.timestamp);;

            each["startTime"] = dropdown;
            each["minutesWorkedFromStartTime"] = getMinutesWorkedFromStartTime(each);
            each["numberOfHoursWorked"] = getNumberOfHoursWorked(each);
            each["chronicLoadRatio"] = getChronicLoadRatio(each);
            each["difference"] = timeDiff;
            each["alr"] = getAlr(each, each.difference);
            each["clr"] = getClr(each);
            each["normalizedAlr"] = getNormalizedAlr(each, each.alr);
            each["normalizedClr"] = getNormalizedClr(each, each.clr)
            each["composite"] = getComposite(each, each.normalizedAlr, each.normalizedClr);
            return each;
        });

        newObj["startTime"] = dropdown;
        newObj["shifts"] = updatedShifts ? updatedShifts : [];

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


    const getTimeDifference = (time1) => {

        if (time1) {
            const time2 = dropdown;
            // Convert times to minutes
            const [hours1, minutes1] = time1.split(':').map(Number);
            const [hours2, minutes2] = time2.split(':').map(Number);

            const totalMinutes1 = hours1 * 60 + minutes1;
            const totalMinutes2 = hours2 * 60 + minutes2;

            // Calculate difference in minutes
            let diffMinutes = totalMinutes2 - totalMinutes1;

            return diffMinutes;

        } else {
            return 0;
        }

    }

    const getAlr = (each, difference, dropdownSelected) => {
        let p95 = "";
        if (dropdownSelected == "19:00") {
            p95 = config.P95_7PM;
        } else if (dropdownSelected == "17:00") {
            p95 = config.P95_5PM;
        }

        let fixedDiff = difference;
        if (difference > p95) {
            fixedDiff = p95;
        }
        let increaseAlr = 0;
        if (!window.Cypress && dropdownSelected == "19:00") {
            if (each.name == "N5" && each.numberOfAdmissions > 1) {
                increaseAlr = Number(each.numberOfAdmissions) - 1;
            } else {
                lastSaved5Pm && lastSaved5Pm.shifts && lastSaved5Pm.shifts.forEach((fivePm, eachIndex) => {
                    if (each.name == fivePm.name) {
                        if (fivePm.numberOfAdmissions !== "" && (Number(fivePm.numberOfAdmissions)) + 2 <= Number(each.numberOfAdmissions)) {
                            increaseAlr = Number(each.numberOfAdmissions) - Number(fivePm.numberOfAdmissions) - 1;
                        }
                    }
                })
            }

        }

        const originalAlr = Number(1 - (fixedDiff) / p95);
        const updatedAlr = originalAlr + increaseAlr;
        return updatedAlr.toFixed(3);
    }
    const getClr = (each, dropdownSelected) => {
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

    const getComposite = (each, normalizedAlr, normalizedClr, dropdownSelected) => {
        const alr_f = dropdownSelected == "17:00" ? config.ALR_5PM : config.ALR_7PM;
        const clr_f = dropdownSelected == "17:00" ? config.CLR_5PM : config.CLR_7PM;

        let res = ((alr_f * Number(normalizedAlr)) + (clr_f * Number(normalizedClr))).toFixed(3);
        if (dropdownSelected == "17:00") {
            if (each.name == "N5") {
                res = config.CONSTANT_COMPOSITE_5PM_N5;
                return config.CONSTANT_COMPOSITE_5PM_N5;
            }
        }

        else if (dropdownSelected == "19:00") {
            if (each.name == "N1") {
                res = config.CONSTANT_COMPOSITE_7PM_N1;
                return config.CONSTANT_COMPOSITE_7PM_N1;
            } else if (each.name == "N2") {
                res = config.CONSTANT_COMPOSITE_7PM_N2;
                return config.CONSTANT_COMPOSITE_7PM_N2;
            } else if (each.name == "N3") {
                res = config.CONSTANT_COMPOSITE_7PM_N3;
                return config.CONSTANT_COMPOSITE_7PM_N3;
            } else if (each.name == "N4") {
                res = config.CONSTANT_COMPOSITE_7PM_N4;
                return config.CONSTANT_COMPOSITE_7PM_N4;
            }
        }
        return Number(res).toFixed(3);
    }

    const getNormalizedAlr = (each, alrx, dropdownSelected) => {
        let p95_alr = "";
        if (dropdownSelected == "17:00") {
            p95_alr = 1.00;
        } else if (dropdownSelected == "19:00") {
            p95_alr = 1.00;
        }

        const normalizedAlr = Number(alrx) / p95_alr;
        return Number(normalizedAlr).toFixed(3);
    }
    const getNormalizedClr = (each, clrx, dropdownSelected) => {
        let p95_clr = "";
        if (dropdownSelected == "17:00") {
            p95_clr = 1.00;
        } else if (dropdownSelected == "19:00") {
            p95_clr = 1.00;
        }

        const normalizedAlr = clrx / p95_clr;
        return Number(normalizedAlr).toFixed(3);
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
                                const allAdmissionsDataShiftsx = res.transaction.admissionsObj.allAdmissionsDataShifts;
                                const lastSavedTime = res.transaction.localDateTime;
                                // if (allAdmissionsDataShiftsx) {
                                //     setAllAdmissionsDataShifts(allAdmissionsDataShiftsx);
                                // }

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
                                setSortRoles(allAdmissionsDataShiftsx, startTime, lastSavedTime);
                                sortMain(allAdmissionsDataShiftsx, startTime)
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

                if (dropdown == "17:00") {
                    if (each.numberOfHoursWorked + "" !== "0") {
                        sortRoles.push(getFormattedOutput(each));
                    }
                    if (Number(each.numberOfAdmissions) <= NUMBER_OF_ADMISSIONS_CAP) {
                        sortRolesNameOnly.push(`${each.name}(${each.chronicLoadRatio})`);
                    }
                } else if (dropdown == "19:00") {
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

            }
        });

        sortRoles.push(`${sortRolesNameOnly.join(">")}`);

        return timeObjShifts;
    }

    const handleGenerateQueue = (e) => {
        setClickedGenerateQueue(true);
        const orderOfAdmissions_ = sortMain(allAdmissionsDataShifts, dropdown);

        addTransaction(
            { allAdmissionsDataShifts, startTime: dropdown },
            orderOfAdmissions_
        );

        const fetchRecentTransaction = async () => {
            const result = await getMostRecentTransaction(allAdmissionsDataShifts.startTime);

            if (result.success) {
                setLastSaved(result.transaction.localDateTime);
                setAllAdmissionsDataShifts(allAdmissionsDataShifts);
                setDropdown(dropdown);

                if (dropdown == "17:00") {
                    setLastSaved5Pm(result.transaction.admissionsObj.allAdmissionsDataShifts);
                }
            }
        };
        fetchRecentTransaction();

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
                <h1 className="title">S.A.D.Q. Beta</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
            </div>

            {loading ? <div className="loading">
                <div className="spinner">
                    {/* Loading... */}
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            </div> :
                <div className="container">
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
                    <button
                        onClick={() => setOpenTable(!openTable)}
                        className="expand"
                    >
                        {openTable ? "Minimize Table ⬆️" : "Expand Table ⬇️"}
                    </button>
                    <table id="screenshotimg">

                        <table id="reacttable">
                            <thead>
                                {openTable ? (
                                    <tr>
                                        {MINIMIZE_TABLE_STATIC_COMPOSITE_WEB.map((each, eachIndex) => {
                                            if (each[0] == "name") {
                                                return (
                                                    <th className={"th_10percent"} key={eachIndex}>{each[1]}</th>
                                                );
                                            } else if (each[0] == "timestamp" || each[0] == "numberOfAdmissions" || each[0] == "chronicLoadRatio") {
                                                return (
                                                    <th className="th_25percent" key={eachIndex}>{each[1]}</th>
                                                );
                                            }
                                            return (<th key={eachIndex}>{each[1]}</th>);
                                        })}
                                    </tr>
                                ) : isMobileDevice() ? (
                                    <tr>
                                        {MINIMIZE_TABLE_STATIC_COMPOSITE_MOBILE.map((each, eachIndex) => {
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
                                        {MINIMIZE_TABLE_STATIC_COMPOSITE_MOBILE.map((each, eachIndex) => {
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
                                                        {/* {openTable && (
                                                            <td>
                                                                <input name="shiftTimePeriod" value={admission.shiftTimePeriod} type="text" disabled={true} />
                                                            </td>
                                                        )} */}
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
                                                        <td className="usercanedit cell-with-number" tabIndex={-1} onKeyDown={(e) => handleKeyDown(e, index)}>
                                                            <span className="small-number">{getXIn2Hours(admission)}</span>
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
                                                        {openTable &&
                                                            <td className="backgroundlightgray">
                                                                <div className="progress-cell">
                                                                    <div className="progress-container">
                                                                        <div
                                                                            className="progress-bar"
                                                                            style={{
                                                                                width: `${(admission.normalizedAlr || 0) * 100}%`,
                                                                                background: (admission.normalizedAlr || 0) > 0.5
                                                                                    ? "linear-gradient(to right, #1a0dab, #1a0dab)" /* Red gradient */
                                                                                    : "linear-gradient(to right,  #1a0dab, #1a0dab)" /* Green gradient */
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className="progress-text">
                                                                        {admission.normalizedAlr ? Number(admission.normalizedAlr).toFixed(2) : ""}
                                                                    </span>
                                                                </div>
                                                            </td>}

                                                        {<td className="backgroundlightgray">
                                                            <div className="progress-cell">
                                                                <div className="progress-container">
                                                                    <div
                                                                        className="progress-bar"
                                                                        style={{
                                                                            width: `${(admission.clr || 0) * 100}%`,
                                                                            background: (admission.clr || 0) > 0.5
                                                                                ? "linear-gradient(to right, #1a0dab, #1a0dab)" /* Red gradient */
                                                                                : "linear-gradient(to right,  #1a0dab, #1a0dab)" /* Green gradient */
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="progress-text">
                                                                    {openTable ? Number(admission.clr).toFixed(2) : `${Math.round((admission.clr || 0) * 100)}%`}
                                                                </span>
                                                            </div>
                                                        </td>}
                                                        {false && openTable && (
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
                                                        {openTable &&
                                                            <td className="backgroundlightgray">
                                                                <div className="progress-cell">
                                                                    <div className="progress-container">
                                                                        <div
                                                                            className="progress-bar"
                                                                            style={{
                                                                                width: `${(admission.composite || 0) * 100}%`,
                                                                                background: (admission.composite || 0) > 0.5
                                                                                    ? "linear-gradient(to right, #1a0dab, #1a0dab)" /* Red gradient */
                                                                                    : "linear-gradient(to right,  #1a0dab, #1a0dab)" /* Green gradient */
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className="progress-text">
                                                                        {admission.composite ? Number(admission.composite).toFixed(2) : ""}
                                                                    </span>
                                                                </div>
                                                            </td>}
                                                    </tr>
                                                )
                                            );
                                        }
                                    })}
                            </tbody>
                        </table>
                        <p className="endoutputcenter" id="orderofadmissions_title">{`Order of Admits ${lastSaved.split(" ")[0] + " " + convertTo12HourFormatSimple(dropdown)}`}</p>
                        {window.location.hostname === 'localhost' && (originalAlgorithm) ?
                            <p className="endoutputcenter" id="orderofadmissions_output">
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

                        {/* Part 2: Explanation */}
                        <button className="explanation" onClick={() => {
                            setShow2(!show2);
                        }
                        }>{!show2 ? "> Step by Step Details" : "< Step by Step Details"}</button><br></br>

                        {show2 && <div id="stepbystepdetails">
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
                        }>{!show4 ? "> Set Algorithm" : "< Set Algorithm"}</button><br></br>

                        {show4 &&
                            <div>

                                <div>
                                    <input
                                        id="originalAlgorithmCheckbox"
                                        placeholder="Original Algorithm"
                                        className="input-left"
                                        label=""
                                        type="checkbox"
                                        onChange={(e) => {
                                            setOriginalAlgorithm(e.target.checked);
                                        }}
                                    />
                                    <label for="originalAlgorithm">Original Algorithm v1.0</label>
                                </div>

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
                         <div className="footer">
                        {/* <img
                            alt="copy button"
                            className="githubbutton"
                            src={githublogo}
                            onClick={(ev) => {
                                window.open("https://github.com/sadqueue/sad/tree/main", '_blank');
                            }} /> */}
                        <p className="footer-text">&copy; {new Date().getFullYear()} Genki MD LLC</p>
                        <p className="footer-text">All rights reserved. Licensed use only.</p>
                        <p className="footer-text">This tool is for workflow support only. Providers are responsible for final admission and care decisions.</p>
                    </div>
                    </div>
                </div>}
        </div>
    )

}

export default App;