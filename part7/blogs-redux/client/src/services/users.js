import axios from 'axios'
const baseUrl = '/api/users'

export const get = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
