
<p align="center"><img width="244" alt="Screenshot 2024-12-10 at 1 09 14 PM" src="https://github.com/user-attachments/assets/1ea87648-9a46-48fe-a720-338a2c429fd0"></p>

<h1 align="center">S.A.D. Queue (Standardized Admissions Distribution)</h1>

<h2>Purpose</h2>
Purpose of this UI tool is for hospitalists to generate the order of admissions at a certain timestamp. User can click the dropdown and select a timestamp. The options are 4PM, 5PM, 7PM or a custom time the user can select.

<h2>Example Screenshots</h2>

<h3>Scenario 1: 4:00PM Scenario</h3>
<p><img width="700" alt="Screenshot 2024-12-10 at 12 50 14 PM" src="https://github.com/user-attachments/assets/e38e97eb-e736-4c4c-b1d7-092fd7e95383"></p>

<h3>Scenario 2: 5:00PM Scenario</h3>
<p><img width="704" alt="Screenshot 2024-12-10 at 12 50 33 PM" src="https://github.com/user-attachments/assets/eb61b760-c5a0-4ca4-b26d-dcd58b35d7fe"></p>

<h3>Scenario 3: 7:00PM Scenario</h3>
<p><img width="704" alt="Screenshot 2024-12-10 at 12 50 43 PM" src="https://github.com/user-attachments/assets/35578c6c-e30a-4fad-a2d8-ee8377404977"></p>

<h3>Scenario 4: Custom Time Scenario</h3>
<p><img width="717" alt="Screenshot 2024-12-10 at 12 51 27 PM" src="https://github.com/user-attachments/assets/7af45ead-03aa-4686-b8b0-73ad831b6a41"></p>

<h2>Formula Used</h2>
The logic behind the formula is based on the following. 

```
export const SCORE_NEW_ROLE = {
    "16:00": [],
    "17:00": ["N5"],
    "19:00": ["N1", "N2", "N3", "N4"]
};
```

1. For the time and roles listed in SCORE_NEW_ROLE, this is the formula used.

```
180-(minutes worked so far) / 180
```

2. For the time and roles that is not listed in SCORE_NEW_ROLE, this is the formula used.

```
weight = 0.3
weight * chronic load ratio + (1-weight) * (180-(minutes worked so far) / 180)
```

For the above 2 scenarios, code implementation is shown below.

```
if (SCORE_NEW_ROLE[each.startTime] && SCORE_NEW_ROLE[each.startTime].includes(each.name)) {
    explanationArr.push(`Role ${each.name}: (180 - ${each.minutesWorkedFromStartTime}) / 180 = ${each.score}`);
} else {
    explanationArr.push(`Role ${each.name}: (${weight} * ${each.chronicLoadRatio}) + (${(1 - weight).toFixed(3)} * (180 - ${each.minutesWorkedFromStartTime}) / 180) = ${each.score}`);
}
```

For more details on the UI, click "Expand" button to see the formula used for each role.            
<p><img width="598" alt="Screenshot 2024-12-10 at 12 53 29 PM" src="https://github.com/user-attachments/assets/74f9c7f4-75fb-453d-bfe5-0e2ce874253b"></p>

