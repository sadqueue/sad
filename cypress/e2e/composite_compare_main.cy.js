const url = "http://localhost:3001/sad";//"https://sadqueue.github.io/sad/";//

import { testArr5pm, testArr4pm, testArr7pm } from "/Users/marikalam/workspace/sad/src/data/data";

let count = 1;
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
                    cy.get("#compositeScoreCheckboxStatic").click();
                    cy.get(`#alr`).clear().type(0.7);
                    cy.get(`#clr`).clear().type(0.3)
                    cy.get("#generateQueue").click();
                    cy.get('#orderofadmissions_output')
                        .then(($el_7and3) => {
                            const composite_7and3 = $el_7and3.text();

                            const removeParanthesis_composite_7and3 = $el_7and3.text().replace(/ *\([^)]*\) */g, "").trim();
                            cy.get(`#alr`).clear().type(0.6);
                            cy.get(`#clr`).clear().type(0.4)
                            cy.get("#generateQueue").click();
                            cy.get('#orderofadmissions_output')
                                .then(($el_6and4) => {
                                    const composite_6and4 = $el_6and4.text();

                                    const removeParanthesis_composite_6and4 = $el_6and4.text().replace(/ *\([^)]*\) */g, "").trim();
                                    
                                    if (removeParanthesis_main !== removeParanthesis_composite_7and3) {
                                        cy.task('logToFile', `[ ${count} ] ${time} ${testArr[i][1]} -- !!!! NO MATCH !!!!!
Data:			${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}
Manny:			${output}
Main Algo:		${removeParanthesis_main}
Algo(0.7/0.3):  ${removeParanthesis_composite_7and3}
Algo(0.6/0.4):  ${removeParanthesis_composite_6and4}
Main Algo:  	${originalMain}
Algo(0.7/0.3): 	${composite_7and3}
Algo(0.6/0.4): 	${composite_6and4}
----------------------------------\n`);

                                        count++;
                                    } else {

                                        cy.task('logToFile', `${time} ${testArr[i][1]} -- Match
Data:			${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}
Manny:			${output}
Main Algo:		${removeParanthesis_main}
Algo(0.7/0.3):  ${removeParanthesis_composite_7and3}
Algo(0.6/0.4):  ${removeParanthesis_composite_6and4}
Main Algo:  	${originalMain}
Algo(0.7/0.3): 	${composite_7and3}
Algo(0.6/0.4): 	${composite_6and4}
----------------------------------\n`);
                                    }
                                });
                            cy.get("#compositeScoreCheckboxStatic").click();
                        });

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
        cy.contains("Set Composite Algorithm").click();

        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
        cy.task('logToFile', `###### Order of Admissions by original algorithm ${datetime}`);


        if (testArr5pm) {
              runTasks(testArr5pm, "5PM");
        }

        if (testArr7pm) {
            runTasks(testArr7pm, "7PM")
        }

    });
})