const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially one user in db', () => {

  beforeEach( async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'alice', name: 'Alice', passwordHash })

    await user.save()
  } )

  test('creation succeeds with fresh user data', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tommy',
      name: 'Tommy',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('content-type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fail with proper status code and message if user already exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const existUser = {
      username: 'alice',
      name: 'Alice',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(existUser)
      .expect(400)
      .expect('content-type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)

  })

  test('creation fail with proper status code and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bob',
      name: 'Bob',
      password: 'pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('content-type', /application\/json/)

    expect(result.body.error).toContain('Password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  afterAll(async() => {
    await mongoose.connection.close()
  })


})