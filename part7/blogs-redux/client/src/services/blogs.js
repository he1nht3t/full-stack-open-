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

export const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return response.data
}
