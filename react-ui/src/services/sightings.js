import axios from 'axios'
const baseUrl = '/sightings'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newSighting) => {
  const response = await axios.post(baseUrl, newSighting)
  return response.data
}

export default { getAll, create }