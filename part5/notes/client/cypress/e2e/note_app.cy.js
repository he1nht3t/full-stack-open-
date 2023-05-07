describe('Note app', function () {
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

  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2023'
    )
  })

  it('login form can be opened', function () {
    cy.contains('log in').click()
  })

  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('alice')
    cy.get('#password').type('password')
    cy.get('#login').click()

    cy.contains('Alice logged in')
  })

  it('login fails with wrong password', function () {
    cy.contains('log in').click()
    cy.get('#username').type('alice')
    cy.get('#password').type('wrong')
    cy.get('#login').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Alice logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'alice', password: 'password' })
    })

    it('a new note can be created', function () {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'first note',
          important: false,
        })
        cy.createNote({
          content: 'second note',
          important: false,
        })
        cy.createNote({
          content: 'third note',
          important: false,
        })
      })

      it('one of them can be make important', function () {
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })
  })
})
