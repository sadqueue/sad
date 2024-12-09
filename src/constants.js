
export const THRESHOLD = 90;

export const MAX_FIELDS = [
    "Role", 
    "# of Admissions", 
    "Last Admission Time", 
    "Score", 
    "# Hours Worked", 
    "# Minutes Worked", 
    "Chronic Load Ratio",
    "Score"
];

export const MIN_FIELDS = [
    "Role", 
    "# of Admissions", 
    "Last Admission Time", 
    "Score", 
];

export const SCORE_NEW_ROLE = {
    "16:00": [],
    "17:00": ["N5"],
    "19:00": ["N1", "N2", "N3", "N4"]
};

export const STATIC_TIMES = ["16:00", "17:00", "19:00"];

export const START_TIMES = [
    { value: "FOURPM", label: "4PM" },
    { value: "FIVEPM", label: "5PM" },
    { value: "SEVENPM", label: "7PM" },
    { value: "CUSTOM", label: "Custom "}
];

export const SHIFT_TYPES = [
    {
        type: "S1",
        start: "10:00",
        end: "20:00",
        displayStartTimeToEndTime: "(10AM-8PM)",
        startWithThreshold: "08:30",
        endWithThreshold: "18:30"
    },
    {
        type: "S2",
        start: "11:00",
        end: "21:00",
        displayStartTimeToEndTime: "(11AM-9PM)",
        startWithThreshold: "09:30",
        endWithThreshold: "19:30"
    },
    {
        type: "S3",
        start: "13:00",
        end: "23:00",
        displayStartTimeToEndTime: "(1PM-11PM)",
        startWithThreshold: "11:30",
        endWithThreshold: "21:30"
    },
    {
        type: "S4",
        start: "14:00",
        end: "00:00",
        displayStartTimeToEndTime: "(2PM-12AM)",
        startWithThreshold: "12:30",
        endWithThreshold: "22:30"
    },
    {
        type: "N1",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30"
    },
    {
        type: "N2",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30"
    },
    {
        type: "N3",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30"
    },
    {
        type: "N4",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)",
        startWithThreshold: "17:30",
        endWithThreshold: "05:30"
    },
    {
        type: "N5",
        start: "17:00",
        end: "05:00",
        displayStartTimeToEndTime: "(5PM-5AM)",
        startWithThreshold: "15:30",
        endWithThreshold: "03:30"
    },
    {
        type: "DA",
        start: "07:00",
        end: "19:00",
        displayStartTimeToEndTime: "(7AM-7PM)",
        startWithThreshold: "05:30",
        endWithThreshold: "17:30"
    }
];

export const FOURPM = [
    {
        admissionsId: '1',
        name: 'DA',
        displayName: 'DA (7AM-7PM)',
        numberOfAdmissions: "6",
        timestamp: '14:35'
    },
    {
        admissionsId: '2',
        name: 'S1',
        displayName: 'S1 (10AM-8PM)',
        numberOfAdmissions: "5",
        timestamp: '15:45'
    },
    {
        admissionsId: '3',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '13:30'
    },
    {
        admissionsId: '4',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '14:30'
    },
    {
        admissionsId: '5',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '14:00'
    }
];

export const FIVEPM = [
    {
        admissionsId: '1',
        name: 'S1',
        displayName: 'S1 (10AM-8PM)',
        numberOfAdmissions: "4",
        timestamp: '15:17'
    },
    {
        admissionsId: '2',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '15:28'
    },
    {
        admissionsId: '3',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '15:31'
    },
    {
        admissionsId: '4',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '15:45'
    },
    {
        admissionsId: '5',
        name: 'N5',
        displayName: 'N5 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '15:30',
        isStatic: true
    }
];

export const SEVENPM = [
    {
        admissionsId: '1',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '18:28'
    },
    {
        admissionsId: '2',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '18:31'
    },
    {
        admissionsId: '3',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '18:45'
    },
    {
        admissionsId: '4',
        name: 'N1',
        displayName: 'N1 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '17:30',
        isStatic: true
    },
    {
        admissionsId: '5',
        name: 'N2',
        displayName: 'N2 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '18:00',
        isStatic: true
    },
    {
        admissionsId: '6',
        name: 'N3',
        displayName: 'N3 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '18:30',
        isStatic: true
    },
    {
        admissionsId: '7',
        name: 'N4',
        displayName: 'N4 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '19:00',
        isStatic: true
    },
    {
        admissionsId: '8',
        name: 'N5',
        displayName: 'N5 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '20:30'
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
    startTime: ""
}