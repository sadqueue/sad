const url = "http://localhost:3001/";//"https://sadqueue.github.io/sad/";//

const testArr5pm = [

  ["14:40,14:45,16:55,15:44;4,4,3,2;S1>S2>N5>S4>S3", "1/26/2025"],  
  
  ["16:35,16:55,16:15,16:50;3,3,2,2;N5>S1>S3>S2>S4", "1/25/2025"],
    ["16:11,14:58,14:56,15:11;4,3,2,2;S3>S2>S4>N5>S1", "1/24/2025"],
    ["16:36,16:16,16:19,16:31;5,4,3,3;N5>S2>S3>S4>S1", "12/09/2024"],
    ["16:31,16:48,16:48,15:17;5,5,4,2;S4>N5>S1>S2>S3", "12/10/2024"],
    ["16:43,15:30,15:50,15:50;5,4,3,3;N5>S2>S3>S4>S1", "12/11/2024"],
    ["16:00,15:15,16:08,16:33;5,5,4,4;N5>S2>S1>S3>S4", "12/14/2024?"],
    ["15:45,16:25,16:26,14:46;4,4,3,2;S4>N5>S1>S2>S3", "12/14/2024"],
    ["16:44,14:50,14:55,15:45;4,3,2,2;S2>S3>N5>S4>S1", "12/15/2024"],
    ["17:18,16:45,16:07,17:17;5,5,3,3;N5>S3>S2>S4>S1", "12/16/2024"],
    // 19:00; No data for 12/27/2024
    ["16:34,16:34,15:15,16:00;5,5,3,3;N5>S3>S4>S1>S2", "12/18/2024"],
    // ["19:00;18:17,18:46,18:43,18:23;N1>S2>N2>N3>N4>S3>N5>S4", "12/19/2024"],
    ["16:26,16:54,16:56,16:15;4,3,3,2;N5>S4>S1>S2>S3", "12/19/2024"],
    ["16:30,17:00,15:50,15:35;5,5,3,2;N5>S4>S3>S1>S2", "12/20/2024"],
    ["16:30,16:55,16:15,16:15;6,5,3,2;N5>S4>S3>S1>S2", "12/21/2024"],
    ["14:40,15:30,16:30,16:45;4,3,3,2;S1>N5>S2>S4>S3", "12/22/2024"],
    ["16:30,16:40,16:45,15:55;5,4,3,2;N5>S4>S2>S1>S3", "12/23/2024"],
    ["16:00,15:15,16:08,16:33;5,4,4,4;S2>N5>S1>S3>S4", "12/24/2024"],
    // 19:00; “S3>N1>N2>N5>N3>S4>S2>N4”, 12/25/2024
    // 19:00; “N1>S4>N2>N3>N4>S3>N5>S2”, 12/26/2024
    // 19:00; “N1>N2>N3>N4>N5>S3>S4>S2”, 12/27/2024
    ["16:16,15:30,15:45,16:20;4,3,2,2;N5>S2>S3>S1>S4", "12/28/2024"],
    ["14:30,15:24,15:55,16:27;4,3,3,2;S1>S2>N5>S4>S3", "12/29/2024"],
    ["14:45,14:46,14:50,15:34;3,3,2,2;S1>S2>S3>N5>S4", "12/30/2024"],
    ["16:44,15:50,15:50,15:55;4,3,2,2;N5>S3>S2>S4>S1", "12/31/2024 or 1/1/2025"],
    ["16:35,15:20,15:30,15:30;4,2,2,2;S2>N5>S3>S4>S1", "1/2/2025 need to fix ties to work"],
    ["15:20,16:20,16:30,16:45;4,4,3,3;S1>N5>S2>S3>S4", "1/3/2025"],
    ["15:50,16:20,16:45,16:20;4,4,3,2;N5>S1>S4>S2>S3", "1/4/2025"],
  
    //[17]2
    //19:00;17:46,17:50,16:40,17:01;5,4,3,1;
    //S4>N5>N1>S2>N2>N3>N4>S3::::::
    ["15:00,16:20,16:45,16:20;4,4,3,2;S1>N5>S4>S2>S3", "1/5/2025"],
    ["16:05,16:45,14:40,15:30;5,4,2,2;S3>N5>S4>S1>S2", "1/6/2025 need to fix ties to work"],
    ["14:42,15:09,16:29,16:00;5,3,4,3;S2>N5>S1>S4>S3", "1/7/2025"],
    ["16:57,16:00,15:46,16:45;5,5,3,3;N5>S3>S2>S4>S1", "1/8/2025"],
    ["16:05,16:10,16:35,16:45;5,4,3,3;N5>S2>S1>S3>S4", "1/9/2025"],
    ["16:35,16:05,16:10,16:30;4,3,2,2;N5>S2>S3>S4>S1", "1/10/2025"],
    ["16:40,16:35,14:55,15:20;5,4,3,2;N5>S3>S4>S2>S1", "1/11/2025 STRANGE ONE"],
    ["15:15,16:55,15:55,14:55;3,3,2,1;S4>S1>N5>S3>S2", "1/12/2025"],
    ["15:25,16:25,16:35,15:50;5,5,4,3;N5>S1>S4>S2>S3", "1/13/2025"],
    // "19:00;17:34,18:28,18:14,18:47;5,4,3,2;
    // N1>S2>N2>S4>S3>N3>N4>N5", //1/14/2025
    ["15:15,15:47,16:42,16:36;4,4,3,2;S1>N5>S2>S4>S3", "1/14/2025"],
    ["16:57,15:35,16:05,15:35;5,4,3,2;N5>S4>S2>S3>S1", "1/15/2025 need to fix ties"],
    ["16:26,16:40,15:02,15:26;3,3,2,1;S3>S4>N5>S1>S2", "1/16/2025"],
    ["15:45,16:54,16:00,16:07;3,3,2,2;N5>S1>S3>S4>S2", "1/17/2025"],
    ["14:59,16:23,16:13,16:32;3,3,2,2;S1>N5>S3>S2>S4", "1/18/2025"],
    ["16:30,16:32,16:33,15:20;2,2,2,1;S4>N5>S1>S2>S3", "1/19/2025"],
    ["16:21,13:40,14:52,16:18;4,2,2,2;S2>S3>N5>S4>S1", "1/20/2025"],
    ["16:37,16:14,15:40,16:24;5,4,3,3;N5>S2>S3>S4>S1", "1/21/2025"],
    ["14:41,15:40,16:32,16:42;2,2,2,2;S1>N5>S2>S3>S4", "1/22/2025"],
    // [1] 19:00;17:31,18:01,18:30,18:45;6,6,5,2;
    // N1>N2>N3>N4>S2>N5>N1>N2>S4>N3>N4>N5::::::
    // N1>N2>N3>N4>S2>S4>N5>N1>N2>N3>N4>S3>S4>N5----NO MATCH
  
    ["16:27,14:22,14:24,16:38;4,3,2,2;S2>S3>N5>S1>S4", "1/23/2025"]
  ];
  

  const testArr7pm = [

    ["14:45,16:55,15:44,18:00;6,6,5,3;N1>N2>N3>N4>S2>N1>N2>S4>N3>N4>S3>N5", "Test case high output S4=5"],
    
    ["17:38,16:55,18:28,18:00;5,5,6,2;N1>S2>N2>N3>N4>S3>N5>N1>S2>N2>N3>N4>S3>N5>S4", "Test case S2=5"],
    
    ["17:38,16:55,18:28,18:00;5,3,3,1;S3>N1>S2>N2>N5>S4>N3>N4", "1/26/2025"],
    
    ["17:31,18:05,17:20,17:55;4,4,3,2;S4>N1>S2>N2>S3>N3>N4>N5", "1/25/2025"],
    
      //Scenario 1: 
      //S3: 6 admissions
      //S4: 3+ admissions
      //N5: 3+ admissions
      //Senario 2
      //S4: 5 admissions
      //Scenario 3
      //S3: 5 admissions
    
      ["17:31,18:01,18:30,18:45;6,6,5,2;N1>N2>N3>N4>S2>N5>N1>N2>S4>N3>N4>S3>N5", "Test Cases for High Output Scenario (S3 has 6 admissions))"],
      ["17:31,18:01,18:30,18:45;6,4,6,3;N1>N2>S3>N3>N4>S2>N1>N2>S3>N3>N4>S4>N5", "Test Cases for High Output Scenario 1 (S4 has 3+ admissions)"],
      ["17:31,18:01,18:30,18:45;6,6,5,2;N1>N2>N3>N4>S2>N5>N1>N2>S4>N3>N4>S3>N5", "Test Cases for High Output Scenario 1 (S3 has 6 admissions), Scenario 2 (S5 has 5 admissions)"],
      ["17:31,18:01,18:30,18:45;6,5,4,2;N1>N2>N3>N4>S2>S3>S4>N5", "Test Cases for High Output Scenario 3 (S3 has 5 admissions)"],
    
      // if we included scenario3
      //["17:31,18:01,18:30,18:45;6,5,4,2;N1>N2>N3>N4>S2>S3>S4>N5>N1>S3>N2>N3>N4>S4>N5", "Test Cases for High Output Scenario 3 (S3 has 5 admissions)"]
    
      ["17:07,17:03,18:00,18:05;4,4,3,1;S3>S2>N1>N2>S4>N5>N3>N4", "1/24/2025"],
      ["18:39,18:48,17:29,16:21;6,5,4,2;N1>N2>N3>N4>N5>S4>S2>S3", "12/09/2024"], // 12/09/2024
      ["17:37,18:17,17:11,18:28;6,4,3,2;S4>N1>N2>S3>N3>N4>S2>N5", "12/10/2024"], // 12/10/2024
      ["15:30,15:50,15:50,18:45;4,3,3,1;S2>S3>S4>N1>N2>N3>N5>N4", "12/11/2024"], // 12/11/2024
      ["17:31,18:40,18:43,18:49;6,5,5,2;N1>N2>N3>N4>S2>S3>N5>N1>N2>S4>N3>N4>S3>N5", "12/14/2024"], // 12/14/2024
      ["18:45,18:46,18:46,18:45;7,6,6,3;N1>N2>N3>N4>N1>N2>N3>N4>S3>S4>N5", "12/16/2024 Interesting case. Probably should take into account seconds in the final add in order to break ties. Or keep note of which was added first."], // 12/16/2024
      ["18:34,17:07,17:42,18:46;6,4,4,2;S3>N1>N2>N3>N4>S4>S2>N5", "12/18/2024"], // 12/18/2024
      ["18:17,18:46,18:43,18:23;6,5,4,2;N1>N2>N3>N4>S2>N5>S4>S3", "12/20/2024"], // 12/20/2024
      ["18:47,17:55,17:58,17:00;6,4,3,1;N5>N1>S3>S4>N2>N3>N4>S2", "12/21/2024"], // 12/21/2024
      ["18:03,19:53,16:45,17:13;4,4,2,1;S4>N5>N1>N2>S2>N3>N4>S3", "12/22/2024"], // 12/22/2024
      ["18:13,16:45,18:19,17:18;4,3,3,1;S3>N5>N1>N2>S2>S4>N3>N4", "12/23/2024"], // 12/23/2024
      ["18:44,18:06,18:37,17:45;5,3,3,1;N1>N5>N2>S3>N3>S4>S2>N4", "12/28/2024"], // 12/28/2024
      ["17:58,18:55,17:58,18:36;5,5,3,2;N1>S4>S2>N2>N3>N4>N5>S3", "12/29/2024 break ties with CLR"], // 12/29/2024
      ["17:46,17:50,16:40,17:01;5,4,3,1;S4>N5>N1>S2>S3>N2>N3>N4", "12/30/2024"], // 12/30/2024
      ["17:29,17:15,17:16,17:41;4,3,3,2;S3>S4>S2>N1>N2>N3>N4>N5", "12/31/2024"], // 12/31/2024
      ["18:59,17:19,18:01,18:32;5,3,3,2;S3>N1>N2>S4>N3>S2>N4>N5", "01/01/2025 0.63 cutoff changed to 0.67 cutoff"], // 01/01/2025
      ["18:55,17:54,18:36,18:49;4,3,3,2;N1>S3>N2>N3>S4>S2>N4>N5", "01/02/2025"], // 01/02/2025
      ["18:41,18:46,18:32,18:33;5,4,4,2;N1>N2>N3>S2>S3>N4>S4>N5", "01/03/2025 cutoff 0.63 changed"], // 01/03/2025
      ["18:41,18:02,18:55,18:21;6,4,4,2;N1>N2>S3>N3>N4>N5>S2>S4", "01/04/2025 cutoff 0.63"], // 01/04/2025
      ["17:47,18:46,18:28,17:04;5,4,3,1;N5>N1>S2>N2>S4>N3>S3>N4", "01/05/2025"], // 01/05/2025
      ["18:35,18:34,17:49,18:38;5,4,3,2;N1>S4>N2>N3>S3>S2>N4>N5", "01/06/2025"], // 01/06/2025
      
    ["18:46,17:30,17:40,18:38;6,5,5,2;N1>N2>N3>N4>S3>N5>S2>N1>N2>S4>N3>N4>S3>N5", "01/07/2025"], // 01/07/2025
    
    ["18:40,15:46,16:45,17:48;6,3,3,1;S3>S4>N1>N5>N2>N3>N4>S2", "01/08/2025"], // 01/08/2025
      ["18:39,19:00,18:26,18:24;6,5,5,2;N1>N2>N3>N4>N5>S2>S3>N1>N2>S4>N3>N4>N5>S3", "01/09/2025"], // 01/09/2025
      ["18:15,18:39,18:41,17:53;5,4,4,2;N1>N2>S2>N3>S3>N4>N5>S4", "01/10/2025"], // 01/10/2025
      ["18:14,18:12,19:02,17:26;5,4,3,1;N5>N1>N2>S3>S2>N3>N4>S4", "01/11/2025"], // 01/11/2025
      ["16:55,18:45,17:41,18:17;3,3,2,1;S2>N1>S4>N2>N5>N3>S3>N4", "01/12/2025"], // 01/12/2025
      ["17:32,18:12,18:25,18:19;6,5,5,2;N1>N2>N3>N4>S2>S3>N5>N1>N2>S4>N3>N4>S3>N5", "01/13/2025"], // 01/13/2025
      ["18:27,16:05,18:32,18:07;5,3,3,2;S3>N1>N2>S2>N3>S4>N4>N5", "01/15/2025"], // 01/15/2025
      ["17:56,18:13,18:40,18:41;4,4,3,2;N1>S2>N2>S3>N3>S4>N4>N5", "01/16/2025"], // 01/16/2025
    
      ["18:15,18:39,18:23,18:39;5,5,4,3; N1>N2>S2>N3>N4>S4>S3>N1>N2>S2>N3>N4>S4>S3>N5", "1/17/2025"],
      ["18:15,18:05,18:23,18:57;4,3,3,2;N1>N2>S3>S2>S4>N3>N4>N5", "1/18/2025"],
      ["18:57,18:42,18:53,18:56;4,3,3,2;N1>N2>N3>S3>S4>S2>N4>N5", "1/19/2025"],
      ["18:40,18:45,18:50,18:50;4,4,4,2;N1>N2>N3>S2>S3>N4>S4>N5", "1/20/2025"],
    
      ["18:08,18:14,18:46,18:08;6,5,5,2; N1>N2>N3>N4>S2>N5>S3>N1>N2>S4>N3>N4>N5>S3", "1/21/2025"],
      ["18:56,17:51,18:16,18:37;4,3,3,2;N1>S3>N2>S4>N3>S2>N4>N5", "1/22/2025"],
    
      ["18:25,18:35,17:42,18:41;5,4,3,2; N1>S4>N2>S2>N3>S3>N4>N5", "1/23/2025"],
    ]
    

const testArr4pm = [
  // "15:10,15:41,14:32,14:33,14:41;5,4,3,2,2;DA>S2>S1>S3>S4", //12/09/2024 fascinating
  //  "14:52,15:10,15:12,15:13,15:17;5,4,4,3,2;DA>S1>S2>S3>S4", //12/10/2024
  //  "14:49,15:20,15:30,15:50,15:50;6,4,4,3,3;DA>S1>S2>S3>S4", //12/11/2024 fascinating
  //  "15:15,16:00,15:15,14:40,14:40;6,5,4,3,3;DA>S2>S1>S3>S4", //12/14/2024? fascinating
  //  "14:55,15:45,14:10,14:45,14:46;6,4,3,2,2;S2>S3>S4>DA>S1", //12/14/2024
  //  "13:18,14:10,14:50,14:55,15:45;4,3,3,2,2;DA>S1>S2>S3>S4", //12/15/2024
  //  "14:13,14:54;15:55,13:26,16:00;5,4,4,2,2;DA>S3>S1>S2>S4", //12/16/2024
  //  "14:50,15:00,15:10,15:15,16:00;6,4,4,3,2;DA>S1>S2>S3>S4", //12/18/2024
  //  // 12/19/2024 No data
  //  // 12/20/2024 No data
  //  // 12/21/2024 No data
  //  // 12/22/2024 No data
  //  // 12/23/2024 No data
  //  "15:15,16:00,15:15,16:08,16:33;6,5,4,3,3;DA>S2>S1>S3>S4", //12/24/24?
  //  "15:45,15:55,14:30,15:15,15:50;7,6,4,3,2;S2>S3>DA>S4>S1", //12/24/24
  //  // 12/25/2024 No data
  //  "13:30,13:42,15:30,15:45,15:10;4,3,3,2,1;DA>S1>S4>S2>S3", //12/28/2024
  //  "14:30,14:30,15:24,15:55,14:00;5,4,3,3,1;S4>DA>S1>S2>S3", //12/29/2024
  //  "15:35,14:45,14:46,14:50,15:34;5,3,3,2,2;S1>S2>S3>S4>DA", //12/30/2024
  //  "14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //12/31/2024
  //  "14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //1/1/2025
  //  "15:20,16:20,16:30,16:45;4,4,3,3;DA>S1>S2>S3>S4", //1/3/2025
]

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

          cy.get('#orderofadmissions_output') // Replace 'yourElementId' with the actual ID of the element
            .then(($el) => {

              const generatedFromAutomation = $el.text() && $el.text().replace(/\(.*?\)/g, "").trim();

              if (generatedFromAutomation && generatedFromAutomation == output.trim()) {
                // console.log(testArr[i] + "::::::" + $el.text() + "----MATCHES");
                // resArr.push(testArr[i] + "::::::" + $el.text() + "----MATCHES");
              } else {
                console.log("[" + count + "] 5PM " + testArr5pm[i][1] + " -- NO MATCH");
                console.log("Data:              ", testArr5pm[i][0].split(";").slice(0, testArr5pm[i][0].split(";").length - 1).join(";"));
                console.log("Manny:             ", output);
                console.log("Current Algo:      ", $el.text());

                cy.get("#seedetails").click();
                cy.contains("Set Composite Algorithm").click()
                cy.get("#compositeScoreCheckbox").click();

                cy.get(`#alr`).clear().type(0.7);
                cy.get(`#clr`).clear().type(0.3);
                cy.get("#generateQueue").click();

                //S1(ALR,CLR,C_score)>S2(ALR,CLR,C_score)>S4(ALR,CLR,C_score)>N5(ALR,CLR,C_score)>S3(ALR,CLR,score)
                cy.get('#orderofadmissions_output').then(($el) => {
                    console.log(`CS_Algo(0.7):      ${$el.text()}`)
                });
            

            }
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
