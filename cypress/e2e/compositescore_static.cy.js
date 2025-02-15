const url = "http://localhost:3001/sad#/beta";//"https://sadqueue.github.io/sad/";//

import { testArr5pm, testArr4pm, testArr7pm } from "/Users/m0l01bz/Desktop/workspace/sadq.github.io/src/data/data";

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
          .then(($el) => {
              const removeParanthesis = $el.text().replace(/ *\([^)]*\) */g, "");

            const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

            if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
            } else {
              cy.task('logToFile', `[ ${count} ] ${time} ${testArr[i][1]} -- NO MATCH`);
              cy.task('logToFile', `Data:       ${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}`);
              cy.task('logToFile', `Manny:      ${output}`);
              cy.task('logToFile', `CS_Algo:    ${removeParanthesis}`);
              cy.task('logToFile', `Explained:  ${$el.text()}`);
              cy.task('logToFile', `\n----------------------------------\n`);
              count++;
            }
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
    // cy.get("#compositeScoreCheckboxStatic").click();
    // cy.get(`#alr`).clear().type(0.6);
    //     cy.get(`#clr`).clear().type(0.4)
    // let count = 1;

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