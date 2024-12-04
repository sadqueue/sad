export const THRESHOLD = 90;

export const START_TIMES = [
    { value: "FOURPM", label: "4PM" },
    { value: "FIVEPM", label: "5PM" },
    { value: "SEVENPM", label: "7PM" }
];

export const SHIFT_TYPES = [
    {
        type: "S1",
        start: "10:00",
        end: "20:00"
    },
    {
        type: "S2",
        start: "11:00",
        end: "21:00"
    },
    {
        type: "S3",
        start: "13:00",
        end: "23:00"
    },
    {
        type: "S4",
        start: "14:00",
        end: "00:00"
    },
    {
        type: "N5",
        start: "17:00",
        end: "05:00"
    },
    {
        type: "DA",
        start: "07:00",
        end: "19:00"
    }
];

export const FOURPM = [
    {
        shiftType: "16:00",
        admissionsId: '01',
        name: 'DA',
        displayName: 'DA (7AM-7PM)',
        numberOfAdmissions: "6",
        timestamp: '14:35',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "16:00",
        admissionsId: '02',
        name: 'S1',
        displayName: 'S1 (10AM-8PM)',
        numberOfAdmissions: "5",
        timestamp: '15:45',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "16:00",
        admissionsId: '03',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '13:30',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "16:00",
        admissionsId: '04',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '14:30',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "16:00",
        admissionsId: '05',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '14:00',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    }
];

export const FIVEPM = [
    {
        shiftType: "17:00",
        admissionsId: '01',
        name: 'S1',
        displayName: 'S1 (10AM-8PM)',
        numberOfAdmissions: "4",
        timestamp: '15:17',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "17:00",
        admissionsId: '02',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '15:28',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "17:00",
        admissionsId: '03',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '15:31',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "17:00",
        admissionsId: '04',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '15:45',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "17:00",
        admissionsId: '05',
        name: 'N5',
        displayName: 'N5 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '15:30',
        numberOfHoursWorked: "",
        chronicLoadRatio: "0.55",
        isStatic: true
    }
];

export const SEVENPM = [
    {
        shiftType: "19:00",
        admissionsId: '01',
        name: 'S2',
        displayName: 'S2 (11AM-9PM)',
        numberOfAdmissions: "3",
        timestamp: '18:28',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "19:00",
        admissionsId: '02',
        name: 'S3',
        displayName: 'S3 (1PM-11PM)',
        numberOfAdmissions: "2",
        timestamp: '18:31',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "19:00",
        admissionsId: '03',
        name: 'S4',
        displayName: 'S4 (2PM-12AM)',
        numberOfAdmissions: "1",
        timestamp: '18:45',
        numberOfHoursWorked: "",
        chronicLoadRatio: ""
    },
    {
        shiftType: "19:00",
        admissionsId: '04',
        name: 'N1',
        displayName: 'N1 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '17:30',
        numberOfHoursWorked: "",
        chronicLoadRatio: "0.55",
        isStatic: true
    },
    {
        shiftType: "19:00",
        admissionsId: '05',
        name: 'N2',
        displayName: 'N2 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '18:00',
        numberOfHoursWorked: "",
        chronicLoadRatio: "0.70",
        isStatic: true
    },
    {
        shiftType: "19:00",
        admissionsId: '06',
        name: 'N3',
        displayName: 'N3 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '18:30',
        numberOfHoursWorked: "",
        chronicLoadRatio: "0.85",
        isStatic: true
    },
    {
        shiftType: "19:00",
        admissionsId: '07',
        name: 'N4',
        displayName: 'N4 (5PM-5AM)',
        numberOfAdmissions: "0",
        timestamp: '19:00',
        numberOfHoursWorked: "",
        chronicLoadRatio: "1.00",
        isStatic: true
    }
];

export const FOURPM_DATA = {
    shifts: FOURPM,
    startTime: "16:00",
    startTimeFormatted: "4PM"
}
export const FIVEPM_DATA = {
    shifts: FIVEPM,
    startTime: "17:00",
    startTimeFormatted: "5PM"
}
export const SEVENPM_DATA = {
    shifts: SEVENPM,
    startTime: "19:00",
    startTimeFormatted: "7PM"
}