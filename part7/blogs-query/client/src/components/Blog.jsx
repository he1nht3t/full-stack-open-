import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const newBlogObject = {
      ...blog,
      likes: blog.likes + 1,
    }
    updateBlog(newBlogObject)
  }

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <>
      <div style={blogStyle} className="blog">
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
        {visible && (
          <div>
            <a href={blog.url} target="blank">
              {blog.url}
            </a>
            <p>
              {blog.likes} <button onClick={handleLike}>like</button>{' '}
            </p>
            <p>{blog.user.name}</p>
            {user && user.username === blog.user.username && (
              <button onClick={() => removeBlog(blog)}>remove</button>
            )}
          </div>
        )}
      </div>
      <br />
    </>
  )
}

export default Blog
