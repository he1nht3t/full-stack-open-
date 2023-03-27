const Blog = require('../models/blog')
const User = require('../models/user')

//Blog
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
]

const initialBlog = {
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
}

const initialBlogWithNoLikes = {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
}

const initialBlogWithNoTitle = {
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
}

const initialBlogWithNoUrl = {
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  likes: 0,
}

const nonExistingValidId = async () => {
  const dummyBlog = {
    title: 'Dummy Blog',
    author: 'No one',
    url: 'https://www.example.com'
  }

  const blog = new Blog(dummyBlog)
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const updatedBlog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 0
}

const blogInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}


//User
const usersInDb = async () => {
  const blogs = await User.find({})

  return blogs.map(blog => blog.toJSON())
}




module.exports = {
  initialBlogs,
  initialBlog,
  initialBlogWithNoLikes,
  initialBlogWithNoTitle,
  initialBlogWithNoUrl,
  nonExistingValidId,
  blogInDb,
  updatedBlog,
  usersInDb,
}