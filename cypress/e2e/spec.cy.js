const url = "http://localhost:3001/sad"; // "https://sadqueue.github.io/sad/";//

// TEST CASES

const testArr = [

  ["19:00;17:31,18:01,18:30,18:45;6,6,5,2;N1>N2>N3>N4>S2>N5>N1>N2>S4>N3>N4>S3>N5", "Test Cases for High Output Scenario 1 (S3 has 6 admissions)"],
  // ["19:00;17:31,18:01,18:30,18:45;6,4,6,3;N1>N2>S3>N3>N4>S2>N1>N2>S3>N3>N4>S4>N5", "Test Cases for High Output Scenario 1 (S4 has 3+ admissions)"],
  // ["19:00;17:31,18:01,18:30,18:45;6,6,5,2;N1>N2>N3>N4>S2>N5>N1>N2>S4>N3>N4>S3>N5", "Test Cases for High Output Scenario 1 (S3 has 6 admissions)"],
  // ["19:00;17:31,18:01,18:30,18:45;6,5,4,2;N1>N2>N3>N4>S2>S4>N5>N1>S3>N2>N3>N4>S4>N5", "Test Cases for High Output Scenario 3 (S3 has 5 admissions)"]
];





describe('template spec', () => {

  it(`Fill out all timestamps and number of admissions test loop`, () => {
    cy.viewport(2000, 2000);
    cy.visit(url);
    const resArr = [];
    let count = 1;

    for (let i = 0; i < testArr.length; i++) {
      const splitArr = testArr[i][0].split(";");

      const militaryTime = splitArr[0];
      const timestamps = splitArr[1].split(",");
      const admissions = splitArr[2].split(",");
      const output = splitArr[3];

      let timex = "";
      if (militaryTime == "16:00") {
        timex = "4:00PM";
      } else if (militaryTime == "17:00") {
        timex = "5:00PM";
      } else {
        timex = "7:00PM";
      }

      cy.get("#timesdropdown").should('be.visible').select(timex);

      cy.wait(1200);
      timestamps.forEach((time, timeIndexx) => {
        const timeIndex = timeIndexx;
        const admission = Number(admissions[timeIndexx]);

        cy.get(`#timestamp_${timeIndexx}`).clear().type(time);
        cy.get(`#numberOfAdmissions_${timeIndexx}`).clear().type(admission)
      })

      cy.get("#generateQueue").click();

      cy.get('#endoutput') // Replace 'yourElementId' with the actual ID of the element
        .then(($el) => {

          const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

          if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
            // console.log(testArr[i] + "::::::" + $el.text() + "----MATCHES");
            // resArr.push(testArr[i] + "::::::" + $el.text() + "----MATCHES");
          } else {
            console.log("[" + count + "] ", testArr[i][1] + " -- No Match");
            console.log("Expected:  ",testArr[i][0]);
            console.log("Actual:    ",output);
            count++;
            // resArr.push(":::::: NO MATCH");

          }
          // console.log("does this log work? ",$el.text()); // Logs the value of the element
        });

      // const today = new Date();
      // const month = today.getMonth() + 1;
      // const day = today.getDate();
      // const year = today.getFullYear();
      // const formattedDate = `${month}/${day}/${year}`;

      // // cy.get(`.lastsavedhighlight`).should('be.visible').and('contains', `Last Saved: ${formattedDate}`);
      // cy.get(`#orderofadmissions_title`).should('be.visible'); //.and('have.value', `Order of Admissions ${timex}`);
      // cy.get(`#orderofadmissions_output`).should('be.visible'); //.and('have.value', output);

    }

  });
})
