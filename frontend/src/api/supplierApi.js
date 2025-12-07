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

export const getAllSuppliers = async () => {
    const response = await api.get('/suppliers');
    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
};

export const createSupplier = async (data) => {
    const response = await api.post('/suppliers', data);
    return response.data;
};

export const updateSupplier = async (id, data) => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
};

export const deleteSupplier = async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
};
