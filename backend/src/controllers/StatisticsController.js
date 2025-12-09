import {
    getOverviewStatsService,
    getRevenueStatsService,
    getProfitStatsService,
    getTopProductsService,
    getOrderStatsService
} from "../services/StatisticsService.js";

// GET /api/v1/statistics/overview
export const getOverviewStats = async (req, res) => {
    try {
        const stats = await getOverviewStatsService();
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/v1/statistics/revenue?period=day&from=2024-01-01&to=2024-12-31
// period: day | month | year
export const getRevenueStats = async (req, res) => {
    try {
        const { period, from, to } = req.query;
        const stats = await getRevenueStatsService(period, from, to);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/v1/statistics/profit?period=day&from=2024-01-01&to=2024-12-31
export const getProfitStats = async (req, res) => {
    try {
        const { period, from, to } = req.query;
        const stats = await getProfitStatsService(period, from, to);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/v1/statistics/top-products?limit=10
export const getTopProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await getTopProductsService(limit);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/v1/statistics/orders
export const getOrderStats = async (req, res) => {
    try {
        const stats = await getOrderStatsService();
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
