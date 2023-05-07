const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
})

describe('when a new blog is added', () => {
  test('the blog is added successfully', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: newUser.username,
        password: newUser.password
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://www.testblog.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('adding a blog fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test-blog.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
