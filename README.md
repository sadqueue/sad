<p align="center"><img width="244" alt="Screenshot 2024-12-10 at 1 09 14 PM" src="https://github.com/user-attachments/assets/1ea87648-9a46-48fe-a720-338a2c429fd0"></p>

<h1 align="center">S.A.D.Q. (Standardized Admissions Distribution)</h1>

# Table of Contents
1. [Purpose](#purpose)
2. [Example Screenshots](#examplescreenshots)
3. [Formula Used](#formulaused)
4. [How to Run](#howtorun)
5. [Technologies Used](#tech)

<h1>Purpose</h1><a name="purpose"></a>
Purpose of this UI tool is for hospitalists to generate the order of admissions at a certain timestamp. User can click the dropdown and select a timestamp. The options are 4PM, 5PM, 7PM or a custom time the user can select.
The deployed website link https://sadqueue.github.io/sad/.

<img width="1468" alt="Screenshot 2025-04-25 at 1 59 45 PM" src="https://github.com/user-attachments/assets/521d6273-80cf-42cb-9676-60fb6edcd5de" />

<h3>Expand Table</h3>
The app has an expand table functionality where the user can see more column details. Click the "Expand" button on the bottom right of the table.
<img width="1466" alt="Screenshot 2025-04-25 at 2 00 28 PM" src="https://github.com/user-attachments/assets/605f78d0-902a-4ea2-aced-23524bc26d1c" />

For more details on the UI, click "Show Explanation" button to see the formula used for each role.            

<h2>How to Run</h2><a name="howtorun"></a>
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
If you are currently running another app on port 3000, the console will ask you if you want to run this app on another port. 

<h2>Technologies Used</h2><a name="tech"></a>
<ul>
    <li>React</li>
    <li>Javascript</li>
    <li>EmailJS</li>
    <li>Firebase DB</li>
</ul>
