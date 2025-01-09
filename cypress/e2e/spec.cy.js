const url = "http://localhost:3001/sad"; //"https://sadqueue.github.io/sad/";


const testArrFourPM = [

//from email
"5:00PM;15:10,15:41,14:32,14:33;4,3,2;S3>N5>S1>S2>S4", // --> old: 4:00PM;15:10,15:41,14:32,14:33,14:41;5,4,3,2,2;DA>S2>S1>S3>S4

"5:00PM;16:36,16:16,16:19,16:31;5,4,3,3;N5>S4>S1>S3>S2", // --> old: 5:00PM;16:36,16:16,16:19,16:31;5,4,3,3;N5>S2>S3>S4>S1

"7:00PM;18:39,18:48,17:29,16:21;6,5,4,2;N1>N2>N3>N4>S4>N5>S2>S3", //12/09/2024 



// "4:00pm;14:52,15:10,15:12,15:13;15:17;5,4,4,3,2;DA>S1>S2>S3>S4", //12/10/2024

// "5:00pm;16:31,16:48,16:48,15:17;5,5,4,2;N5>S4>S1>S2>S3", //12/10/2024

// "7:00pm;17:37,18:17,17:11,18:28;6,4,3,2;S4>N1>N2>N3>N4>S2>S3>N5", //12/10/2024 



// "4:00pm;14:49,15:20,15:30,15:50,15:50;6,4,4,3,3;DA>S1>S2>S3>S4", //12/11/2024 fascinating

// "5:00pm;16:43,15:30,15:50,15:50;5,4,3,3;N5>S2>S3>S4>S1", //12/11/2024

// "7:00pm;15:30,15:50,15:50,18:45;4,3,3,1;S2>S3>S4>N1>N2>N3>N5>N4", //12/11/2024 



// "4:00pm;15:15,16:00,15:15,14:40,14:40;6,5,4,3,3;DA>S2>S1>S3>S4", //12/14/2024? fascinating

// "5:00pm;16:00,15:15,16:08,16:33;5,5,4,4;N5>S2>S1>S3>S4", //12/14/2024?

// "7:00pm;17:31,18:40,18:43,18:49;6,5,5,2;N1>N2>N3>N4>S2>S3>S4>N5", //12/14/2024? 



// "4:00pm;14:55,15:45,14:10,14:45,14:46;6,4,3,2,2;S2>S3>S4>DA>S1", //12/14/2024

// "5:00pm;15:45,16:25,16:26,14:46;,4,4,3,2;N5>S4>S1>S2>S3", //12/14/2024

// "7:00pm;17:31,18:40,18:43,18:49;6,5,5,2;N1>N2>N3>N4>S2>S3>S4>N5", //12/14/2024 



// "4:00pm;13:18,14:10,14:50,14:55,15:45;4,3,3,2,2;DA>S1>S2>S3>S4", //12/15/2024

// “5:00pm;16:44,14:50,14:55,15:45;4,3,2,2;S2>S3>N5>S4>S1", //12/15/2024



// "4:00pm;14:13,14:54;15:55,13:26,16:00;5,4,4,2,2;DA>S3>S1>S2>S4", //12/16/2024

// "5:00pm;17:18,16:45,16:07,17:17;5,5,3,3;N5>S3>S2>S4>S1", //12/16/2024

// "7:00pm;18:45,18:46,18:46,18:45;7,6,6,3;N1>N2>N3>N4>S2>N5>S3>S4", //12/16/2024 Interesting case.  Probably should take into account seconds in the final add in order to break ties. Or keep note of which was added first. 





// "4:00pm;14:50,15:00,15:10,15:15,16:00;6,4,4,3,2;DA>S1>S2>S3>S4", //12/18/2024

// "5:00pm;16:34,16:34,15:15,16:00;5,5,3,3;N5>S3>S4>S1>S2", //12/18/2024

// "7:00pm;18:34,17:07,17:42,18:46;6,4,4,2;N1>N2>N3>N4>S3>S4>S2>N5", //12/18/2024



// "5:00pm;16:26,16:54,16:56,16:15;4,3,3,2;N5>S4>S1>S2>S3", //12/19/2024

// "7:00pm;18:17,18:46,18:43,18:23;N1>S2>N2>N3>N4>S3>N5>S4", //12/19/2024



// "5:00pm;16:30,17:00,15:50,15:35;5,5,3,2; N5>S4>S3>S1>S2", //12/20/2024

// "7:00pm;18:17,18:46,18:43,18:23;N1>N2>N3>N4>S2>N5>S4>S3", //12/20/2024



// "7:00pm;18:47,17:55,17:58,17:00;6,4,3,1;N5>N1>S4>N2>N3>N4>S3>S2", //12/21/24



// "4:00pm;15:15,16:00,15:15,16:08,16:33;6,5,4,3,3;DA>S2>S1>S3>S4", //12/24/24

// "5:00pm;16:00,15:15,16:08,16:33;5,4,4,4;N5>S2>S1>S3>S4", //12/24/24

// "7:00pm;18:34,17:07,17:42,18:46;6,4,4,2; N1>N2>N3>N4>S3>S4>S2>N5", //12/24/24



// "4:00pm;13:30,13:42,15:30,15:45,15:10;4,3,3,2,1;DA>S1>S4>S2>S3", //12/28/2024

// "5:00pm;16:16,15:30,15:45,16:20;4,3,2,2;S2>N5>S3>S1>S4”, //12/28/2024

// "7:00pm;18:44,18:06,18:37,17:45;5,3,3,1;N1>N5>N2>S3>N3>S4>S2>N4", //12/28/2024



// 4:00pm;14:30,14:30,15:24,15:55,14:00;5,4,3,3,1;S4>DA>S1>S2>S3 //12/29/2024

// 5:00pm;14:30,15:24,15:55,16:27;4,3,3,2;S2>N5>S1>S3>S4 //12/29/2024

// 7:00pm;17:58,18:55,17:58,18:36;5,5,3,2;N1>S4>

// S2>N2>N3>N4>N5>S3 //12/29/2024



// "4:00pm;15:35,14:45,14:46,14:50,15:34;5,3,3,2,2;S1>S2>S3>S4>DA", //12/30/2024

// "5:00pm;14:45,14:46,14:50,15:34;3,3,2,2;N5>S1>S2>S3>S4", //12/30/2024

// "7:00pm;17:46,17:50,16:40,17:01;5,4,3,1,S4>N5>N1>S2>N2>N3>N4>S3", //12/30/2024



// "7:00PM;17:29,17:15,17:16,17:41;4,3,3,2;S3>S4>S2>N1>N2>N3>N4>N5 //12/31/2024

// "5:00PM;16:44,15:50,15:50,15:55;4,3,2,2;N5>S2>S3>S4>S1", //12/31/2024

// "4:00PM;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //12/31/2024



// "7:00PM;18:59,17:19,18:01,18:32;5,3,3,2;S3>N1> N2>S4>N3>N4>N5>S2", //1/1/2025

// "5:00PM;16:44,15:50,15:50,15:55;4,3,2,2;N5>S2>S3>S4>S1 ", //1/1/2025

// "4:00PM;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //1/1/2025



// "7:00PM;18:55,17:54,18:36,18:49;4,3,3,2;N1>S3>N2>N3>S4>S2>N4>N5", //1/2/2025

// "5:00PM;16:35,15:20,15:30,15:30;4,2,2,2;S2>S3>N5>S1>S4", //1/2/2025



// 7:00PM;18:41,18:46,18:32,18:33;5,4,4,2;N1>N2>N3>N4>S4>N5>S2>S3, //1/3/2025

// 5:00PM;15:20,16:20,16:30,16:45;4,4,3,3;N5>S1>S2>S3>S4 //1/3/2025

// 4:00PM;15:20,16:20,16:30,16:45;4,4,3,3;DA>S1>S2>S3>S4, //1/3/2025
]


describe('template spec', () => {

  it(`4PM: fill out all timestamps and number of admissions test loop`, () => {
    cy.visit(url);

    for (let i=0; i<testArrFourPM.length; i++){     
      const splitArr = testArrFourPM[i].split(";");

      const time = splitArr[0];
      const timestamps = splitArr[1].split(",");
      const admissions = splitArr[2].split(",");
      const output = splitArr[3];
      cy.get('.timesdropdown').select(time);

      timestamps.forEach((time, timeIndexx)=>{
        const timeIndex = timeIndexx;
        // cy.get(`#timestamp_${timeIndex}`).clear().type(time)
        cy.get('.timestamp').eq(timeIndexx).clear().type(time)
      })
      admissions.forEach((admission, admissionIndexx)=>{
        const admissionIndex = admissionIndexx;
        // cy.get(`#numberOfAdmissions_${admissionIndex}`).clear().type(admission)
        cy.get('.numberOfAdmissions').eq(admissionIndexx).clear().type(admission)
      })
      cy.contains('Generate Queue').click();
      cy.contains(`Order ${time}`);
      cy.contains(output);
    }
  });

  // for (let i=0; testArrFourPM.length; i++){
    // it(`7PM: fill out all timestamps and number of admissions test ${i}`, () => {
      // cy.visit(url);

      // const splitArr = testArrFourPM.split(";");
      // const time = splitArr(0);
      // const timestamps = splitArr(1);
      // const numberOfAdmissions = splitArr(2);
      // const output = splitArr(3);

      // cy.get('.timesdropdown').select(time);
  
      // timestamps.forEach((time, timeIndex)=>{
      //   cy.get(`#timestamp_${timeIndex}`).clear().type(time)
      // })
      // admissions.forEach((admission, admissionIndex)=>{
      //   // cy.get(`#timestamp_${timeIndex}`).clear().type(time)
      //   cy.get(`#numberOfAdmissions_${timeInde}`).clear().type(admissions)
      // })
      // cy.contains('Generate Queue').click();
      // cy.contains(`Order ${time}`);
      // cy.contains(output);
    // });
    
  // }
})

//4:00PM;17:00,17:00,17:00,17:00;5,4,3,2;S4>S2>N1>N2>N3>N4>N5>S3