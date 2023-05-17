import { createContext, useReducer } from 'react'

const UserContext = createContext()

const initialState = {
  user: null,
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.data }
    case 'CLEAR_USER':
      return { ...state, user: null }
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
