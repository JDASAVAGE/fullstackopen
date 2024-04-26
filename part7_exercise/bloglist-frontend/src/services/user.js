import axios from 'axios'
const baseUrl = '/api/users'

const retrieve = async() => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { retrieve }