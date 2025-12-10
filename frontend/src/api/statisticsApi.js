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

// Get overview statistics
export const getOverviewStats = async () => {
    const response = await api.get('/statistics/overview');
    return response.data;
};

// Get revenue statistics
// period: 'day' | 'month' | 'year'
// from, to: date strings (YYYY-MM-DD)
export const getRevenueStats = async (period = 'month', from = null, to = null) => {
    const params = { period };
    if (from) params.from = from;
    if (to) params.to = to;
    const response = await api.get('/statistics/revenue', { params });
    return response.data;
};

// Get profit statistics
export const getProfitStats = async (period = 'month', from = null, to = null) => {
    const params = { period };
    if (from) params.from = from;
    if (to) params.to = to;
    const response = await api.get('/statistics/profit', { params });
    return response.data;
};

// Get top selling products
export const getTopProducts = async (limit = 10) => {
    const response = await api.get('/statistics/top-products', { params: { limit } });
    return response.data;
};

// Get order statistics
export const getOrderStats = async () => {
    const response = await api.get('/statistics/orders');
    return response.data;
};

// Get top categories
export const getTopCategories = async (limit = 5) => {
    const response = await api.get('/statistics/top-categories', { params: { limit } });
    return response.data;
};

// Get payment methods stats
export const getPaymentMethodsStats = async () => {
    const response = await api.get('/statistics/payment-methods');
    return response.data;
};

// Get comparison stats with previous period
export const getComparisonStats = async () => {
    const response = await api.get('/statistics/comparison');
    return response.data;
};
