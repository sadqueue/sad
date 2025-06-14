const url = "https://sadqueue.github.io/sad/" //"http://localhost:3001/sad";//
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import db from "../../src/firebaseConfig"; // Import Firebase config

import { testArr5pm, testArr4pm, testArr7pm } from "/Users/marikalam/workspace/sad/src/data/data";
import { saveLog } from "../../src/transactionsApi";


const runTasks = (testArr, time) => {
    // cy.task('clearFile', { filename: `logging.txt` });

    let count = 1;
    let selecttime = time == "5PM" ? "17:00" : "19:00";
    
    // cy.get("#doNotStoreInDb").click();
    cy.get("#timesdropdown").should('be.visible').select(selecttime);
    cy.wait(1200);

    const currentDate = new Date();

    // Adjust for PST (GMT-8) and format the date to MM/DD/YY HH:MM AM/PM
    const pstDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    
    // Format the date as MM/DD/YY
    const dateFormatted = `${pstDate.getMonth() + 1}/${pstDate.getDate()}/${pstDate.getFullYear().toString().slice(-2)}`;

    // Format the time in 12-hour format with AM/PM
    const hours = pstDate.getHours() % 12 || 12;
    const minutes = String(pstDate.getMinutes()).padStart(2, '0');
    const ampm = pstDate.getHours() >= 12 ? 'PM' : 'AM';

    const timeFormatted = `${hours}:${minutes}${ampm}`;

    // Combine formatted date and time for the final result
    const datetime = `${dateFormatted} ${timeFormatted}`;

    cy.task('logToFile', {
        filename: `logging.txt`, 
        message: `🔎🖖 logging ---------- ${datetime}  🔎`
    });

    for (let i = 0; i < testArr.length; i++) {
        const splitArr = testArr[i][0].split(";");

        if (testArr[i].length > 0) {
            const timestamps = splitArr[0].split(",");
            const admissions = splitArr[1].split(",");
            const output = splitArr[2];

            timestamps.forEach((time, timeIndexx) => {
                const admission = Number(admissions[timeIndexx]);

                cy.get(`#timestamp_${timeIndexx}`).clear().type(time);
                cy.get(`#numberOfAdmissions_${timeIndexx}`).clear().type(admission);
            });

            cy.get("#generateQueue").click();
            cy.get("#generateQueue").click();

            cy.get('#orderofadmissions_output')
                .then(($el_originalAlgo) => {
                    const composite_originalAlgo = $el_originalAlgo.text();
                    const removeParanthesis_composite_originalAlgo = $el_originalAlgo.text().replace(/ *\([^)]*\) */g, "").trim();

                    if (output !== removeParanthesis_composite_originalAlgo) {
                        // cy.task('logToFile', { filename: 'log.txt', message: 'Test log entry' });

                        cy.task('logToFile', {
                            filename: `logging.txt`,
                            message: `❌ [ ${count} ] logging ${testArr[i][1]}
Data:			${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}
Manny:			${output}
Comp:           ${removeParanthesis_composite_originalAlgo}
Comp: 	        ${composite_originalAlgo}
----------------------------------\n`
                        });

                        count++;
                    } else {
                        cy.task('logToFile', {
                            filename: `logging.txt`,
                            message: `✅ logging ${testArr[i][1]}
Data:			${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}
Manny:			${output}
Comp:           ${removeParanthesis_composite_originalAlgo}
Comp: 	        ${composite_originalAlgo}
----------------------------------\n`
                        });
                    }
                });

        }
    }
};

describe('template spec', () => {

    it(`Fill out all timestamps and number of admissions test loop`, () => {
        cy.viewport(2000, 2000);
        cy.wait(1200);
        cy.visit(url);
        cy.get("#seedetails").click();
        // cy.contains("Set Algorithm").click();

        var currentdate = new Date();
        var datetime = "Last Sync: " +
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getDate() + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
            
        if (testArr5pm) {
            runTasks(testArr5pm, "5PM");
        }

        if (testArr7pm) {
            runTasks(testArr7pm, "7PM")
        }

    });
})
