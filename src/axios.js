import Axios from 'axios'
const axios = Axios.create({
    baseURL: 'http://127.0.0.1:8081/api'
})
export default axios