describe('template spec', () => {
  it('4PM default', () => {
    cy.visit('http://localhost:3000/sad');
    cy.contains('Generate Queue').click();
    cy.contains("DA>S1>S2>S3>S4");
  });

  it('5PM default', () => {
    cy.visit('http://localhost:3000/sad');
    cy.get('.timesdropdown').select('5:00PM');
    cy.contains('Generate Queue').click();
    cy.contains("S1>S2>S3>S4>N5");
  });

  it('7PM default', () => {
    cy.visit('http://localhost:3000/sad');
    cy.get('.timesdropdown').select('7:00PM');
    cy.contains('Generate Queue').click();
    cy.contains("S2>S3>S4>N5>N1>N2>N3>N4");
  });

  it('4PM change values', () => {
    cy.visit('http://localhost:3000/sad');
    cy.get('#numberOfAdmissions_0')
      .clear()
      .type("100")

    cy.contains('Generate Queue').click();
    cy.contains("S1>S2>S3>S4>DA");
  });

  it('4PM: DA has 100 admissions', () => {
    cy.visit('http://localhost:3000/sad');
    cy.get('#numberOfAdmissions_0')
      .clear()
      .type("100")

    cy.contains('Generate Queue').click();
    cy.contains("S1>S2>S3>S4>DA");
  });
})
