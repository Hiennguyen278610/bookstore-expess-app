import express from "express";
import {
    getOverviewStats,
    getRevenueStats,
    getProfitStats,
    getTopProducts,
    getOrderStats,
    getTopCategories,
    getPaymentMethodsStats,
    getComparisonStats
} from "../controllers/StatisticsController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorize.js";

const router = express.Router();

// Tất cả routes statistics cần auth và phải là admin
// comment testing 
// router.use(auth);
// router.use(authorizeRoles("admin"));

// GET /api/v1/statistics/overview - Tổng quan
router.get("/overview", getOverviewStats);

// GET /api/v1/statistics/revenue - Doanh thu theo thời gian
router.get("/revenue", getRevenueStats);

// GET /api/v1/statistics/profit - Lợi nhuận theo thời gian
router.get("/profit", getProfitStats);

// GET /api/v1/statistics/top-products - Top sản phẩm bán chạy
router.get("/top-products", getTopProducts);

// GET /api/v1/statistics/orders - Thống kê đơn hàng
router.get("/orders", getOrderStats);

// GET /api/v1/statistics/top-categories - Top thể loại bán chạy
router.get("/top-categories", getTopCategories);

// GET /api/v1/statistics/payment-methods - Phân tích phương thức thanh toán
router.get("/payment-methods", getPaymentMethodsStats);

// GET /api/v1/statistics/comparison - So sánh với tháng trước
router.get("/comparison", getComparisonStats);

export default router;
