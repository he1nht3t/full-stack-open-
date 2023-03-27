const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async() => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  }

  const addedUser = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const testUserId = addedUser.body.id

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: newUser.username,
      password: newUser.password
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = loginResponse.body.token

  for (let blog of helper.initialBlogs) {
    const newBlog = { ...blog, user: testUserId }
    let blogObject = new Blog(newBlog)

    await blogObject.save()
  }
})
describe('when there is initially some notes saved', () => {

  test('blogs are return as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const blogs = await helper.blogInDb()

    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogs = await helper.blogInDb()

    const titles = blogs.map(blog => blog.title)

    expect(titles).toContain('React patterns')
  })

  test('all returned blogs contain id property', async () => {
    const blogs = await helper.blogInDb()

    const ids = blogs.map(blog => blog.id)
    expect(ids).toBeDefined()
  })

  test('a valid blog can be added', async () => {


    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.initialBlog)
      .expect(201)
      .expect('content-type', /application\/json/)

    const blogs = await helper.blogInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogs.map(blog => blog.title)
    expect(titles).toContain('Type wars')

  })

  test('adding a blog fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'http://testblog.com',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('creating a new blog with missing likes property default to 0', async () => {
    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.initialBlogWithNoLikes)
      .expect(201)
      .expect('content-type', /application\/json/)

    expect(res.body.likes).toBe(0)
  } )

  test('creating a new blog with missing title property response 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.initialBlogWithNoTitle)
      .expect(400)
  } )

  test('creating a new blog with missing url property response 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.initialBlogWithNoUrl)
      .expect(400)
  } )

})

describe('deletion of a blog post', () => {
  test('success with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .catch(error => {
        console.log(error)
        throw error
      })

    const blogsAtEnd = await helper.blogInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).not.toContain(blogToDelete.title)

  })

  test('fail with status code 404 if blog is not exist', async () => {
    const nonExistingValidId = await helper.nonExistingValidId()

    await api
      .delete(`/api/blogs/${nonExistingValidId}`)
      .set('Authorization', `Bearer ${token}`)

      .expect(404)

  })

  test('fail with status code 400 if id is invalid', async () => {
    const invalidId = '641aeb2b20c48e59efda951'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)

      .expect(400)
  })
})

describe('updating a blog post', () => {
  test('success with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = helper.updatedBlog

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(201)
      .expect('content-type', /application\/json/)

    const blogsAtEnd = await helper.blogInDb()
    const updatedBlogLike = blogsAtEnd[0].likes

    expect(updatedBlogLike).toBe(0)
  })

  test('fail with status code 400 if id is invalid', async () => {
    const invalidId = '641aeb2b20c48e59efda951'

    const updatedBlog = helper.updatedBlog

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(400)
  })

  test('fail with status code 404 if blog is not exist', async () => {
    const nonExistingValidId = await helper.nonExistingValidId()
    const updatedBlog = helper.updatedBlog

    await api
      .put(`/api/blogs/${nonExistingValidId}`)
      .send(updatedBlog)
      .expect(404)
  })
})



afterAll( async () => {
  await mongoose.connection.close()
})

