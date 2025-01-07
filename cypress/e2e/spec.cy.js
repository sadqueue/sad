const url = "http://localhost:3000/sad"; //"https://sadqueue.github.io/sad/";


// "4:00PM;17:00,17:00,17:00,17:00,17:00;5,4,3,2,1;DA>S2>S4>S1>S3",
// "4:00PM;17:00,17:00,17:00,17:00,17:00;5,4,3,2,1;DA>S2>S4>S1>S3",
// "4:00PM;17:00,17:00,17:00,17:00,17:00;5,4,3,2,1;DA>S2>S4>S1>S3",
// "4:00PM;17:00,17:00,17:00,17:00,17:00;5,4,3,2,1;DA>S2>S4>S1>S3",
// "4:00PM;17:00,17:00,17:00,17:00,17:00;5,4,3,2,1;DA>S2>S4>S1>S3",

const testArrFourPM = [
  // "7:00PM;17:00,17:00,17:00,17:00;5,4,3,2;S2>S4>N1>N2>N3>N4>S3>N5",
  // "7:00PM;17:29,17:15,17:16,17:41;4,3,3,2;S3>S4>S2>N1>N2>N3>N4>N5",
  "5:00PM;16:44,15:50,15:50,15:55;4,3,2,2;N5>S2>S3>S1>S4",
  // "4:00PM;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4"

  "4:00PM;13:30,13:42,15:30,15:45,15:10;4,3,3,2,1;DA>S1>S4>S2>S3", //12/28/2024
"5:00PM;16:16,15:30,15:45,16:20;4,3,2,2;S2>N5>S3>S1>S4", //12/28/2024
"7:00PM;18:44,18:06,18:37,17:45;5,3,3,1;N1>N5>N2>S3>N3>S4>S2>N4", //12/28/2024

"4:00PM;13:30,13:42,15:30,15:45,15:10;4,3,3,2,1;DA>S1>S4>S2>S3", //12/28/2024
"5:00PM;16:16,15:30,15:45,16:20;4,3,2,2;S2>N5>S3>S1>S4", //12/28/2024
"7:00PM;18:44,18:06,18:37,17:45;5,3,3,1;N1>N5>N2>S3>N3>S4>S2>N4", //12/28/2024

"4:00PM;15:35,14:45,14:46,14:50,15:34;5,3,3,2,2;S1>S2>S3>S4>DA", //12/30/2024
"5:00PM;14:45,14:46,14:50,15:34;3,3,2,2;N5>S1>S2>S3>S4", //12/30/2024
"7:00PM;17:46,17:50,16:40,17:01;5,4,3,1,S4>N5>N1>S2>N2>N3>N4>S3", //12/30/2024

"7:00PM;17:29,17:15,17:16,17:41;4,3,3,2;S3>S4>S2>N1>N2>N3>N4>N5", //12/31/2024
"5:00PM;16:44,15:50,15:50,15:55;4,3,2,2;N5>S2>S3>S4>S1", //12/31/2024
"4:00PM;14:35,15:20,15:50,15:50,15:55;4,3,3,2,2;DA>S1>S2>S3>S4", //12/31/2024

]


describe('template spec', () => {
  // it('4PM default', () => {
  //   cy.visit(url);
  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 4:00PM");
  //   cy.contains("DA>S1>S2>S3>S4");
  // });

  // it('5PM default', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('5:00PM');
  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 5:00PM");
  //   cy.contains("S1>S2>S3>S4>N5");
  // });

  // it('7PM default', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('7:00PM');
  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 7:00PM");
  //   cy.contains("S2>S3>S4>N5>N1>N2>N3>N4");
  // });

  // it('4PM change values', () => {
  //   cy.visit(url);
  //   cy.get('#numberOfAdmissions_0')
  //     .clear()
  //     .type("100")

  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 4:00PM");
  //   cy.contains("S1>S2>S3>S4>DA");
  // });

  // it('4PM: DA has 100 admissions', () => {
  //   cy.visit(url);
  //   cy.get('#numberOfAdmissions_0')
  //     .clear()
  //     .type("100")

  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 4:00PM");
  //   cy.contains("S1>S2>S3>S4>DA");
  // });

  // it('4PM: S3 is 1:30PM', () => {
  //   cy.visit(url);

  //   cy.get('#timestamp_3')
  //     .clear()
  //     .type("13:30")
  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 4:00PM");
  //   cy.contains("S3>DA>S1>S2>S4");
  // });


  // it('5PM: S3 is 1:30PM', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('5:00PM');
  //   cy.get('#timestamp_3')
  //     .clear()
  //     .type("13:30")
  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 5:00PM");
  //   cy.contains("S4>S1>S2>S3>N5");
  // });

  // it('7PM: N4 is 12:00AM', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('7:00PM');
  //   cy.get('#timestamp_3')
  //     .clear()
  //     .type("00:00")
  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 7:00PM");
  //   cy.contains("N5>S2>S3>S4>N1>N2>N3>N4");
  // });

  // it('4PM: fill out all timestamps and number of admissions', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('4:00PM');

  //   cy.get('#timestamp_0').clear().type("17:00")
  //   cy.get('#timestamp_1').clear().type("16:00")
  //   cy.get('#timestamp_2').clear().type("15:00")
  //   cy.get('#timestamp_3').clear().type("14:00")
  //   cy.get('#timestamp_4').clear().type("13:00")

  //   cy.get('#numberOfAdmissions_0').clear().type("5")
  //   cy.get('#numberOfAdmissions_1').clear().type("4")
  //   cy.get('#numberOfAdmissions_2').clear().type("3")
  //   cy.get('#numberOfAdmissions_3').clear().type("2")
  //   cy.get('#numberOfAdmissions_4').clear().type("1")

  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 4:00PM");
  //   cy.contains("S4>S2>DA>S3>S1");
  // });

  // it('5PM: fill out all timestamps and number of admissions', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('5:00PM');

  //   cy.get('#timestamp_0').clear().type("17:00")
  //   cy.get('#timestamp_1').clear().type("16:00")
  //   cy.get('#timestamp_2').clear().type("15:00")
  //   cy.get('#timestamp_3').clear().type("14:00")

  //   cy.get('#numberOfAdmissions_0').clear().type("5")
  //   cy.get('#numberOfAdmissions_1').clear().type("4")
  //   cy.get('#numberOfAdmissions_2').clear().type("3")
  //   cy.get('#numberOfAdmissions_3').clear().type("2")

  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 5:00PM");
  //   cy.contains("N5>S4>S3>S2>S1");
  // });

  // it('7PM: fill out all timestamps and number of admissions', () => {
  //   cy.visit(url);
  //   cy.get('.timesdropdown').select('7:00PM');

  //   cy.get('#timestamp_0').clear().type("17:00")
  //   cy.get('#timestamp_1').clear().type("16:00")
  //   cy.get('#timestamp_2').clear().type("15:00")
  //   cy.get('#timestamp_3').clear().type("14:00")

  //   cy.get('#numberOfAdmissions_0').clear().type("5")
  //   cy.get('#numberOfAdmissions_1').clear().type("4")
  //   cy.get('#numberOfAdmissions_2').clear().type("3")
  //   cy.get('#numberOfAdmissions_3').clear().type("2")

  //   cy.contains('Generate Queue').click();
  //   cy.contains("Order 7:00PM");
  //   cy.contains("S4>S2>N1>N2>N3>N4>N5>S3");
  // });


  it(`4PM: fill out all timestamps and number of admissions test loop`, () => {
    cy.visit(url);

    for (let i=0; i<testArrFourPM.length; i++){     
      const splitArr = testArrFourPM[i].split(";");

      const time = splitArr[0];
      const timestamps = splitArr[1].split(",");
      const admissions = splitArr[2].split(",");
      const output = splitArr[3];
      cy.get('.timesdropdown').select(time);

      timestamps.forEach((time, timeIndex)=>{
        cy.get(`#timestamp_${timeIndex}`).clear().type(time)
      })
      admissions.forEach((admission, admissionIndex)=>{
        cy.get(`#numberOfAdmissions_${admissionIndex}`).clear().type(admission)
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