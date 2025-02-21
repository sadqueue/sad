const url = "http://localhost:3001/sad";//"https://sadqueue.github.io/sad/";//
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import db from "../../src/firebaseConfig"; // Import Firebase config

import { testArr5pm, testArr4pm, testArr7pm } from "/Users/m0l01bz/Desktop/workspace/sq/src/data/data";

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

let count = 1;
// Cypress.Commands.add("logToServer", (message) => {
//     cy.task("logToServer", message);
// });

const runTasks = (testArr, time) => {
    let count = 1;
    let selecttime = time == "5PM" ? "17:00" : "19:00";
    /* test 5PM */
    cy.get("#timesdropdown").should('be.visible').select(selecttime);
    cy.wait(1200);

    for (let i = 0; i < testArr.length; i++) {
        const splitArr = testArr[i][0].split(";");

        if (testArr[i].length > 0) {
            const timestamps = splitArr[0].split(",");
            const admissions = splitArr[1].split(",");
            const output = splitArr[2];

            timestamps.forEach((time, timeIndexx) => {
                const admission = Number(admissions[timeIndexx]);

                cy.get(`#timestamp_${timeIndexx}`).clear().type(time);
                cy.get(`#numberOfAdmissions_${timeIndexx}`).clear().type(admission)
            })

            cy.get("#generateQueue").click();

            cy.get('#orderofadmissions_output')
                .then(($el_main) => {
                    const originalMain = $el_main.text();
                    const removeParanthesis_main = $el_main.text().replace(/ *\([^)]*\) */g, "").trim();
                    cy.get("#originalAlgorithmCheckbox").click();
                    cy.get("#generateQueue").click();
                    cy.get('#orderofadmissions_output')
                        .then(($el_6and4) => {
                            const composite_6and4 = $el_6and4.text();

                            const removeParanthesis_composite_6and4 = $el_6and4.text().replace(/ *\([^)]*\) */g, "").trim();

                            if (removeParanthesis_main !== removeParanthesis_composite_6and4) {
                                //cy.task('logToFile', { filename: 'log.txt', message: 'Test log entry' });

                                cy.task('logToFile', {
                                    filename: `${time}.txt`,
                                    message: `[ ${count} ] ${time} ${testArr[i][1]} -- !!!! NO MATCH !!!!!
Data:			${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}
Manny:			${output}
Comp:		    ${removeParanthesis_main}
No Comp:        ${removeParanthesis_composite_6and4}
Comp:  	        ${originalMain}
No Comp: 	    ${composite_6and4}
----------------------------------\n`
                                });
                                count++;
                            } else {


                            }
                        });
                    cy.get("#originalAlgorithmCheckbox").click();
                });


        } else {
        }

    }
}
describe('template spec', () => {

    it(`Fill out all timestamps and number of admissions test loop`, () => {
        cy.viewport(2000, 2000);
        cy.wait(1200);
        cy.visit(url);
        cy.get("#seedetails").click();
        cy.contains("Set Algorithm").click();

        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
        if (testArr5pm) {
            runTasks(testArr5pm, "5PM");
        }

        if (testArr7pm) {
            // runTasks(testArr7pm, "7PM")
        }

    });
})


// Cypress.on("test:after:run", (test) => {
//     const testResult = {
//         title: test.title,
//         state: test.state, // 'passed' or 'failed'
//         duration: test.duration,
//         timestamp: new Date().toISOString(),
//     };

//     const resultRef = ref(db, "cypressResults/" + test.title.replace(/\s+/g, "_"));
//     set(resultRef, testResult);
// });