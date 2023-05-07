import { useState, useEffect, useRef } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

// Services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs))
      .catch((error) => {
        setNotification({
          message: error.response.data.error,
          type: 'error',
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addNewBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setNotification({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      if (
        window.confirm(
          `Remove blog ${blogObject.title} by ${blogObject.author}`
        )
      ) {
        await blogService.remove(blogObject.id)
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
      }
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogObject.id, blogObject)
      setBlogs(
        blogs.map((blog) => (blog.id !== blogObject.id ? blog : returnedBlog))
      )
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const sortedBlogsByLikes = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>

      <Notification notification={notification} />

      {user === null ? (
        <Toggleable buttonLabel="Login">
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </Toggleable>
      ) : (
        <>
          <div>
            <p>{user.name} logged-in</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <br />

          <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm addNewBlog={addNewBlog} />
          </Toggleable>
        </>
      )}

      {sortedBlogsByLikes.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          user={user}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  )
}

export default App
