import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export const get = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export const update = async (newObject) => {
  const id = newObject.id
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export const remove = async (blogObject) => {
  const id = blogObject.id
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return { data: response.data, blogObject }
}
