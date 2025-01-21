const url ="http://localhost:3001/sad"; // "https://sadqueue.github.io/sad/";//


const testArrFourPM = [
//TEST CASES

"17:00;16:36,16:16,16:19,16:31;5,4,3,3;N5>S2>S3>S4>S1", //12/09/2024
   "17:00;16:31,16:48,16:48,15:17;5,5,4,2;S4>N5>S1>S2>S3", //12/10/2024
   "17:00;16:43,15:30,15:50,15:50;5,4,3,3;S2>N5>S3>S4>S1", //12/11/2024
  "17:00;16:00,15:15,16:08,16:33;5,5,4,4;N5>S2>S1>S3>S4", //12/14/2024?
   "17:00;15:45,16:25,16:26,14:46;4,4,3,2;S4>N5>S1>S2>S3", //12/14/2024
   "17:00;16:44,14:50,14:55,15:45;4,3,2,2;S2>S3>N5>S4>S1", //12/15/2024
   "17:00;17:18,16:45,16:07,17:17;5,5,3,3;N5>S3>S2>S4>S1", //12/16/2024
   "17:00;16:34,16:34,15:15,16:00;5,5,3,3;N5>S3>S4>S1>S2", //12/18/2024
   "17:00;16:26,16:54,16:56,16:15;4,3,3,2;N5>S4>S1>S2>S3", //12/19/2024
   "17:00;16:30,17:00,15:50,15:35;5,5,3,2;N5>S4>S3>S1>S2", //12/20/2024
   "17:00;16:30,16:55,16:15,16:15;6,5,3,2;N5>S4>S3>S1>S2", //12/21/2024
   "17:00;14:40,15:30,16:30,16:45;4,3,3,2;S1>S2>N5>S4>S3", //12/22/2024
   "17:00;16:30,16:40,16:45,15:55;5,4,3,2;N5>S4>S2>S1>S3", //12/23/2024

"17:00;16:00,15:15,16:08,16:33;5,4,4,4;S2>N5>S1>S3>S4", //12/24/2024
  
"17:00;16:16,15:30,15:45,16:20;4,3,2,2;S2>N5>S3>S1>S4", //12/28/2024
  
"17:00;14:30,15:24,15:55,16:27;4,3,3,2;S1>S2>N5>S4>S3", //12/29/2024

"17:00;14:45,14:46,14:50,15:34;3,3,2,2;S1>S2>S3>N5>S4", //12/30/2024
   "17:00;16:44,15:50,15:50,15:55;4,3,2,2;N5>S2>S3>S4>S1", //12/31/2024
   "17:00;16:44,15:50,15:50,15:55;4,3,2,2;N5>S2>S3>S4>S1", //1/1/2025
   
"17:00;16:35,15:20,15:30,15:30;4,2,2,2;S2>N5>S3>S4>S1", //1/2/2025
   
"17:00;15:20,16:20,16:30,16:45;4,4,3,3;S1>N5> S2>S3>S4", //1/3/2025
   "17:00;15:50,16:20,16:45,16:20;4,4,3,2;N5>S1>S2>S4>S3", //1/4/2025

"17:00;15:00,16:20,16:45,16:20;4,4,3,2;S1>N5>S2>S4>S3", //1/5/2025
   "17:00;16:05,16:45,14:40,15:30;5,4,2,2;S3>N5>S4>S1>S2", //1/6/2025  need to fix ties
            "17:00;14:42,15:09,16:29,16:00;5,3,4,3;S2>N5>S1>S4>S3", //1/7/2025
   "17:00;16:57,16:00,15:46,16:45;5,5,3,3;N5>S3>S2>S4>S1", //1/8/2025
 
"17:00;16:05,16:10,16:35,16:45;5,4,3,3;N5>S2>S1>S3>S4", //1/9/2025
 "17:00;16:35,16:05,16:10,16:30;4,3,2,2;N5>S2>S3>S4>S1", //1/10/2025
 
"17:00;16:40,16:35,14:55,15:20;5,4,3,2;N5>S3>S4>S2>S1", //1/11/2025  STRANGE ONE
 "17:00;15:15,16:55,15:55,14:55;3,3,2,1;S4>S1>N5>S3>S2", //1/12/2025

"17:00;15:25,16:25,16:35,15:50;5,5,4,3;N5>S1>S4>S2>S3", //1/13/2025

"17:00;15:15,15:47,16:42,16:36;4,4,3,2;S1>N5>S2>S4>S3", //1/14/2025

"17:00;16:57,15:35,16:05,15:35;5,4,3,2;N5>S4>S2>S3>S1", //1/15/2025

"17:00;16:26,16:40,15:02,15:26;3,3,2,1;S3>S4>N5>S1>S2", //1/16/2025

"17:00;15:45,16:54,16:00,16:07;3,3,2,2;N5>S1>S3>S4>S2", //1/17/2025

"17:00;14:59,16:23,16:13,16:32;3,3,2,2;S1>N5>S3>S2>S4", //1/18/2025

"17:00;16:30,16:32,16:33,15:20;2,2,2,1;S4>N5>S1>S2>S3", //1/19/2025

"17:00;16:21,13:40,14:52,16:18;4,2,2,2;S2>S3>N5>S4>S1", //1/20/2025

 //——————————————————————————————————————————
   "19:00;18:39,18:48,17:29,16:21;6,5,4,2;N1>N2>N3>N4>N5>S4>S2>S3", //12/09/2024 
   "19:00;17:37,18:17,17:11,18:28;6,4,3,2;S4>N1>N2>N3>N4>S2>S3>N5", //12/10/2024 
   "19:00;15:30,15:50,15:50,18:45;4,3,3,1;S2>S3>S4>N1>N2>N3>N5>N4", //12/11/2024 
   "19:00;17:31,18:40,18:43,18:49;6,5,5,2;N1>N2>N3>N4>S2>S3>S4>N5", //12/14/2024? 
   "19:00;17:31,18:40,18:43,18:49;6,5,5,2;N1>N2>N3>N4>S2>S3>S4>N5", //12/14/2024 
   "19:00;18:45,18:46,18:46,18:45;7,6,6,3;N1>N2>N3>N4>S2>N5>S3>S4", //12/16/2024 Interesting case.  Probably should take into account seconds in the final add in order to break ties. Or keep note of which was added first. 
   // 19:00; No data for 12/27/2024
   "19:00;18:34,17:07,17:42,18:46;6,4,4,2;N1>N2>N3>N4>S3>S4>S2>N5", //12/18/2024
   // "19:00;18:17,18:46,18:43,18:23;N1>S2>N2>N3>N4>S3>N5>S4", //12/19/2024
   "19:00;18:17,18:46,18:43,18:23;6,5,4,2;N1>N2>N3>N4>S2>N5>S4>S3", //12/20/2024
   "19:00;18:47,17:55,17:58,17:00;6,4,3,1;N5>N1>S4>N2>N3>N4>S3>S2", //12/21/24
   "19:00;18:03,19:53,16:45,17:13;4,4,2,1;S4>N5>N1>N2>S2>N3>N4>S3", //12/22/24
   "19:00;18:13,16:45,18:19,17:18;4,3,3,1;S3>N5>N1>N2>S2>S4>N3>N4", //12/23/24
   "19:00;18:34,17:07,17:42,18:46;6,4,4,2;N1>N2>N3>N4>S3>S4>S2>N5", //12/24/24
 
   // 19:00; “S3>N1>N2>N5>N3>S4>S2>N4”, 12/25/2024
   // 19:00; “N1>S4>N2>N3>N4>S3>N5>S2”, 12/26/2024
   // 19:00; “N1>N2>N3>N4>N5>S3>S4>S2”, 12/27/2024
   "19:00;18:44,18:06,18:37,17:45;5,3,3,1;N1>N5>N2>S3>N3>S4>S2>N4", //12/28/2024
   "19:00;17:58,18:55,17:58,18:36;5,5,3,2;N1>S4>S2>N2>N3>N4>N5>S3", //12/29/2024 break ties with CLR
   "19:00;17:46,17:50,16:40,17:01;5,4,3,1;S4>N5>N1>S2>N2>N3>N4>S3", //12/30/2024
   "19:00;17:29,17:15,17:16,17:41;4,3,3,2;S3>S4>S2>N1>N2>N3>N4>N5", //12/31/2024
   "19:00;18:59,17:19,18:01,18:32;5,3,3,2;S3>N1>N2>S4>N3>S2>N4>N5", //1/1/2025 0.63 cutoff changed to 0.67 cutoff
   "19:00;18:55,17:54,18:36,18:49;4,3,3,2;N1>S3>N2>N3>S4>S2>N4>N5", //1/2/2025
   "19:00;18:41,18:46,18:32,18:33;5,4,4,2;N1>N2>N3>S2>N4>S4>N5>S3", //1/3/2025 cutoff 0.63 changed
   
"19:00;18:41,18:02,18:55,18:21;6,4,4,2;N1>N2>N3>N4>S3>N5>S2>S4", //1/4/2025 cutoff 0.63
   
"19:00;17:47,18:46,18:28,17:04;5,4,3,1;N5>N1>S2>N2>S4>N3>N4>S3", //1/5/2025
   "19:00;18:35,18:34,17:49,18:38;5,4,3,2;N1>S4>N2>N3>S2>N4>S3>N5", //1/6/2025
   "19:00;18:46,17:30,17:40,18:38;6,5,5,2;N1>N2>N3>N4>S4>S3>N5>S2", //1/7/2025
   "19:00;18:40,15:46,16:45,17:48;6,3,3,1;S3>S4>N1>N5>N2>N3>N4>S2", //1/8/2025
 
"19:00;18:39,19:00,18:26,18:24;6,5,5,2;N1>N2>N3>N4>N5>S2>S3>N1>N2>S4>N3>N4>N5>S2>S3", //1/9/2025
 "19:00;18:15,18:39,18:41,17:53;5,4,4,2;N1>N2>N3>N4>N5>S2>S3>S4", //1/10/2025
 
"19:00;18:14,18:12,19:02,17:26;5,4,3,1;N5>N1>N2>S2>N3>N4>S3>S4", //1/11/2025
 
"19:00;16:55,18:45,17:41,18:17;3,3,2,1;S2>N1>S4>N2>N5>N3>S3>N4", //1/12/2025

"19:00;17:32,18:12,18:25,18:19;6,5,5,2;N1>N2>N3>N4>S2>S3>N5>N1>N2>S4>N3>N4>S2>S3>N5", //1/13/2025

"19:00;17:34,18:28,18:14,18:47;5,4,3,2;S2>N1>N2>S4>N3>N4>S3>N5", //1/14/2025
 
"19:00;18:27,16:05,18:32,18:07;5,3,3,2;S3>N1>N2>S2>N3>S4>N4>N5", //1/15/2025

"19:00;17:56,18:13,18:40,18:41;4,4,3,2;N1>S2>N2>N3>S3>S4>N4>N5", //1/16/2025, GOOG error misplaced N5 before S3 and S4. 
 
"19:00;18:15,18:39,18:23,18:39;5,5,4,3;N1>N2>S2>N3>N4>S4>S3>N5", //1/17/2025

"19:00;18:15,18:05,18:23,18:57;4,3,3,2;N1>N2>S3>S2>N3>S4>N4>N5", //1/18/2025

"19:00;18:57,18:42,18:53,18:56;4,3,3,2;N1>N2>N3>S3>S4>S2>N4>N5", //1/19/2025

"19:00;18:40,18:45,18:50,18:50;4,4,4,2;N1>N2>N3>S2>S3>N4>S4>N5", //1/20/2025

 
 //5pm Guide
 //S1 1/7=0.14;2/7=0.29;3/7=0.43;4/7=0.57;5/7=0.714;6/7=0.86;7/7=1.0
 //S2 1/6=0.167;2/6=0.33;3/6=0.50;4/6=0.67;5/6=0.833;6/6=1.0
 //S3 1/4=0.25;2/4=0.50;3/4=0.75;4/4=1.0
 //S4 1/3=0.33;2/3=0.67;3/3=1.0
 
 //7pm Guide
 //S2 1/8=0.125;2/8=0.2;3/8=0.375;4/8=0.5;5/8=0.625;6/8=0.75;7/8=;8/8=1.0
 //S3 1/6=0.167;2/6=0.33;3/6=0.5;4/6=0.67;5/6=0.833;6/6=1.0
 //S4 1/5=0.2;2/5=0.40;3/5=0.60;4/5=0.80;5/5=1.0
 //Cutoff = 0.623
 
 //4pm Guide
 //DA 1/9=0.11;2/9=0.22;3/9=0.33;4/9=0.44;5/9=0.55;6/9=0.66;7/9=0.770;8/9=0.88;9/9=1.0
 //S1 1/7=0.14;2/7=0.29;3/7=0.43;4/7=0.57;5/7=0.714;6/7=0.86;7/7=1.0
 //S2 1/6=0.167;2/6=0.33;3/6=0.50;4/6=0.67;5/6=0.833;6/6=1.0
 //S3 1/4=0.25;2/4=0.50;3/4=0.75;4/4=1.0
 //S4 1/3=0.33;2/3=0.67;3/3=1.0
 
 //Break ties and favor swing because nights have 0 patients.

// "16:00;15:10,15:41,14:32,14:33,14:41;5,4,3,2,2;DA>S2>S1>S3>S4", //12/09/2024 fascinating
//  "16:00;14:52,15:10,15:12,15:13,15:17;5,4,4,3,2;DA>S1>S2>S3>S4", //12/10/2024
//  "16:00;14:49,15:20,15:30,15:50,15:50;6,4,4,3,3;DA>S1>S2>S3>S4", //12/11/2024 fascinating
//  "16:00;15:15,16:00,15:15,14:40,14:40;6,5,4,3,3;DA>S2>S1>S3>S4", //12/14/2024? fascinating
//  "16:00;14:55,15:45,14:10,14:45,14:46;6,4,3,2,2;S2>S3>S4>DA>S1", //12/14/2024
//  "16:00;13:18,14:10,14:50,14:55,15:45;4,3,3,2,2;DA>S1>S2>S3>S4", //12/15/2024
//  "16:00;14:13,14:54;15:55,13:26,16:00;5,4,4,2,2;DA>S3>S1>S2>S4", //12/16/2024
//  "16:00;14:50,15:00,15:10,15:15,16:00;6,4,4,3,2;DA>S1>S2>S3>S4", //12/18/2024
//  // 12/19/2024 No data
//  // 12/20/2024 No data
//  // 12/21/2024 No data
//  // 12/22/2024 No data
//  // 12/23/2024 No data
//  "16:00;15:15,16:00,15:15,16:08,16:33;6,5,4,3,3;DA>S2>S1>S3>S4", //12/24/24?
//  "16:00;15:45,15:55,14:30,15:15,15:50;7,6,4,3,2;S2>S3>DA>S4>S1", //12/24/24
//  // 12/25/2024 No data
//  "16:00;13:30,13:42,15:30,15:45,15:10;4,3,3,2,1;DA>S1>S4>S2>S3", //12/28/2024
//  "16:00;14:30,14:30,15:24,15:55,14:00;5,4,3,3,1;S4>DA>S1>S2>S3", //12/29/2024
//  "16:00;15:35,14:45,14:46,14:50,15:34;5,3,3,2,2;S1>S2>S3>S4>DA", //12/30/2024
//  "16:00;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //12/31/2024
//  "16:00;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //1/1/2025
//  "16:00;15:20,16:20,16:30,16:45;4,4,3,3;DA>S1>S2>S3>S4", //1/3/2025




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
