const url = "http://localhost:3001/sad"; //""https://sadqueue.github.io/sad/";//


const testArrFourPM = [
// "16:00;15:10,15:41,14:32,14:33,14:41;5,4,3,2,2;DA>S2>S1>S3>S4", //12/09/2024 fascinating
// "16:00;14:52,15:10,15:12,15:13;15:17;5,4,4,3,2;DA>S1>S2>S3>S4", //12/10/2024
// "16:00;14:49,15:20,15:30,15:50,15:50;6,4,4,3,3;DA>S1>S2>S3>S4", //12/11/2024 fascinating
// "16:00;15:15,16:00,15:15,14:40,14:40;6,5,4,3,3;DA>S2>S1>S3>S4", //12/14/2024? fascinating
// "16:00;15:45,14:10,14:45,14:46;6,4,3,2,2;S2>S3>S4>DA>S1", //12/14/2024
// "16:00;13:18,14:10,14:50,14:55,15:45;4,3,3,2,2;DA>S1>S2>S3>S4", //12/15/2024
// "16:00;14:13,14:54;15:55,13:26,16:00;5,4,4,2,2;DA>S3>S1>S2>S4", //12/16/2024
// "16:00;15:15,16:00,15:15,16:08,16:33;6,5,4,3,3;DA>S2>S1>S3>S4", //12/24/24
// "16:00;15:45,15:50,15:17;4,3,3,3;S1>S2>S3>S4>S5" //12/31/24

// "17:00;16:36,16:16,16:19,16:31;5,4,3,3;N5>S2>S3>S4>S1",//12/09/2024
// "17:00;16:31,16:48,16:48,15:17;5,5,4,2;N5>S4>S1>S2>S3", //12/10/2024
// "17:00;16:43,15:30,15:50,15:50;5,4,3,3;N5>S2>S3>S4>S1", //12/11/2024
// "17:00;16:00,15:15,16:08,16:33;5,5,4,4;N5>S2>S1>S3>S4", //12/14/2024
// "17:00;16:34,16:34,15:15,16:00;5,5,3,3;N5>S3>S4>S1>S2", //12/18/2024
// "17:00;16:26,16:54,16:56,16:15;4,3,3,2;N5>S4>S1>S2>S3" ,//12/19/2024
// "17:00;18:17,18:46,18:43,18:23;N1>S2>N2>N3>N4>S3>N5>S4", //12/19/2024
// "17:00;18:34,17:07,17:42,18:46;6,4,4,2;N1>N2>N3>N4>S3>S4>S2>N5", //12/18/2024
// "17:00;16:16,15:30,15:45,16:20;4,3,2,2;S2>N5>S3>S1>S4", //12/28/2024
// "17:00;14:30,15:24,15:55,16:27;4,3,3,2;S2>N5>S1>S3>S4" //12/29/2024

"19:00;18:39,18:48,17:29,16:21;6,5,4,2;N1>N2>N3>N4>S2>S3>S4>N5", //12/09/2024
"19:00;17:37,18:17,17:11,18:28;6,4,3,2;S4>N1>N2>N3>N4>S2>S3>N5", //12/10/2024
"19:00;15:30,15:50,15:50,18:45;4,3,3,1;S2>S3>S4>N1>N2>N3>N5>N4", //12/11/2024
"19:00;17:31,18:40,18:43,18:49;6,5,5,2;N1>N2>N3>N4>S2>S3>S4>N5", //12/14/2024
"19:00;18:17,18:46,18:43,18:23;N1>S2>N2>N3>N4>S3>N5>S4", //12/19/2024
"19:00;18:47,17:55,17:58,17:00;6,4,3,1;N5>N1>S4>N2>N3>N4>S3>S2" ,//12/21/24
"19:00;18:59,17:19,18:01,18:32;5,3,3,2;S3>N1> N2>S4>N3>N4>N5>S2", //1/1/2025
"19:00;18:55,17:54,18:36,18:49;4,3,3,2;N1>S3>N2>N3>S4>S2>N4>N5", //1/2/2025
"19:00;18:41,18:46,18:32,18:33;5,4,4,2;N1>N2>N3>N4>S4>N5>S2>S3", //1/3/2025
"19:00;18:17,18:46,18:43,18:23;N1>N2>N3>N4>S2>N5>S4>S3" //1/3/2025

]

describe('template spec', () => {

  it(`Fill out all timestamps and number of admissions test loop`, () => {
    cy.visit(url);

    for (let i=0; i<testArrFourPM.length; i++){     
      const splitArr = testArrFourPM[i].split(";");

      const time = splitArr[0];
      const timestamps = splitArr[1].split(",");
      const admissions = splitArr[2].split(",");
      const output = splitArr[3];
   
      cy.get("select[id=timesdropdown]").should('be.visible').select(time)

      timestamps.forEach((time, timeIndexx)=>{
        const timeIndex = timeIndexx;
        cy.get(`#timestamp_${timeIndex+3}`).clear().type(time)
        // cy.get('.timestamp').eq(timeIndexx).clear().type(time)
      })
      admissions.forEach((admission, admissionIndexx)=>{
        const admissionIndex = admissionIndexx;
        cy.get(`#numberOfAdmissions_${admissionIndex+3}`).clear().type(admission)
        // cy.get('.numberOfAdmissions').eq(admissionIndexx).clear().type(admission)
      })
      cy.contains('Generate Queue').click();
      

      cy.get('#endoutput') // Replace 'yourElementId' with the actual ID of the element
      .then(($el) => {

        if ($el.text() == output){
          console.log("MATCHES! "+testArrFourPM[i]+ "::::::"+ $el.text());
        } else {
          console.log(testArrFourPM[i]+ "::::::"+ $el.text());

        }
        // console.log($el.text()); // Logs the value of the element
      });
      // console.log(document.getElementById("endoutput") && document.getElementById("endoutput").innerText);

      // if (time == "16:00"){
      //   cy.contains(`Order 4:00PM`);
      // } else if (time == "17:00"){
      //   cy.contains(`Order 5:00PM`);
      // } else if (time == "19:00"){
      //   cy.contains(`Order 7:00PM`);
      // }
      // cy.contains(output);
    }
  });

})
