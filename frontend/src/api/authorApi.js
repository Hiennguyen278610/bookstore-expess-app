
//src/api/authorApi.js
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

export const getAllAuthors = async () => {
    const response = await api.get('/authors');
    return response.data;
};

export const getAuthorById = async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
};

export const createAuthor = async (data) => {
    const response = await api.post('/authors', data);
    return response.data;
};

export const updateAuthor = async (id, data) => {
    const response = await api.put(`/authors/${id}`, data);
    return response.data;
};

export const deleteAuthor = async (id) => {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
};