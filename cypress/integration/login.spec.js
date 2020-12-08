describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3002/api/testing/reset');
    cy.request('POST', 'http://localhost:3002/api/users',
      { username: 'root', password: 'helloworld' });
    cy.visit('http://localhost:3004');
  });

  it('Login form is shown', () => {
    cy.get('[data-cy=login-form]').should('exist');
  });

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.server();
      cy.route('POST', '*api/login').as('loginUser');
      cy.login('root', 'helloworld');
      cy.wait('@loginUser').should((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    });

    it('fails with wrong credentials', () => {
      cy.server();
      cy.route('POST', '*api/login').as('loginUser');
      cy.login('root', 'bingo');
      cy.wait('@loginUser').should((xhr) => {
        expect(xhr.status).to.equal(401);
        cy.get('[data-cy=notification-message]').should('have.css', 'border-color', 'rgb(255, 0, 0)');
      });
    });
  });
});
