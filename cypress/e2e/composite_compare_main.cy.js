const url = "http://localhost:3001/sad#/beta";//"https://sadqueue.github.io/sad/";//

import { testArr5pm, testArr4pm, testArr7pm } from "./data";

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

            cy.get("#generateQueue").click();
            cy.get('#orderofadmissions_output')
            .then(($el) => {
                const removeParanthesis_composite = $el.text().replace(/ *\([^)]*\) */g, "").trim();

                // Data:			16:55,16:46,16:38,16:36;7,5,4,3
                // Manny			N5>S2>S4>S3>S1
                // Main Algo:		N5>S4>S3>S2>S1
                // Comp Algo:		N5>S2>S4>S3>S1
                // Main Algo Exp:	N5(0.00)>S4(1.00)>S3(1.00)>S2(0.83)>S1(1.00)
                // Comp Algo Exp:	N5(0.333,0.000,0.350)>S2(0.896,0.833,0.873)>S4(0.822,1.000,0.888)>S3(0.837,1.000,0.897)>S1(0.963,1.000,0.977)
                if (removeParanthesis_main !== removeParanthesis_composite){
                    cy.task('logToFile', `[ ${count} ] ${time} ${testArr[i][1]} -- NO MATCH
Data:			${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}
Manny:			${output}
Main Algo:		${removeParanthesis_main}
Comp Algo:		${removeParanthesis_composite}
Main Algo Exp:	${originalMain}
Comp Algo Exp:	${$el.text()}
----------------------------------\n`);
                   
                    count++;
                } else {
                   
                }
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
    //   runTasks(testArr5pm, "5PM");
    }

    if (testArr7pm) {
      runTasks(testArr7pm, "7PM")
    }

  });
})