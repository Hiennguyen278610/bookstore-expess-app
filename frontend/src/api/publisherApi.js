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

export const getAllPublishers = async () => {
    const response = await api.get('/publishers');
    return response.data;
};

export const getPublisherById = async (id) => {
    const response = await api.get(`/publishers/${id}`);
    return response.data;
};

export const createPublisher = async (data) => {
    const response = await api.post('/publishers', data);
    return response.data;
};

export const updatePublisher = async (id, data) => {
    const response = await api.put(`/publishers/${id}`, data);
    return response.data;
};

export const deletePublisher = async (id) => {
    const response = await api.delete(`/publishers/${id}`);
    return response.data;
};
