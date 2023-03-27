const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const id = req.params.id

  const blog = await Blog.findById(id)

  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/' , userExtractor , async (req, res) => {
  const { title, author, url, likes } = req.body

  const user = req.user

  if(!user) {
    return res.status(401).json({ error: 'unauthorized!' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ?? 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const { title, author, url, likes } = req.body

  const updatedBlog = await  Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    res.status(201).json(updatedBlog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.delete('/:id', userExtractor , async (req, res) => {
  const id = req.params.id

  const blog = await Blog.findById(id)

  if(!blog) {
    return res.status(404).end()
  }

  const user = req.user

  if( blog.user.toString() !== user.id.toString() ) {
    return res.status(401).json({ error: 'unauthorized!' })
  }

  await Blog.findByIdAndRemove(id)

  res.status(204).end()

})

module.exports = blogsRouter
