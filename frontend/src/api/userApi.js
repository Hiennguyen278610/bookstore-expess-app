import axios from "axios";


const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const getAllUsers = async () => {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
}

export const getUserById = async (id) => {
    const response = await axios.get(`${apiUrl}/users/${id}`);
    return response.data;
}

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${apiUrl}/users/${id}`, userData);
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await axios.delete(`${apiUrl}/users/${id}`);
    return response.data;
}

export const createUser = async (userData) => {
    const response = await axios.post(`${apiUrl}/users`, userData);
    return response.data;
}
