import axios from 'axios'
const baseUrl = '/api/users'

let token=null

const getAll = () => {
    const request= axios.get(baseUrl)
    return request.then(response => response.data)
}

const setToken = (newToken) =>{
    token= `bearer ${newToken}`
}

const create = async (newObject) => {
    const config= {
        headers: {'Authorization': token}
    }

    const response= await axios.post(baseUrl, newObject,config)
    return response.data
}

const deletePerson = (id) => {
    const request= axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
    .catch(error =>{
        console.log('nothing to delete')
    })
}

const update = (id, newObject) => {
  const request= axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response=> response.data)
}


export default { getAll, create, update, setToken ,deletePerson}