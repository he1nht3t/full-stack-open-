import { useState, useEffect, useRef } from 'react'

// Components
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

//React Query
import { useQuery, useQueryClient } from 'react-query'

// Mutations
import {
  useCreateBlogMutation,
  useRemoveBlogMutation,
  useUpdateBlogMutation,
} from './mutations/blogMutations'

//Custom Hooks
import { useSetNotification } from './hooks/notificationHooks'
import { useUser, useSetUser, useLogin, useLogout } from './hooks/userHooks'

// Services
import { get } from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  const user = useUser()
  const setUser = useSetUser()
  const loginUser = useLogin()
  const logoutUser = useLogout()
  const setNotification = useSetNotification()
  const createBlogMutation = useCreateBlogMutation(queryClient, setNotification)
  const removeBlogMutation = useRemoveBlogMutation(queryClient, setNotification)
  const updateBlogMutation = useUpdateBlogMutation(queryClient, setNotification)

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery('blogs', get, { retry: 1 })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    loginUser({ username, password }, setNotification)
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    logoutUser()
  }

  const addNewBlog = async (blogObject) => {
    createBlogMutation.mutate(blogObject)
    blogFormRef.current.toggleVisibility()
  }

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      removeBlogMutation.mutate(blogObject)
    }
  }

  const updateBlog = async (blogObject) => {
    updateBlogMutation.mutate(blogObject)
  }

  const sortedBlogsByLikes = blogs
    ? blogs.sort((a, b) => b.likes - a.likes)
    : []

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data</div>
  }

  return (
    <div>
      <h2>Blogs</h2>

      <Notification />

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
