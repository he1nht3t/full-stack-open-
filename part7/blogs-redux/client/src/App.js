import { useState, useEffect } from 'react'

//react-router
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'

//UI
import { Container, Menu, Button, Icon } from 'semantic-ui-react'

// Components
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import ReusableModal from './components/ReusableModal'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Blogs from './components/Blogs'

// Services
import { setToken } from './services/blogs'
import loginService from './services/login'

//Redux
import { useDispatch, useSelector } from 'react-redux'

//Reducers
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { setUser, clearUser } from './reducers/loginUserReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeItem, setActiveItem] = useState('blogs')

  const loginUser = useSelector(({ loginUser }) => loginUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const matchBlogs = useMatch('/')
  const matchUsers = useMatch('users')
  const matchUser = useMatch('users/:id')

  useEffect(() => {
    if (matchBlogs) {
      setActiveItem('blogs')
    } else if (matchUsers) {
      setActiveItem('users')
    } else if (matchUser) {
      setActiveItem('users')
    } else {
      setActiveItem('')
    }
  }, [matchBlogs, matchUsers, matchUser])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      setToken(user.token)
    }
  }, [])

  const handleLogin = async () => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      dispatch(
        setNotification(
          {
            message: error.response.data.error,
            type: 'error',
          },
          5
        )
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }

  const handleBlogsNavClick = () => {
    setActiveItem('blogs')
    navigate('/')
  }

  const handleUsersNavClick = () => {
    setActiveItem('users')
    navigate('/users')
  }

  return (
    <Container>
      <Menu pointing secondary>
        <Menu.Item name="blogs" active={activeItem === 'blogs'} onClick={handleBlogsNavClick}>
          Blogs
        </Menu.Item>
        <Menu.Item name="users" active={activeItem === 'users'} onClick={handleUsersNavClick}>
          Users
        </Menu.Item>
        {loginUser !== null ? (
          <Menu.Item position="right">
            <Icon name="user" />
            {loginUser.name}
            <Button size="mini" animated onClick={handleLogout}>
              <Button.Content hidden>Logout</Button.Content>
              <Button.Content visible>
                <Icon name="log out" />
              </Button.Content>
            </Button>
          </Menu.Item>
        ) : (
          <Menu.Item position="right">
            <ReusableModal buttonLabel="Login" handleSubmit={handleLogin}>
              <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
            </ReusableModal>
          </Menu.Item>
        )}
      </Menu>
      <Notification />
      <>
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </>
    </Container>
  )
}

export default App
