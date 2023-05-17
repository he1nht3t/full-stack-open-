import { useContext } from 'react'

import UserContext from '../contexts/userContext'

//services
import { login } from '../services/login'
import { setToken } from '../services/blogs'

export const useUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context.state.user
}

export const useSetUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useSetUser must be used within a UserProvider')
  }

  const setUser = (user) => {
    context.dispatch({ type: 'SET_USER', data: user })
    setToken(user.token)
  }

  return setUser
}

export const useLogin = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useLogin must be used within a UserProvider')
  }

  const loginUser = async (credentials, setNotification) => {
    try {
      const user = await login(credentials)

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      setToken(user.token)

      context.dispatch({ type: 'SET_USER', data: user })
    } catch (error) {
      setNotification({ message: 'Wrong credentials', type: 'error' })
    }
  }

  return loginUser
}

export const useLogout = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useLogout must be used within a UserProvider')
  }

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')

    context.dispatch({ type: 'CLEAR_USER' })

    setToken(null)
  }

  return logoutUser
}
