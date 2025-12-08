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

// Get all supply receipts with pagination and filter
// Query params: page, limit, status
export const getAllSupplyReceipts = async (params = {}) => {
    const response = await api.get('/supply-receipts', { params });
    return response.data;
};

// Get supply receipt by ID
export const getSupplyReceiptById = async (id) => {
    const response = await api.get(`/supply-receipts/${id}`);
    return response.data;
};

// Create new supply receipt
// Body: { supplierId, details: [{ bookId, importPrice, quantity }] }
export const createSupplyReceipt = async (data) => {
    const response = await api.post('/supply-receipts', data);
    return response.data;
};

// Update supply receipt
// Body: { supplierId, purchaseStatus, supplyDate, details }
export const updateSupplyReceipt = async (id, data) => {
    const response = await api.put(`/supply-receipts/${id}`, data);
    return response.data;
};

// Update supply receipt status only
// Body: { purchaseStatus }
export const updateSupplyReceiptStatus = async (id, purchaseStatus) => {
    const response = await api.patch(`/supply-receipts/${id}/status`, { purchaseStatus });
    return response.data;
};

// Delete supply receipt
export const deleteSupplyReceipt = async (id) => {
    const response = await api.delete(`/supply-receipts/${id}`);
    return response.data;
};

// Get supply receipt statistics
export const getSupplyReceiptStats = async () => {
    const response = await api.get('/supply-receipts/stats');
    return response.data;
};
