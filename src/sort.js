import './App.css';
import React from "react";
import moment from "moment";
import { FIVEPM, SEVENPM, FOURPM, SHIFT_TYPES, START_TIMES } from './constants';

export const getNumberOfHoursWorked = (name, timestamp, selectedStartTime) => {
    let startTime = "";
    SHIFT_TYPES.forEach((shift, shiftIndex) => {
        if (shift.type == name){
            startTime = shift.start;
        }
    });
    
    const timeDifference = moment(selectedStartTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), "hours", true).toFixed();
    return timeDifference;
}

export const getChronicLoadRatio = (name, numberOfAdmissions, timestamp, selectedStartTime) => {
    const timeDifference = getNumberOfHoursWorked(name, timestamp, selectedStartTime);
    const chronicLoadRatio = (Number(numberOfAdmissions) / (timeDifference)).toFixed(2);

    return chronicLoadRatio;
}

export const sortByTimeStamp = (admissionsData) => {
    admissionsData.sort(function (a, b) {
        return a.timestamp.localeCompare(b.timestamp);
    });
}

export const sortByChronicLoadAndAcuteLoad = (admissionsData, selectedStartTime) => {
    admissionsData.sort(function (a, b)  {
        const loadA = getChronicLoadRatio(a.name, a.numberOfAdmissions, a.timestamp, selectedStartTime);
        const loadB = getChronicLoadRatio(b.name, b.numberOfAdmissions, b.timestamp, selectedStartTime);
        return loadA - loadB;
    });
    const sortRoles = [];
    admissionsData.map((each, eachIndex) => {
        sortRoles.push(each.name);
    })
    return sortRoles.join(", ");
}
