// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-cy=login-form-username]').type(username);
  cy.get('[data-cy=login-form-password]').type(password);

  cy.get('[data-cy=login-form-submit-button]').click();
});

Cypress.Commands.add('createBlog', (title, author, url) => {
  // data-cy="blog-form-title"
  cy.get('[data-cy=blog-form-title]').type(title);
  cy.get('[data-cy=blog-form-author]').type(author);
  cy.get('[data-cy=blog-form-url]').type(url);

  cy.get('[data-cy=blog-form-submit-button]').click();
});

Cypress.Commands.add('getBlogs', (cb) => {
  cy.request('http://localhost:3002/api/blogs').as('getBlogs');
  cy.get('@getBlogs').should((response) => {
    cb(response);
  });
});
