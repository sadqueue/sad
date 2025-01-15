export const THRESHOLD = 90;
export const CHRONIC_LOAD_RATIO_THRESHOLD = 0.66;
export const CHRONIC_LOAD_RATIO_THRESHOLD_S4 = 0.67;
export const CHRONIC_LOAD_RATIO_THRESHOLD_N1_N2_N3_N4 = 0.87;
export const CHRONIC_LOAD_RATIO_THRESHOLD_N5 = 0.87;
export const NUMBER_OF_ADMISSIONS_CAP = 7;

export const TIME_FORMAT = "h:mmA"; //hh:mm for non military

export const ROLE_ORDER = ["DA", "S1", "S2", "S3", "S4", "N5", "N1", "N2", "N3", "N4"];

export const DATA_TYPE_INT = [
    "admissionsId",
    "chronicLoadRatio",
    "minutesWorkedFromStartTime",
    "numberOfAdmissions",
    "numberOfHoursWorked",
    "score",
];

export const SHOW_ROWS_TABLE = {
    "16:00": ["DA", "S1", "S2", "S3", "S4"],
    "17:00": ["S1", "S2", "S3", "S4"],
    "19:00": ["S2", "S3", "S4", "N5"]
}

export const SHOW_ROWS_COPY = {
    "16:00": ["DA", "S1", "S2", "S3", "S4"],
    "17:00": ["S1", "S2", "S3", "S4", "N5"],
    "19:00": ["S2", "S3", "S4", "N5", "N1", "N2", "N3", "N4"]
}

export const DATA_TYPE_TIME = [
    "startTime",
    "timestamp"
];

export const EXPAND_TABLE = [
    ["name", "Role"],
    ["shiftTimePeriod", "Shift Time Period"],
    ["timestamp", "Last Admission Time"],
    ["numberOfAdmissions", "Number of Admissions"],
    ["chronicLoadRatio", "Chronic Load Ratio"],
    ["numberOfHours", "# Hours Worked"],
    ["score", "Composite Score"]
];

export const MINIMIZE_TABLE = [
    ["name", "Role"],
    ["timestamp", "Last Admission Time"],
    ["numberOfAdmissions", "Number of Admissions"],
    ["chronicLoadRatio", "Chronic Load Ratio"]
];

export const SCORE_NEW_ROLE = {
    "16:00": [],
    "17:00": ["N5"],
    "19:00": ["N1", "N2", "N3", "N4"]
};

export const STATIC_TIMES = ["16:00", "17:00", "19:00"];

export const START_TIMES = [
    { value: "16:00", label: "4:00PM" },
    { value: "17:00", label: "5:00PM" },
    { value: "19:00", label: "7:00PM" },
    // { value: "CUSTOM", label: "Custom " }
];

export const SHIFT_TYPES = [
    {
        admissionsId: "1",
        name: "DA",
        start: "07:00",
        end: "19:00",
        displayStartTimeToEndTime: "(7AM-7PM)",
        startWithThreshold: "05:30",
        endWithThreshold: "17:00",
        shiftTimePeriod: "7AM-7PM",
        timestamp: "14:30"
    },
    {
        admissionsId: "2",
        name: "S1",
        start: "10:00",
        end: "20:00",
        displayStartTimeToEndTime: "(10AM-8PM)",
        startWithThreshold: "08:30",
        endWithThreshold: "18:30",
        shiftTimePeriod: "10AM-8PM",
        timestamp: "14:30"
    },
    {
        admissionsId: "3",
        name: "S2",
        start: "11:00",
        end: "21:00",
        displayStartTimeToEndTime: "(11AM-9PM)",
        startWithThreshold: "09:30",
        endWithThreshold: "19:30",
        shiftTimePeriod: "11AM-9PM",
        timestamp: "14:30"
    },
    {
        admissionsId: "4",
        name: "S3",
        start: "13:00",
        end: "23:00",
        displayStartTimeToEndTime: "(1PM-11PM)",
        startWithThreshold: "11:30",
        endWithThreshold: "21:30",
        shiftTimePeriod: "1PM-11PM",
        timestamp: "14:30"
    },
    {
        admissionsId: "5",
        name: "S4",
        start: "14:00",
        end: "00:00",
        displayStartTimeToEndTime: "(2PM-12AM)",
        startWithThreshold: "12:30",
        endWithThreshold: "22:30",
        shiftTimePeriod: "2PM-12AM",
        timestamp: "14:30"
    },
    {
        admissionsId: "6",
        name: "N5",
        start: "17:00",
        end: "05:00",
        displayStartTimeToEndTime: "(5PM-5AM)",
        startWithThreshold: "15:30",
        endWithThreshold: "03:30",
        shiftTimePeriod: "5PM-5AM",
        timestamp: "15:30"
    },
    {
        admissionsId: "7",
        name: "N1",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30",
        shiftTimePeriod: "7PM-7AM",
        timestamp: "17:30"
    },
    {
        admissionsId: "8",
        name: "N2",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30",
        shiftTimePeriod: "7PM-7AM",
        timestamp: "18:00"
    },
    {
        admissionsId: "9",
        name: "N3",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30",
        shiftTimePeriod: "7PM-7AM",
        timestamp: "18:30"
    },
    {
        admissionsId: "10",
        name: "N4",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30",
        shiftTimePeriod: "7PM-7AM",
        timestamp: "19:00"
    }
];

export const FOURPM = [
    {
        admissionsId: "1",
        name: "DA",
        shiftTimePeriod: "7AM-7PM", 
        displayName: "DA (7AM-7PM)",
        roleStartTime: "07:00",
        numberOfAdmissions: "5",
        timestamp: "14:30"
    },
    {
        admissionsId: "2",
        name: "S1",
        shiftTimePeriod: "10AM-8PM",
        displayName: "S1 (10AM-8PM)",
        roleStartTime: "10:00",
        numberOfAdmissions: "3",
        timestamp: "14:30"
    },
    {
        admissionsId: "3",
        name: "S2",
        shiftTimePeriod: "11AM-9PM",
        displayName: "S2 (11AM-9PM)",
        roleStartTime: "11:00",
        numberOfAdmissions: "3",
        timestamp: "14:30"
    },
    {
        admissionsId: "4",
        name: "S3",
        shiftTimePeriod: "1PM-11PM",
        displayName: "S3 (1PM-11PM)",
        roleStartTime: "13:00",
        numberOfAdmissions: "1",
        timestamp: "14:30"
    },
    {
        admissionsId: "5",
        name: "S4",
        shiftTimePeriod: "2PM-12AM",
        displayName: "S4 (2PM-12AM)",
        roleStartTime: "14:00",
        numberOfAdmissions: "1",
        timestamp: "14:30"
    }
];

export const FIVEPM = [
    {
        admissionsId: "1",
        name: "S1",
        shiftTimePeriod: "10AM-8PM",
        displayName: "S1 (10AM-8PM)",
        roleStartTime: "10:00",
        numberOfAdmissions: "4",
        timestamp: "15:30"
    },
    {
        admissionsId: "2",
        name: "S2",
        shiftTimePeriod: "11AM-9PM",
        displayName: "S2 (11AM-9PM)",
        roleStartTime: "11:00",
        numberOfAdmissions: "3",
        timestamp: "15:30"
    },
    {
        admissionsId: "3",
        name: "S3",
        shiftTimePeriod: "1PM-11PM",
        displayName: "S3 (1PM-11PM)",
        roleStartTime: "13:00",
        numberOfAdmissions: "3",
        timestamp: "15:30"
    },
    {
        admissionsId: "4",
        name: "S4",
        shiftTimePeriod: "2PM-12AM",
        displayName: "S4 (2PM-12AM)",
        roleStartTime: "14:00",
        numberOfAdmissions: "2",
        timestamp: "15:30"
    },
    {
        admissionsId: "5",
        name: "N5",
        shiftTimePeriod: "5PM-5AM",
        displayName: "N5 (5PM-5AM)",
        roleStartTime: "17:00",
        numberOfAdmissions: "",
        timestamp: "",
        isStatic: true
    }
];

export const SEVENPM = [
    {
        admissionsId: "1",
        name: "S2",
        shiftTimePeriod: "11AM-9PM",
        displayName: "S2 (11AM-9PM)",
        roleStartTime: "11:00",
        numberOfAdmissions: "5",
        timestamp: "17:30"
    },
    {
        admissionsId: "2",
        name: "S3",
        shiftTimePeriod: "1PM-11PM",
        displayName: "S3 (1PM-11PM)",
        roleStartTime: "13:00",
        numberOfAdmissions: "4",
        timestamp: "17:30"
    },
    {
        admissionsId: "3",
        name: "S4",
        shiftTimePeriod: "2PM-12AM",
        displayName: "S4 (2PM-12AM)",
        roleStartTime: "14:00",
        numberOfAdmissions: "3",
        timestamp: "17:30"
    },
    {
        admissionsId: "8",
        name: "N5",
        shiftTimePeriod: "5PM-5AM",
        displayName: "N5 (5PM-5AM)",
        roleStartTime: "17:00",
        numberOfAdmissions: "1",
        timestamp: "17:30"
    },
    {
        admissionsId: "4",
        name: "N1",
        shiftTimePeriod: "7PM-7AM",
        displayName: "N1 (7PM-7AM)",
        roleStartTime: "19:00",
        numberOfAdmissions: "",
        timestamp: "",
        isStatic: true
    },
    {
        admissionsId: "5",
        name: "N2",
        shiftTimePeriod: "7PM-7AM",
        displayName: "N2 (7PM-7AM)",
        roleStartTime: "19:00",
        numberOfAdmissions: "",
        timestamp: "",
        isStatic: true
    },
    {
        admissionsId: "6",
        name: "N3",
        shiftTimePeriod: "7PM-7AM",
        displayName: "N3 (7PM-7AM)",
        roleStartTime: "19:00",
        numberOfAdmissions: "",
        timestamp: "",
        isStatic: true
    },
    {
        admissionsId: "7",
        name: "N4",
        shiftTimePeriod: "7PM-7AM",
        displayName: "N4 (7PM-7AM)",
        roleStartTime: "19:00",
        numberOfAdmissions: "",
        timestamp: "",
        isStatic: true
    }
];

export const FOURPM_DATA = {
    shifts: FOURPM,
    startTime: "16:00"
}
export const FIVEPM_DATA = {
    shifts: FIVEPM,
    startTime: "17:00"
}
export const SEVENPM_DATA = {
    shifts: SEVENPM,
    startTime: "19:00"
}

export const CUSTOM_DATA = {
    isCustom: true,
    shifts: [],
    startTime: "12:00"
}

export const ADMISSIONS_FORMAT = "[Role] [Number of admits] / [Hours worked so far] [Last timestamp]"

export const COPIED_MSG_1 = "Welcome to the QAdmitters TT for admissions assignments. When it’s your turn, please like/claim your patient with your personalized emoji to close the loop (e.g., 🚀,🍕,❤️) and minimize texting/confusion. Reminder: please pre-screen and update group re: UHS, Kaiser, HHH, ICU, AMA, DC, EDP, borderline outpt non-admits and potential ICU. Mahalo!";