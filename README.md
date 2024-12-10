
<p align="center"><img width="244" alt="Screenshot 2024-12-10 at 1 09 14 PM" src="https://github.com/user-attachments/assets/1ea87648-9a46-48fe-a720-338a2c429fd0"></p>

<h1 align="center">S.A.D. Queue (Standardized Admissions Distribution)</h1>

<h2>Purpose</h2>
Purpose of this UI tool is for hospitalists to generate the order of admissions at a certain timestamp. User can click the dropdown and select a timestamp. The options are 4PM, 5PM, 7PM or a custom time the user can select.

<h2>Example Screenshots</h2>

<h3>Scenario 1: 4:00PM Scenario</h3>
<p><img width="100%" alt="Screenshot 2024-12-10 at 12 50 14 PM" src="https://github.com/user-attachments/assets/e38e97eb-e736-4c4c-b1d7-092fd7e95383"></p>

<h3>Scenario 2: 5:00PM Scenario</h3>
<p><img width="100%" alt="Screenshot 2024-12-10 at 12 50 33 PM" src="https://github.com/user-attachments/assets/eb61b760-c5a0-4ca4-b26d-dcd58b35d7fe"></p>

<h3>Scenario 3: 7:00PM Scenario</h3>
<p><img width="100%" alt="Screenshot 2024-12-10 at 12 50 43 PM" src="https://github.com/user-attachments/assets/35578c6c-e30a-4fad-a2d8-ee8377404977"></p>

<h3>Scenario 4: Custom Time Scenario</h3>
<p><img width="100%" alt="Screenshot 2024-12-10 at 12 51 27 PM" src="https://github.com/user-attachments/assets/7af45ead-03aa-4686-b8b0-73ad831b6a41"></p>

<h3>Expand Table</h3>
The app has an expand table functionality where the user can see more column details. Click the "Expand" button on the bottom right of the table.
<p><img width="100%" alt="Screenshot 2024-12-10 at 2 03 22 PM" src="https://github.com/user-attachments/assets/6734cf67-d444-4f98-b14f-bc48bf085bbb"></p>

<h2>Formula Used</h2>
The logic behind the formula is based on the following. 
https://github.com/sadqueue/sad/blob/main/src/constants.js?plain=1#L22-L26

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
https://github.com/sadqueue/sad/blob/main/src/App.js

```
if (SCORE_NEW_ROLE[each.startTime] && SCORE_NEW_ROLE[each.startTime].includes(each.name)) {
    explanationArr.push(`Role ${each.name}: (180 - ${each.minutesWorkedFromStartTime}) / 180 = ${each.score}`);
} else {
    explanationArr.push(`Role ${each.name}: (${weight} * ${each.chronicLoadRatio}) + (${(1 - weight).toFixed(3)} * (180 - ${each.minutesWorkedFromStartTime}) / 180) = ${each.score}`);
}
```

For more details on the UI, click "Expand" button to see the formula used for each role.            
<p><img width="100%" alt="Screenshot 2024-12-10 at 12 53 29 PM" src="https://github.com/user-attachments/assets/74f9c7f4-75fb-453d-bfe5-0e2ce874253b"></p>

<h2>Steps to Run</h2>
<h3>Node version</h3>
v14.21.3

<h3>Create .env file</h3>
Create a .env in your main folder. Then set with your own settings in each of the "" below or ask me for my configuration details. Currently this app is not linked with Firebase.

```
REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_DATABASE_URL=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_STORAGE_BUCKET=""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
REACT_APP_FIREBASE_MEASUREMENT_ID=""

REACT_APP_EMAILJS_PUBLIC_KEY = ""
REACT_APP_EMAILJS_TEMPLATE_ID = ""
REACT_APP_EMAILJS_SERVICE_ID =""
```

<h3>Run on terminal</h3>

```
git clone https://github.com/sadqueue/sad.git
cd sadqueue.github.io
npm install
npm run start
```

The app should run on http://localhost:3000/sad. 
If you are currently running another app on port 3000, the console will ask you if you want to run this app on another port. Your app should look like the screenshot below.

<p><img width="100%" alt="Screenshot 2024-12-10 at 2 00 29 PM" src="https://github.com/user-attachments/assets/74b900aa-15d3-49b6-ab00-d685c1b7e07f"></p>

