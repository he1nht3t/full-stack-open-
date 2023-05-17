import { useMutation } from 'react-query'

//services
import { create, update, remove } from '../services/blogs'

export const useCreateBlogMutation = (queryClient, setNotification) => {
  return useMutation(create, {
    onSuccess: (createdBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', [...blogs, createdBlog])
      setNotification({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    },
    onError: (error) => {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    },
  })
}

export const useUpdateBlogMutation = (queryClient, setNotification) => {
  return useMutation(update, {
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      const updatedBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      queryClient.setQueryData('blogs', updatedBlogs)

      setNotification({
        message: `You liked ${updatedBlog.title} by ${updatedBlog.author}`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    },
    onError: (error) => {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    },
  })
}

export const useRemoveBlogMutation = (queryClient, setNotification) => {
  return useMutation(remove, {
    onSuccess: (data) => {
      const blogObject = data.blogObject
      const blogs = queryClient.getQueryData('blogs')
      const updatedBlogs = blogs.filter((blog) => blog.id !== blogObject.id)
      queryClient.setQueryData('blogs', updatedBlogs)

      setNotification({
        message: `Blog ${blogObject.title} by ${blogObject.author} removed`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    },

    onError: (error) => {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    },
  })
}
