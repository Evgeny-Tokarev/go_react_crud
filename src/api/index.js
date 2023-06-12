import axios from "../axios";

export const fetchData = async (page) => {
    try {
        const resp = await axios.get(`/users?sort=-id&size=3${page}`)
        return {
            data: resp.data.data,
            status: resp.status
        }

    }  catch (err) {
        return {
            message: err.response.data.message
        }
    }
}
export const fetchUser = async (id) => {
    try {
        const resp = await axios.get(`/users/${id}`)
        return {
            data: resp.data.data,
            status: resp.status
        }
    }  catch (err) {
        return {
            message: err.response.data.message
        }
    }
}

export const createNewUser = async(formData) => {
    try {
        const resp = await axios.post("/users", formData)
        return {
            data: resp.data.data,
            status: resp.status
        }
    } catch (err) {
        console.log(err)
        return {
            message: err.response.data.message
        }
    }
}

export const updateUser = async (formData, id) => {
    try {
        const resp = await axios.patch(`/users/${id}`, formData)
        return {
            data: resp.data.data,
            status: resp.status
        }
    } catch (err) {
        return {
            message:  Array.isArray(err.response.data.message) ? JSON.stringify(err.response.data.message) : err.response.data.message || err.message
        }
    }
}

export const removeUser = async (id) => {
    try {
        const resp = await axios.delete(`/users/${id}`)
        return {
            status: resp.status
        }
    } catch (err) {
        return {
            message: err.response.data.message || err.message
        }
    }
}