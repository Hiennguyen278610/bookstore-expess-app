/**
 * Book Store Backend - MVCS Architecture
 * Entry Point
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import userRoutes from './routes/UserRoutes.js';
import bookRoutes from './routes/BookRoutes.js';
import authorRoutes from './routes/AuthorRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import publisherRoutes from './routes/PublisherRoutes.js';
import cartRoutes from './routes/CartRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import supplierRoutes from './routes/SupplierRoutes.js';
import supplyReceiptRoutes from './routes/SupplyReceiptRoutes.js';
import addressRoutes from './routes/AddressRoutes.js';

const app = express();
const PORT = process.env.PORTBE || 8080;
const API_PREFIX = process.env.API_TAG || '/api/v1';

// Connect to MongoDB
connectDB(process.env.MONGODB_URL);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/books`, bookRoutes);
app.use(`${API_PREFIX}/authors`, authorRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/publishers`, publisherRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/suppliers`, supplierRoutes);
app.use(`${API_PREFIX}/supply-receipts`, supplyReceiptRoutes);
app.use(`${API_PREFIX}/addresses`, addressRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Book Store API - MVCS Architecture',
        status: 'running'
    });
});

// Global error handler - TODO: Import from middlewares
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}${API_PREFIX}`);
});
