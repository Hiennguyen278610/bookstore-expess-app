import Book from "../models/Book.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Category from "../models/Category.js";
import SupplyReceipt from "../models/SupplyReceipt.js";
import SupplyDetail from "../models/SupplyDetail.js";

// Tổng quan: tổng sách, users, đơn hàng, doanh thu, lợi nhuận, low stock
export async function getOverviewStatsService() {
    try {
        const [
            totalBooks,
            totalUsers,
            totalOrders,
            totalCategories,
            lowStockBooks,
            completedOrders,
            pendingOrders,
            cancelledOrders
        ] = await Promise.all([
            Book.countDocuments({ isDeleted: false }),
            User.countDocuments({ role: "user" }), // Chỉ đếm khách hàng, không đếm admin
            Order.countDocuments(),
            Category.countDocuments(),
            Book.countDocuments({ quantity: { $lte: 10 }, isDeleted: false }),
            Order.countDocuments({ purchaseStatus: "completed" }),
            Order.countDocuments({ purchaseStatus: "pending" }),
            Order.countDocuments({ purchaseStatus: "canceled" })
        ]);

        // Tính tổng doanh thu từ đơn hàng completed
        const revenueResult = await Order.aggregate([
            { $match: { purchaseStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Tính tổng chi phí nhập hàng - CHỈ từ phiếu đã hoàn tất
        const costResult = await SupplyReceipt.aggregate([
            { $match: { purchaseStatus: "completed" } }, // Chỉ lấy phiếu hoàn tất
            {
                $lookup: {
                    from: "supplydetails",
                    localField: "_id",
                    foreignField: "receiptId",
                    as: "details"
                }
            },
            { $unwind: "$details" },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: { $multiply: ["$details.quantity", "$details.importPrice"] }
                    }
                }
            }
        ]);
        const totalCost = costResult.length > 0 ? costResult[0].total : 0;

        // Lợi nhuận = Doanh thu - Chi phí
        const totalProfit = totalRevenue - totalCost;

        return {
            success: true,
            data: {
                totalBooks,
                totalUsers,
                totalOrders,
                totalRevenue,
                totalCategories,
                lowStockBooks,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalProfit,
                totalCost
            }
        };
    } catch (error) {
        console.error("Error in getOverviewStatsService:", error);
        throw error;
    }
}

// Thống kê doanh thu theo thời gian
export async function getRevenueStatsService(period = "month", from, to) {
    try {
        let groupBy;
        let dateFormat;

        // Xác định cách group theo period
        switch (period) {
            case "day":
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                };
                dateFormat = "%Y-%m-%d";
                break;
            case "year":
                groupBy = {
                    year: { $year: "$createdAt" }
                };
                dateFormat = "%Y";
                break;
            default: // month
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                };
                dateFormat = "%Y-%m";
        }

        // Build match condition
        const matchCondition = { purchaseStatus: "completed" };
        if (from || to) {
            matchCondition.createdAt = {};
            if (from) matchCondition.createdAt.$gte = new Date(from);
            if (to) matchCondition.createdAt.$lte = new Date(to);
        }

        const revenue = await Order.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Format response
        const formattedData = revenue.map(item => {
            let label;
            if (period === "day") {
                label = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
            } else if (period === "year") {
                label = `${item._id.year}`;
            } else {
                label = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
            }
            return {
                period: label,
                revenue: item.revenue,
                orderCount: item.orderCount
            };
        });

        return {
            success: true,
            data: formattedData
        };
    } catch (error) {
        console.error("Error in getRevenueStatsService:", error);
        throw error;
    }
}

// Thống kê lợi nhuận theo thời gian
export async function getProfitStatsService(period = "month", from, to) {
    try {
        // Lấy doanh thu
        const revenueData = await getRevenueStatsService(period, from, to);

        // Lấy chi phí nhập hàng theo thời gian
        let groupBy;
        switch (period) {
            case "day":
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                };
                break;
            case "year":
                groupBy = {
                    year: { $year: "$createdAt" }
                };
                break;
            default: // month
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                };
        }

        const matchCondition = { purchaseStatus: "completed" }; // Chỉ lấy phiếu hoàn tất
        if (from || to) {
            matchCondition.createdAt = {};
            if (from) matchCondition.createdAt.$gte = new Date(from);
            if (to) matchCondition.createdAt.$lte = new Date(to);
        }

        const costs = await SupplyReceipt.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "supplydetails",
                    localField: "_id",
                    foreignField: "receiptId",
                    as: "details"
                }
            },
            { $unwind: "$details" },
            {
                $group: {
                    _id: groupBy,
                    cost: {
                        $sum: { $multiply: ["$details.quantity", "$details.importPrice"] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Map costs by period
        const costMap = {};
        costs.forEach(item => {
            let label;
            if (period === "day") {
                label = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
            } else if (period === "year") {
                label = `${item._id.year}`;
            } else {
                label = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
            }
            costMap[label] = item.cost;
        });

        // Combine revenue and cost to calculate profit
        const profitData = revenueData.data.map(item => ({
            period: item.period,
            revenue: item.revenue,
            cost: costMap[item.period] || 0,
            profit: item.revenue - (costMap[item.period] || 0),
            orderCount: item.orderCount
        }));

        return {
            success: true,
            data: profitData
        };
    } catch (error) {
        console.error("Error in getProfitStatsService:", error);
        throw error;
    }
}

// Top sản phẩm bán chạy
export async function getTopProductsService(limit = 10) {
    try {
        const topProducts = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order"
                }
            },
            { $unwind: "$order" },
            { $match: { "order.purchaseStatus": "completed" } },
            {
                $group: {
                    _id: "$bookId",
                    totalQuantity: { $sum: "$quantity" },
                    totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            { $unwind: "$book" },
            {
                $project: {
                    bookId: "$_id",
                    bookName: "$book.name",
                    bookImage: { $arrayElemAt: ["$book.imageUrl", 0] },
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit }
        ]);

        return {
            success: true,
            data: topProducts
        };
    } catch (error) {
        console.error("Error in getTopProductsService:", error);
        throw error;
    }
}

// Thống kê đơn hàng
export async function getOrderStatsService() {
    try {
        const [statusStats, recentOrders] = await Promise.all([
            Order.aggregate([
                {
                    $group: {
                        _id: "$purchaseStatus",
                        count: { $sum: 1 },
                        totalValue: { $sum: "$totalAmount" }
                    }
                }
            ]),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("customerId", "fullName email")
                .lean()
        ]);

        return {
            success: true,
            data: {
                byStatus: statusStats,
                recent: recentOrders
            }
        };
    } catch (error) {
        console.error("Error in getOrderStatsService:", error);
        throw error;
    }
}

// Top categories by revenue
export async function getTopCategoriesService(limit = 5) {
    try {
        const topCategories = await OrderDetail.aggregate([
            // Lookup order info
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order"
                }
            },
            { $unwind: "$order" },
            // Only completed orders
            { $match: { "order.purchaseStatus": "completed" } },
            // Lookup book info
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "book"
                }
            },
            { $unwind: "$book" },
            // Lookup category
            {
                $lookup: {
                    from: "categories",
                    localField: "book.categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            // Group by category
            {
                $group: {
                    _id: "$category._id",
                    categoryName: { $first: "$category.name" },
                    totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: parseInt(limit) }
        ]);

        // Calculate total revenue for percentage
        const totalRevenue = topCategories.reduce((sum, cat) => sum + cat.totalRevenue, 0);

        const categoriesWithPercentage = topCategories.map(cat => ({
            categoryId: cat._id,
            name: cat.categoryName,
            revenue: cat.totalRevenue,
            quantity: cat.totalQuantity,
            percentage: totalRevenue > 0 ? Math.round((cat.totalRevenue / totalRevenue) * 100) : 0
        }));

        return {
            success: true,
            data: categoriesWithPercentage
        };
    } catch (error) {
        console.error("Error in getTopCategoriesService:", error);
        throw error;
    }
}

// Payment methods breakdown
export async function getPaymentMethodsStatsService() {
    try {
        const paymentStats = await Order.aggregate([
            // Group by payment method
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Calculate total orders for percentage
        const totalOrders = paymentStats.reduce((sum, stat) => sum + stat.count, 0);

        const methodsWithPercentage = paymentStats.map(stat => ({
            method: stat._id,
            count: stat.count,
            totalAmount: stat.totalAmount,
            percentage: totalOrders > 0 ? Math.round((stat.count / totalOrders) * 100) : 0
        }));

        return {
            success: true,
            data: {
                methods: methodsWithPercentage,
                totalOrders
            }
        };
    } catch (error) {
        console.error("Error in getPaymentMethodsStatsService:", error);
        throw error;
    }
}

// Comparison stats with previous period
export async function getComparisonStatsService() {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Current month stats
        const [
            currentRevenue,
            currentOrders,
            currentUsers
        ] = await Promise.all([
            Order.aggregate([
                { $match: { purchaseStatus: "completed", createdAt: { $gte: currentMonthStart } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),
            Order.countDocuments({ createdAt: { $gte: currentMonthStart } }),
            User.countDocuments({ role: "user", createdAt: { $gte: currentMonthStart } })
        ]);

        // Last month stats
        const [
            lastRevenue,
            lastOrders,
            lastUsers
        ] = await Promise.all([
            Order.aggregate([
                { $match: { purchaseStatus: "completed", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),
            Order.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            User.countDocuments({ role: "user", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } })
        ]);

        const currentRevenueVal = currentRevenue.length > 0 ? currentRevenue[0].total : 0;
        const lastRevenueVal = lastRevenue.length > 0 ? lastRevenue[0].total : 0;

        // Calculate percentage changes
        const calculateChange = (current, last) => {
            if (last === 0) return current > 0 ? 100 : 0;
            return ((current - last) / last) * 100;
        };

        // Calculate profit change (simplified: revenue - estimated cost)
        const currentProfit = currentRevenueVal * 0.3; // Assume 30% margin
        const lastProfit = lastRevenueVal * 0.3;

        return {
            success: true,
            data: {
                revenueChange: calculateChange(currentRevenueVal, lastRevenueVal),
                ordersChange: calculateChange(currentOrders, lastOrders),
                profitChange: calculateChange(currentProfit, lastProfit),
                usersChange: calculateChange(currentUsers, lastUsers)
            }
        };
    } catch (error) {
        console.error("Error in getComparisonStatsService:", error);
        throw error;
    }
}
