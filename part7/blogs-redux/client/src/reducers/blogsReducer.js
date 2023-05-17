import { createSlice } from '@reduxjs/toolkit'

//Notification
import { setNotification } from './notificationReducer'

//services
import { get, create, update, remove, addComment } from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    initialState: (state, action) => {
      return action.payload
    },
    addBlog: (state, action) => {
      state.push(action.payload)
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload)
    },
    updateBlog: (state, action) => {
      return state.map((blog) => {
        if (blog.id === action.payload.id) {
          return action.payload
        }
        return blog
      })
    },
  },
})

export const { addBlog, removeBlog, updateBlog, initialState } = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await get()
      dispatch(initialState(blogs))
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
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      const newBlog = await create(blogObject)
      dispatch(addBlog(newBlog))

      dispatch(
        setNotification(
          {
            message: `A new blog ${newBlog.title} by ${newBlog.author} added`,
            type: 'success',
          },
          5
        )
      )
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
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await remove(id)
      dispatch(removeBlog(id))

      dispatch(
        setNotification(
          {
            message: 'Blog deleted successfully',
            type: 'success',
          },
          5
        )
      )
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
}

export const likeBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await update(blogObject.id, blogObject)
      dispatch(updateBlog(updatedBlog))

      dispatch(
        setNotification(
          {
            message: `You liked ${updatedBlog.title}`,
            type: 'success',
          },
          5
        )
      )
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
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await addComment(id, comment)
      dispatch(updateBlog(updatedBlog))

      dispatch(
        setNotification(
          {
            message: `Comment added to ${updatedBlog.title}`,
            type: 'success',
          },
          5
        )
      )
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
}

export default blogsSlice.reducer
