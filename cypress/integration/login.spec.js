describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3002/api/testing/reset');
    cy.request('POST', 'http://localhost:3002/api/users',
      { username: 'root', password: 'helloworld' });
    cy.request('POST', 'http://localhost:3002/api/users',
      { username: 'abcd8294', password: 'helloworld8294' });
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

  describe.only('When logged in', () => {
    beforeEach(() => {
      cy.server();
      cy.route('POST', '*api/login').as('loginUser');

      cy.login('root', 'helloworld');
      cy.wait('@loginUser').should((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    });

    it('A blog can be created', () => {
      // Test if user can create a new blog
      cy.server();
      cy.route('POST', '*api/blogs').as('createBlog');
      cy.route('PUT', '*api/blogs/*').as('updateBlog');
      cy.route('DELETE', '*api/blogs/*').as('deleteBlog');

      // Create new blog
      cy.get('[data-cy=create-new-blog]').click();
      cy.createBlog('abcd', 'abcd', '/abcd');

      // Ensure new blog is added to the list
      cy.wait('@createBlog').should((xhr) => {
        expect(xhr.status).to.equal(201);
        cy.get('[data-cy=abcd').should('exist');
      });

      // Ensure that user can like the blog
      cy.get('[data-cy=show-blog-details]').click();
      cy.get('[data-cy=like-button]').click();
      cy.wait('@updateBlog').should((xhr) => {
        expect(xhr.status).to.equal(200);
        cy.get('[data-cy=blog-likes]').contains('1');
      });

      // Ensure other users than who added can't delete the blog

      // Logout user
      cy.get('[data-cy=logout-button]').click();

      // Login with non author
      cy.login('abcd8294', 'helloworld8294');

      // Try to delete and expect 403
      cy.get('[data-cy=show-blog-details]').click();
      cy.get('[data-cy=delete-blog]').click();
      cy.wait('@deleteBlog').should((xhr) => {
        expect(xhr.status).to.equal(403);
      });

      // Ensure user who added the blog can delete it

      // Logout user
      cy.get('[data-cy=logout-button]').click();

      // Login with non author
      cy.login('root', 'helloworld');
      cy.get('[data-cy=show-blog-details]').click();
      cy.get('[data-cy=delete-blog]').click();
      cy.wait('@deleteBlog').should((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    });
  });
});
