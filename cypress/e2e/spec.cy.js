const url = "http://localhost:3001/";//"https://sadqueue.github.io/sad/";//

import { testArr5pm, testArr4pm, testArr7pm} from "./data";

describe('template spec', () => {

  it(`Fill out all timestamps and number of admissions test loop`, () => {
    cy.viewport(2000, 2000);
    cy.wait(1200);
    cy.visit(url);
    let count = 1;
    
    // cy.get("#seedetails").click();
    // cy.contains("Set Composite Algorithm").click()
    // cy.get("#compositeScoreCheckbox").click();

    // cy.get(`#alr`).clear().type(0.7);
    // cy.get(`#clr`).clear().type(0.3);

    if (testArr5pm) {
      /* test 5PM */
      cy.get("#timesdropdown").should('be.visible').select("17:00");
      cy.wait(1200);
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

          // cy.get('#alr') // Replace 'yourElementId' with the actual ID of the element
          // .then(($el) => {
          //   console.log("ALR: ", $el.text())
          // });
          // cy.get('#clr') // Replace 'yourElementId' with the actual ID of the element
          // .then(($el) => {
          //   console.log("CLR: ", $el.text())
          // });
          cy.get('#orderofadmissions_output') // Replace 'yourElementId' with the actual ID of the element
            .then(($el) => {

              const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

              if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
                // console.log(testArr[i] + "::::::" + $el.text() + "----MATCHES");
                // resArr.push(testArr[i] + "::::::" + $el.text() + "----MATCHES");
              } else {
                console.log("[" + count + "] 5PM " + testArr5pm[i][1] + " -- NO MATCH");
                console.log("Data:        ", testArr5pm[i][0].split(";").slice(0, testArr5pm[i][0].split(";").length - 1).join(";"));
                console.log("Manny:       ", output);
                console.log("From UI:     ", $el.text());
                count++;
                // resArr.push(":::::: NO MATCH");

              }
              // console.log("does this log work? ",$el.text()); // Logs the value of the element
            });
        } else {
          console.log("---- incorrect input", testArr5pm[i]);
        }

      }
    }

    /* test 7PM */
    if (testArr7pm) {
      cy.get("#timesdropdown").should('be.visible').select("19:00");
      cy.wait(1200);
      for (let i = 0; i < testArr7pm.length; i++) {

        if (testArr7pm && testArr7pm.length > 0) {
          const splitArr = testArr7pm[i][0].split(";");

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

          cy.get('#orderofadmissions_output')
            .then(($el) => {

              const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

              if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
                // console.log(testArr[i] + "::::::" + $el.text() + "----MATCHES");
                // resArr.push(testArr[i] + "::::::" + $el.text() + "----MATCHES");
              } else {
                console.log("[" + count + "] 7PM ", testArr7pm[i][1] + " -- NO MATCH");
                console.log("Data:        ", testArr7pm[i][0].split(";").slice(0, testArr7pm[i][0].split(";").length - 1).join(";"));
                console.log("Manny:       ", output);
                console.log("From UI:     ", $el.text());
                count++;
                // resArr.push(":::::: NO MATCH");

              }
              // console.log("does this log work? ",$el.text()); // Logs the value of the element
            });
        } else {
          console.log("---- incorrect input", testArr7pm[i]);
        }
      }

    }


  });
})
