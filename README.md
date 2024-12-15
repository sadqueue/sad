
<p align="center"><img width="244" alt="Screenshot 2024-12-10 at 1 09 14 PM" src="https://github.com/user-attachments/assets/1ea87648-9a46-48fe-a720-338a2c429fd0"></p>

<h1 align="center">S.A.D. Queue (Standardized Admissions Distribution)</h1>

# Table of Contents
1. [Purpose](#purpose)
2. [Example Screenshots](#examplescreenshots)
3. [Formula Used](#formulaused)
4. [How to Run](#howtorun)
5. [Technologies Used](#tech)

<h1>Purpose</h1><a name="purpose"></a>
Purpose of this UI tool is for hospitalists to generate the order of admissions at a certain timestamp. User can click the dropdown and select a timestamp. The options are 4PM, 5PM, 7PM or a custom time the user can select.
The deployed website link <a href=https://sadqueue.github.io/sad/" target="_blank">here</a>.

<h2>Example Screenshots</h2><a name="examplescreenshots"></a>

<h3>Scenario 1: 4:00PM Scenario</h3>
<p><img width="759" alt="Screenshot 2024-12-15 at 6 10 00 AM" src="https://github.com/user-attachments/assets/2dc9d399-d591-4aa3-a225-3ff6fcf261fc" /></p>

<h3>Scenario 2: 5:00PM Scenario</h3>
<p><img width="711" alt="Screenshot 2024-12-15 at 6 10 38 AM" src="https://github.com/user-attachments/assets/cbb8c736-6f86-466a-89b7-af4d5a3a7e7e" /></p>

<h3>Scenario 3: 7:00PM Scenario</h3>
<p><img width="716" alt="Screenshot 2024-12-15 at 6 10 57 AM" src="https://github.com/user-attachments/assets/fcdfbda3-00d4-4181-b7e3-1a63739d9069" /></p>

<h3>Scenario 4: Custom Time Scenario</h3>
<p><img width="718" alt="Screenshot 2024-12-15 at 6 11 14 AM" src="https://github.com/user-attachments/assets/4d8829a3-70b5-4955-91d6-4568cb87d44f" />
</p>

<h3>Expand Table</h3>
The app has an expand table functionality where the user can see more column details. Click the "Expand" button on the bottom right of the table.
<p><img width="795" alt="Screenshot 2024-12-15 at 6 11 32 AM" src="https://github.com/user-attachments/assets/e65c91bc-c3e0-425f-8fdf-573165448e2b" /></p>

<h2>Formula Used</h2><a name="formulaused"></a>
sortByTimestampAndCompositeScore is the method used to calculate the order of admissions. 

<h3>Step 1<h3>
    Sort by timestamp
<h3>Step 2</h3
              For each admitter, if chronic load ratio is >0.66, then deprioritize in the order (either putting in back or pushing back by X spots depending on how great the ratio is

For more details on the UI, click "Show Explanation" button to see the formula used for each role.            
<p><img width="752" alt="Screenshot 2024-12-15 at 6 17 27 AM" src="https://github.com/user-attachments/assets/7f7ed3ef-4bb9-40b4-8cac-8fd53361af9a" /></p>

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
If you are currently running another app on port 3000, the console will ask you if you want to run this app on another port. Your app should look like the screenshot below.

<p><img width="786" alt="Screenshot 2024-12-15 at 6 23 35 AM" src="https://github.com/user-attachments/assets/2ce53cf4-cbc0-4e02-b740-d95803a3e5c2" /></p>


<h2>Technologies Used</h2><a name="tech"></a>
<ul>
    <li>React</li>
    <li>Javascript</li>
    <li>EmailJS</li>
    <li>Firebase DB</li>
</ul>
</ul>

