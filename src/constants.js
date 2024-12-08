/*
Scenario 4PM
1. All roles: 0.3 * chronic load ratio + 0.7 ((180-minutes since last admission)/180)

Scenario 5PM
1. N5: 180-minutes since last admission)/180 -- scoreForNewRole
2. S1-S4: 0.3 * chronic load ratio + 0.7 ((180-minutes since last admission)/180) -- scoreForCurrentRole

Scenario 7PM
1. N1-N4: 180-minutes since last admission)/180
2. N5: 0.3 * chronic load ratio + 0.7 ((180-minutes since last admission)/180)
*/
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

export const START_TIMES = [
    { value: "FOURPM", label: "4PM" },
    { value: "FIVEPM", label: "5PM" },
    { value: "SEVENPM", label: "7PM" }
];

export const SHIFT_TYPES = [
    {
        type: "S1",
        start: "10:00",
        end: "20:00",
        displayStartTimeToEndTime: "(10AM-8PM)"
    },
    {
        type: "S2",
        start: "11:00",
        end: "21:00",
        displayStartTimeToEndTime: "(11AM-9PM)"
    },
    {
        type: "S3",
        start: "13:00",
        end: "23:00",
        displayStartTimeToEndTime: "(1PM-11PM)"
    },
    {
        type: "S4",
        start: "14:00",
        end: "00:00",
        displayStartTimeToEndTime: "(2PM-12AM)"
    },
    {
        type: "N1",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)"
    },
    {
        type: "N2",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)"
    },
    {
        type: "N3",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)"
    },
    {
        type: "N4",
        start: "19:00",
        end: "07:00",
        displayStartTimeToEndTime: "(7PM-7AM)"
    },
    {
        type: "N5",
        start: "17:00",
        end: "05:00",
        displayStartTimeToEndTime: "(7PM-7AM)"
    },
    {
        type: "DA",
        start: "07:00",
        end: "19:00",
        displayStartTimeToEndTime: "(7PM-7AM)"
    }
];

export const FOURPM = [
    {
        admissionsId: '01',
        name: 'DA',
        displayName: 'DA (7AM-7PM)',
        numberOfAdmissions: "6",
        timestamp: '14:35'
    },
    {
        admissionsId: '02',
        name: 'S1',
        displayName: 'S1 (10AM-8PM)',
        numberOfAdmissions: "5",
        timestamp: '15:45'
    },
    {
        admissionsId: '03',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '13:30'
    },
    {
        admissionsId: '04',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '14:30'
    },
    {
        admissionsId: '05',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '14:00'
    }
];

export const FIVEPM = [
    {
        admissionsId: '01',
        name: 'S1',
        displayName: 'S1 (10AM-8PM)',
        numberOfAdmissions: "4",
        timestamp: '15:17'
    },
    {
        admissionsId: '02',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '15:28'
    },
    {
        admissionsId: '03',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '15:31'
    },
    {
        admissionsId: '04',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '15:45'
    },
    {
        admissionsId: '05',
        name: 'N5',
        displayName: 'N5 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '15:30',
        isStatic: true
    }
];

export const SEVENPM = [
    {
        admissionsId: '01',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '18:28'
    },
    {
        admissionsId: '02',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '18:31'
    },
    {
        admissionsId: '03',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '18:45'
    },
    {
        admissionsId: '04',
        name: 'N1',
        displayName: 'N1 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '17:30',
        isStatic: true
    },
    {
        admissionsId: '05',
        name: 'N2',
        displayName: 'N2 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '18:00',
        isStatic: true
    },
    {
        admissionsId: '06',
        name: 'N3',
        displayName: 'N3 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '18:30',
        isStatic: true
    },
    {
        admissionsId: '07',
        name: 'N4',
        displayName: 'N4 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '19:00',
        isStatic: true
    },
    {
        admissionsId: '08',
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