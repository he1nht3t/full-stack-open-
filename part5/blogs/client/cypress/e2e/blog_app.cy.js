describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND_URL')}/testing/reset`)
    const user = {
      name: 'Alice',
      username: 'alice',
      password: 'password',
    }
    cy.request('POST', `${Cypress.env('BACKEND_URL')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Login').click()
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('Login').click()
      cy.get('#username').type('alice')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Alice logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('Login').click()
      cy.get('#username').type('alice')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'alice', password: 'password' })
      })

      it('A blog can be created', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('cypress')
        cy.get('#url').type('https://www.cypress.io/')
        cy.get('#create-blog-button').click()

        cy.contains('a blog created by cypress')
        cy.get('.success')
          .should(
            'contain',
            'a new blog a blog created by cypress by cypress added'
          )
          .and('have.css', 'color', 'rgb(0, 128, 0)')
      })

      describe('and a blog exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'another blog cypress',
            author: 'cypress',
            url: 'https://www.cypress.io/',
          })
        })

        it('it can be liked', function () {
          cy.contains('another blog cypress').parent().as('blog')
          cy.get('@blog').contains('view').click()
          cy.get('@blog').contains('like').click()

          cy.get('@blog').contains('1 like')
        })

        it('it can be deleted by the user who created it', function () {
          cy.contains('another blog cypress').parent().as('blog')
          cy.get('@blog').contains('view').click()
          cy.get('@blog').contains('remove').click()

          cy.get('html').should('not.contain', 'another blog cypress')
        })

        it('it cannot be deleted by another user', function () {
          cy.contains('Logout').click()
          const user = {
            name: 'Bob',
            username: 'bob',
            password: 'password',
          }
          cy.request('POST', `${Cypress.env('BACKEND_URL')}/users`, user)
          cy.login({ username: 'bob', password: 'password' })

          cy.contains('another blog cypress').parent().as('blog')
          cy.get('@blog').contains('view').click()
          cy.get('@blog').should('not.contain', 'remove')
        })
      })

      describe('and several blogs exist', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'blog 1',
            author: 'cypress',
            url: 'https://www.cypress.io/',
            likes: 1,
          })
          cy.createBlog({
            title: 'blog 2',
            author: 'cypress',
            url: 'https://www.cypress.io/',
            likes: 2,
          })
          cy.createBlog({
            title: 'blog 3',
            author: 'cypress',
            url: 'https://www.cypress.io/',
            likes: 3,
          })
        })

        it('blogs are ordered according to likes', function () {
          cy.get('.blog').then((blogs) => {
            cy.wrap(blogs[0]).contains('blog 3')
            cy.wrap(blogs[1]).contains('blog 2')
            cy.wrap(blogs[2]).contains('blog 1')
          })
        })
      })
    })
  })
})
