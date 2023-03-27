const _ = require('lodash')


const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  let totals = 0
  blogs.forEach(blog => {
    totals += blog.likes
  })

  return totals
}

const favoriteBlog = (blogs) => {

  let maxLikes = 0
  let favorite = null

  for (const blog of blogs) {
    if(blog.likes > maxLikes) {
      maxLikes = blog.likes
      favorite = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    }
  }
  return favorite

}

const mostBlogs = (blogs) => {
  if(blogs.length === 0 ) return null

  const authorCounts = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])

  return { author: topAuthor, blogs: authorCounts[topAuthor] }
}

const mostLikes = (blogs) => {
  const favorite = favoriteBlog(blogs)

  let mostLikes = null
  if (favorite) {
    mostLikes = {
      author: favorite.author,
      likes: favorite.likes
    }
  }
  return mostLikes
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}