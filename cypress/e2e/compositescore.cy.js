const url = "http://localhost:3001/";//"https://sadqueue.github.io/sad/";//

import { testArr5pm, testArr4pm, testArr7pm} from "./data";


describe('template spec', () => {

  it(`Fill out all timestamps and number of admissions test loop`, () => {
    cy.viewport(2000, 2000);
    cy.wait(1200);
    cy.visit(url);
    cy.get("#seedetails").click();
    cy.contains("Set Composite Algorithm").click();
    let count = 1;

    cy.task('logToFile',`###### Order of Admissions by composite algorithm ${datetime}`);


    if (testArr5pm) {
      /* test 5PM */
      cy.get("#timesdropdown").should('be.visible').select("17:00");
      cy.wait(1200);
      // cy.get("#seedetails").click();
      // cy.contains("Set Composite Algorithm").click();

      for (let i = 0; i < testArr5pm.length; i++) {
        const splitArr = testArr5pm[i][0].split(";");

        if (testArr5pm[i].length > 0) {
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

              const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

              if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
              } else {
                cy.task('logToFile', `[ ${count} ] 5PM ${testArr5pm[i][1]} -- NO MATCH`);
                cy.task('logToFile', `Data:       ${testArr5pm[i][0].split(";").slice(0, testArr5pm[i][0].split(";").length - 1).join(";")}`);
                cy.task('logToFile', `Manny:      ${output}`);
                cy.task('logToFile', `From UI:    ${$el.text()}`);

                cy.get("#compositeScoreCheckbox").click();

                cy.get("#generateQueue").click();

                cy.get('#orderofadmissions_output')
                  .then(($el) => {
                    cy.task('logToFile', `CS_Algo:    ${$el.text()}`);
                    cy.get("#compositeScoreCheckbox").click();
                  });

                count++;
              }
            });
        } else {
        }

      }
    }

    if (testArr7pm) {
      /* test 7PM */
      cy.get("#timesdropdown").should('be.visible').select("19:00");
      cy.wait(1200);
      

      for (let i = 0; i < testArr7pm.length; i++) {
        const splitArr = testArr7pm[i][0].split(";");

        if (testArr7pm[i].length > 0) {
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

              const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

              if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
                // cy.task('logToFile', testArr[i] + "::::::" + $el.text() + "----MATCHES");
                // resArr.push(testArr[i] + "::::::" + $el.text() + "----MATCHES");
              } else {
                cy.task('logToFile', `[ ${count} ] 7PM ${testArr7pm[i][1]} -- NO MATCH"`);
                cy.task('logToFile', `Data:        ${testArr7pm[i][0].split(";").slice(0, testArr7pm[i][0].split(";").length - 1).join(";")}`);
                cy.task('logToFile', `Manny:       ${output}`);
                cy.task('logToFile', `From UI:     ${$el.text()}`);

                cy.get("#compositeScoreCheckbox").click();

                cy.get("#generateQueue").click();

                cy.get('#orderofadmissions_output')
                  .then(($el) => {
                    cy.task('logToFile', `CS_Algo:    ${$el.text()}`);
                    cy.get("#compositeScoreCheckbox").click();
                  });

                count++;
              }
            });
        } else {
        }

      }
    }


  });
})