const url = "http://localhost:3001/sad"; //""https://sadqueue.github.io/sad/";//


const testArrFourPM = [
"16:00;15:10,15:41,14:32,14:33,14:41;5,4,3,2,2;DA>S2>S1>S3>S4", //12/09/2024 fascinating
"16:00;14:52,15:10,15:12,15:13;15:17;5,4,4,3,2;DA>S1>S2>S3>S4", //12/10/2024
"16:00;14:49,15:20,15:30,15:50,15:50;6,4,4,3,3;DA>S1>S2>S3>S4", //12/11/2024 fascinating
"16:00;15:15,16:00,15:15,14:40,14:40;6,5,4,3,3;DA>S2>S1>S3>S4", //12/14/2024? fascinating
"16:00;14:55,15:45,14:10,14:45,14:46;6,4,3,2,2;S2>S3>S4>DA>S1", //12/14/2024
"16:00;13:18,14:10,14:50,14:55,15:45;4,3,3,2,2;DA>S1>S2>S3>S4", //12/15/2024
"16:00;14:13,14:54;15:55,13:26,16:00;5,4,4,2,2;DA>S3>S1>S2>S4", //12/16/2024
"16:00;14:50,15:00,15:10,15:15,16:00;6,4,4,3,2;DA>S1>S2>S3>S4", //12/18/2024
"16:00;15:15,16:00,15:15,16:08,16:33;6,5,4,3,3;DA>S2>S1>S3>S4", //12/24/24
"16:00;13:30,13:42,15:30,15:45,15:10;4,3,3,2,1;DA>S1>S4>S2>S3", //12/28/2024
"16:00;14:30,14:30,15:24,15:55,14:00;5,4,3,3,1;S4>DA>S1>S2>S3", //12/29/2024
"16:00;15:35,14:45,14:46,14:50,15:34;5,3,3,2,2;S1>S2>S3>S4>DA", //12/30/2024
"16:00;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //12/31/2024
"16:00;15:20,16:20,16:30,16:45;4,4,3,3;DA>S1>S2>S3>S4", //1/3/2025
]

describe('template spec', () => {

  it(`Fill out all timestamps and number of admissions test loop`, () => {
    cy.visit(url);

    cy.get("select[id=timesdropdown]").should('be.visible').select("4:00PM")
    cy.wait(500)

    for (let i=0; i<testArrFourPM.length; i++){     
      const splitArr = testArrFourPM[i].split(";");

      const time = splitArr[0];
      const timestamps = splitArr[1].split(",");
      const admissions = splitArr[2].split(",");
      const output = splitArr[3];
   
      timestamps.forEach((time, timeIndexx)=>{
        const timeIndex = timeIndexx;
        if (time == "19:00"){
          cy.get(`#timestamp_${timeIndex+3}`).clear().type(time)
        } else if (time == "17:00"){
          cy.get(`#timestamp_${timeIndex+2}`).clear().type(time)
        } else {
          cy.get(`#timestamp_${timeIndex+1}`).clear().type(time)
        }
        // cy.get('.timestamp').eq(timeIndexx).clear().type(time)
      })
      admissions.forEach((admission, admissionIndexx)=>{
        const admissionIndex = admissionIndexx;
        if (time == "19:00"){
          cy.get(`#numberOfAdmissions_${admissionIndex+3}`).clear().type(admission)
 
        } else if (time == "17:00"){
          cy.get(`#numberOfAdmissions_${admissionIndex+2}`).clear().type(admission)
        } else {
          cy.get(`#numberOfAdmissions_${admissionIndex+1}`).clear().type(admission)
        }
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
