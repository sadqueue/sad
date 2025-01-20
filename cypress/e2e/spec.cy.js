const url ="http://localhost:3001/sad"; // "https://sadqueue.github.io/sad/";//


const testArrFourPM = [
 "17:00;16:36,16:16,16:19,16:31;5,4,3,3;S2>S3>S4>S1", //12/09/2024
   "17:00;16:31,16:48,16:48,15:17;5,5,4,2;S4>S1>S2>S3", //12/10/2024
   "17:00;16:43,15:30,15:50,15:50;5,4,3,3;S2>S3>S4>S1", //12/11/2024
   // 17:00; 12/12/2024 No data
   // 17:00; 12/13/2024 No data?
   "17:00;16:00,15:15,16:08,16:33;5,5,4,4;S2>S1>S3>S4", //12/14/2024?
   "17:00;15:45,16:25,16:26,14:46;4,4,3,2;S4>S1>S2>S3", //12/14/2024
   "17:00;16:44,14:50,14:55,15:45;4,3,2,2;S2>S3>S4>S1", //12/15/2024
   "17:00;17:18,16:45,16:07,17:17;5,5,3,3;S3>S2>S4>S1", //12/16/2024
   // 17:00; 12/17/2024 No data
   "17:00;16:34,16:34,15:15,16:00;5,5,3,3;S3>S4>S1>S2", //12/18/2024
   "17:00;16:26,16:54,16:56,16:15;4,3,3,2;S4>S1>S2>S3", //12/19/2024
   "17:00;16:30,17:00,15:50,15:35;5,5,3,2;S4>S3>S1>S2", //12/20/2024
   "17:00;16:30,16:55,16:15,16:15;6,5,3,2;S4>S3>S1>S2", //12/21/2024
   "17:00;14:40,15:30,16:30,16:45;4,3,3,2;S1>S2>S3>S4", //12/22/2024
   "17:00;16:30,16:40,16:45,15:55;5,4,3,2;S1>S2>S3>S4", //12/23/2024
   "17:00;16:00,15:15,16:08,16:33;5,4,4,4;S2>S1>S3>S4", //12/24/2024
   // 17:00; 12/25/2024 No data
   // 17:00; 12/26/2024 No data
   // 17:00; 12/27/2024 No data
   "17:00;16:16,15:30,15:45,16:20;4,3,2,2;S2>S3>S1>S4", //12/28/2024
   "17:00;14:30,15:24,15:55,16:27;4,3,3,2;S2>S1>S3>S4", //12/29/2024
   "17:00;14:45,14:46,14:50,15:34;3,3,2,2;S1>S2>S3>S4", //12/30/2024
   "17:00;16:44,15:50,15:50,15:55;4,3,2,2;S2>S3>S4>S1", //12/31/2024
   "17:00;16:44,15:50,15:50,15:55;4,3,2,2;S2>S3>S4>S1", //1/1/2025
   "17:00;16:35,15:20,15:30,15:30;4,2,2,2;S2>S3>S1>S4", //1/2/2025
   "17:00;15:20,16:20,16:30,16:45;4,4,3,3;S1>S2>S3>S4", //1/3/2025
   "17:00;15:50,16:20,16:45,16:20;4,4,3,2;S1>S2>S4>S3", //1/4/2025
   "17:00;15:00,16:20,16:45,16:20;4,4,3,2;S1>S2>S4>S3", //1/5/2025
   "17:00;16:05,16:45,14:40,15:30;5,4,2,2;S3>S4>S1>S2", //1/6/2025
   "17:00;14:42,15:09,16:29,16:00;5,3,4,3;S2>S1>S4>S3", //1/7/2025
   "17:00;16:57,16:00,15:46,16:45;5,5,3,3;S1>S3>S2>S4", //1/8/2025
 
 "17:00;16:05,16:10,16:35,16:45;5,4,3,3;S1>S3>S2>S4", //1/9/2025
 
 "17:00;16:35,16:05,16:10,16:30;4,3,2,2;S2>S3>S4>S1", //1/10/2025
 
 "17:00;16:40,16:35,14:55,15:20;5,4,3,2;S3>S4>S2>S1", //1/11/2025  
 "17:00;15:15,16:55,15:55,14:55;3,3,2,1;S4>S1>S3>S2", //1/12/2025

"17:00;15:25,16:25,16:35,15:50;5,5,4,3;S1>S4>S2>S3", //1/13/2025

"17:00;15:15,15:47,16:42,16:36;4,4,3,2;S1>S2>S4>S3", //1/14/2025

"17:00;16:57,15:35,16:05,15:35;5,4,3,2;S4>S2>S3>S1", //1/15/2025

"17:00;16:26,16:40,15:02,15:26;3,3,2,1;S3>S4>S1>S2", //1/16/2025

"17:00;15:45,16:54,16:00,16:07;3,3,2,2;S1>S3>S4>S2", //1/17/2025

"17:00;14:59,16:23,16:13,16:32;3,3,2,2;S1>S3>S2>S4", //1/18/2025

"17:00;16:30,16:32,16:33,15:20;2,2,2,1;S4>S1>S2>S3", //1/19/2025


]

describe('template spec', () => {

  it(`Fill out all timestamps and number of admissions test loop`, () => {
    cy.viewport(2000, 2000);
    cy.visit(url);
    const resArr = [];

    for (let i = 0; i < testArrFourPM.length; i++) {
      const splitArr = testArrFourPM[i].split(";");

      const militaryTime = splitArr[0];
      const timestamps = splitArr[1].split(",");
      const admissions = splitArr[2].split(",");
      const output = splitArr[3];

      // const dropdown = testArrFourPM[i].split(";")[0];
      let timex = "";
      if (militaryTime == "16:00") {
        timex = "4:00PM";
      } else if (militaryTime == "17:00") {
        timex = "5:00PM";
      } else {
        timex = "7:00PM";
      }

      cy.get("#timesdropdown").should('be.visible').select(timex);

      timestamps.forEach((time, timeIndexx) => {
        const timeIndex = timeIndexx;
        const admission = admissions[timeIndexx];

        cy.get(`.timestamp`).eq(timeIndex).clear().type(time);
        cy.get(`.numberOfAdmissions`).eq(timeIndex).clear().type(admission)
      })

      cy.contains('Generate Queue').click();

      cy.get('#endoutput') // Replace 'yourElementId' with the actual ID of the element
        .then(($el) => {

          if ($el.text().replace(/\(.*?\)/g, "").trim() == output.trim()) {
            console.log(testArrFourPM[i] + "::::::" + $el.text() + "----MATCHES");
            resArr.push(testArrFourPM[i] + "::::::" + $el.text() + "----MATCHES");
          } else {
            console.log(testArrFourPM[i] + "::::::" + $el.text());
            resArr.push(testArrFourPM[i] + "::::::" + $el.text());

          }
          // console.log($el.text()); // Logs the value of the element
        });
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const year = today.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;

      // cy.get(`.lastsavedhighlight`).should('be.visible').and('contains', `Last Saved: ${formattedDate}`);
      cy.get(`#orderofadmissions_title`).should('be.visible'); //.and('have.value', `Order of Admissions ${timex}`);
      cy.get(`#orderofadmissions_output`).should('be.visible'); //.and('have.value', output);

    }
    console.log(resArr);

  });
})
