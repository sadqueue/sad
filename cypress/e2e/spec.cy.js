const url = "http://localhost:3000/sad"; //"https://sadqueue.github.io/sad/";

describe('template spec', () => {
  it('4PM default', () => {
    cy.visit(url);
    cy.contains('Generate Queue').click();
    cy.contains("Order 4:00PM");
    cy.contains("DA>S1>S2>S3>S4");
  });

  it('5PM default', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('5:00PM');
    cy.contains('Generate Queue').click();
    cy.contains("Order 5:00PM");
    cy.contains("S1>S2>S3>S4>N5");
  });

  it('7PM default', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('7:00PM');
    cy.contains('Generate Queue').click();
    cy.contains("Order 7:00PM");
    cy.contains("S2>S3>S4>N5>N1>N2>N3>N4");
  });

  it('4PM change values', () => {
    cy.visit(url);
    cy.get('#numberOfAdmissions_0')
      .clear()
      .type("100")

    cy.contains('Generate Queue').click();
    cy.contains("Order 4:00PM");
    cy.contains("S1>S2>S3>S4>DA");
  });

  it('4PM: DA has 100 admissions', () => {
    cy.visit(url);
    cy.get('#numberOfAdmissions_0')
      .clear()
      .type("100")

    cy.contains('Generate Queue').click();
    cy.contains("Order 4:00PM");
    cy.contains("S1>S2>S3>S4>DA");
  });

  it('4PM: S3 is 1:30PM', () => {
    cy.visit(url);

    cy.get('#timestamp_3')
      .clear()
      .type("13:30")
    cy.contains('Generate Queue').click();
    cy.contains("Order 4:00PM");
    cy.contains("S3>DA>S1>S2>S4");
  });


  it('5PM: S3 is 1:30PM', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('5:00PM');
    cy.get('#timestamp_3')
      .clear()
      .type("13:30")
    cy.contains('Generate Queue').click();
    cy.contains("Order 5:00PM");
    cy.contains("S4>S1>S2>S3>N5");
  });

  it('7PM: N4 is 12:00AM', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('7:00PM');
    cy.get('#timestamp_3')
      .clear()
      .type("00:00")
    cy.contains('Generate Queue').click();
    cy.contains("Order 7:00PM");
    cy.contains("N5>S2>S3>S4>N1>N2>N3>N4");
  });

  it('4PM: fill out all timestamps and number of admissions', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('4:00PM');

    cy.get('#timestamp_0').clear().type("17:00")
    cy.get('#timestamp_1').clear().type("16:00")
    cy.get('#timestamp_2').clear().type("15:00")
    cy.get('#timestamp_3').clear().type("14:00")
    cy.get('#timestamp_4').clear().type("13:00")

    cy.get('#numberOfAdmissions_0').clear().type("5")
    cy.get('#numberOfAdmissions_1').clear().type("4")
    cy.get('#numberOfAdmissions_2').clear().type("3")
    cy.get('#numberOfAdmissions_3').clear().type("2")
    cy.get('#numberOfAdmissions_4').clear().type("1")

    cy.contains('Generate Queue').click();
    cy.contains("Order 4:00PM");
    cy.contains("S4>S2>DA>S3>S1");
  });

  it('5PM: fill out all timestamps and number of admissions', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('5:00PM');

    cy.get('#timestamp_0').clear().type("17:00")
    cy.get('#timestamp_1').clear().type("16:00")
    cy.get('#timestamp_2').clear().type("15:00")
    cy.get('#timestamp_3').clear().type("14:00")

    cy.get('#numberOfAdmissions_0').clear().type("5")
    cy.get('#numberOfAdmissions_1').clear().type("4")
    cy.get('#numberOfAdmissions_2').clear().type("3")
    cy.get('#numberOfAdmissions_3').clear().type("2")

    cy.contains('Generate Queue').click();
    cy.contains("Order 5:00PM");
    cy.contains("N5>S4>S3>S2>S1");
  });

  it('7PM: fill out all timestamps and number of admissions', () => {
    cy.visit(url);
    cy.get('.timesdropdown').select('7:00PM');

    cy.get('#timestamp_0').clear().type("17:00")
    cy.get('#timestamp_1').clear().type("16:00")
    cy.get('#timestamp_2').clear().type("15:00")
    cy.get('#timestamp_3').clear().type("14:00")

    cy.get('#numberOfAdmissions_0').clear().type("5")
    cy.get('#numberOfAdmissions_1').clear().type("4")
    cy.get('#numberOfAdmissions_2').clear().type("3")
    cy.get('#numberOfAdmissions_3').clear().type("2")

    cy.contains('Generate Queue').click();
    cy.contains("Order 7:00PM");
    cy.contains("S4>S2>N1>N2>N3>N4>N5>S3");
  });
})
