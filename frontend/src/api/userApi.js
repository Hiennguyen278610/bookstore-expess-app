import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Get JWT token from cookie
const getToken = () => {
    if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('access_token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
    return null;
};

// Create axios instance with auth
const api = axios.create({
    baseURL: apiUrl,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
}

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
}

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}

export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
}
