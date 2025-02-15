const url = "http://localhost:3001/";//"https://sadqueue.github.io/sad/";//

import { testArr5pm, testArr4pm, testArr7pm } from "/Users/m0l01bz/Desktop/workspace/sadq.github.io/src/data/data";

const runTasks = (testArr, time) => {
  /* test 5PM */
  let count = 1;
  cy.get("#timesdropdown").should('be.visible').select(time);
  cy.wait(1200);
  for (let i = 0; i < testArr.length; i++) {
    const splitArr = testArr[i][0].split(";");

    if (testArr[i].length > 0) {
      const timestamps = splitArr[0].split(",");
      const admissions = splitArr[1].split(",");
      const output = splitArr[2];

      timestamps.forEach((time, timeIndexx) => {
        const timeIndex = timeIndexx;
        const admission = Number(admissions[timeIndexx]);

        cy.get(`#timestamp_${timeIndexx}`).clear().type(time);
        cy.get(`#numberOfAdmissions_${timeIndexx}`).clear().type(admission)
      })

      cy.get("#generateQueue").click();

      cy.get('#orderofadmissions_output') // Replace 'yourElementId' with the actual ID of the element
        .then(($el) => {
          const removeParanthesis = $el.text().replace(/ *\([^)]*\) */g, "");
          const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

          if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
            
          } else {
            cy.task('logToFile',`[${count}]   ${time == "17:00" ? "5PM" : "7PM"} ${testArr[i][1]} -- NO MATCH\n
              Data:        ${testArr[i][0].split(";").slice(0, testArr[i][0].split(";").length - 1).join(";")}\n
              Manny:       ${output}\n
              From UI:     ${removeParanthesis}\n
              Explained:   ${$el.text()}\n
              ----------------------------------\n`);

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
    let count = 1;
    
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getDate() + "/"
                  
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes();

      cy.task('logToFile',`###### Order of Admissions by original algorithm ${datetime}`);

    if (testArr5pm) {
      runTasks(testArr5pm, "17:00")
    }

    if (testArr7pm) {
      runTasks(testArr7pm, "19:00")
    }

  });
})
