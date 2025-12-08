"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, Users, ShoppingCart, Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { getOverviewStats, getProfitStats, getTopProducts } from "@/api/statisticsApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    lowStockBooks: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalProfit: 0,
    totalCost: 0
  });

  const [loading, setLoading] = useState(true);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [profitView, setProfitView] = useState<"day" | "month" | "year">("month");

  // State cho lọc theo ngày
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // State cho lọc theo tháng
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // State cho lọc theo năm
  const [filterYear, setFilterYear] = useState<string>("");

  // Fetch overview stats
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await getOverviewStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  // Fetch profit stats when period or date filters change
  useEffect(() => {
    const fetchProfit = async () => {
      try {
        let from: string | null = null;
        let to: string | null = null;

        if (profitView === "day" && dateFrom && dateTo) {
          from = dateFrom;
          to = dateTo;
        } else if (profitView === "month" && selectedYear && selectedMonth) {
          from = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`;
          const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
          to = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${lastDay}`;
        } else if (profitView === "year" && filterYear) {
          from = `${filterYear}-01-01`;
          to = `${filterYear}-12-31`;
        }

        const response = await (getProfitStats as any)(profitView, from, to);
        if (response.success) {
          setProfitData(response.data);
        }
      } catch (error) {
        console.error("Error fetching profit stats:", error);
      }
    };
    fetchProfit();
  }, [profitView, dateFrom, dateTo, selectedMonth, selectedYear, filterYear]);

  // Fetch top products
  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await getTopProducts(5);
        if (response.success) {
          setTopProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };
    fetchTop();
  }, []);

  // Lấy danh sách năm (giả định từ 2020 đến năm hiện tại)
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  // Format VND
  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  // Prepare chart data from API response
  const chartData = profitData.map(item => ({
    period: item.period,
    profit: item.profit,
    revenue: item.revenue,
    cost: item.cost
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "processing": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "delivered": return "bg-teal-50 text-teal-700 border border-teal-200";
      case "cancelled": return "bg-gray-100 text-gray-600 border border-gray-200";
      default: return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white border-l-4 border-emerald-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <h2 className="text-gray-800 text-2xl font-bold">Dashboard - Tổng quan hệ thống</h2>
        <p className="text-gray-600 text-sm mt-1">Theo dõi và quản lý hoạt động cửa hàng</p>
      </div>

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tổng sách */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Tổng sách</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{loading ? "..." : stats.totalBooks}</p>
                <p className="text-xs text-amber-600">{stats.lowStockBooks} sách sắp hết</p>
              </div>
              <div className="bg-emerald-600 p-4 rounded-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Khách hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Khách hàng</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers}</p>
                <p className="text-xs text-emerald-600">Đang hoạt động</p>
              </div>
              <div className="bg-teal-600 p-4 rounded-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Đơn hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Đơn hàng</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{loading ? "..." : stats.totalOrders}</p>
                <p className="text-xs text-amber-600">{stats.pendingOrders} chờ xử lý</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-lg">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Doanh thu */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-2">Doanh thu</p>
                <p className="text-2xl font-bold text-white mb-1">{loading ? "..." : formatVND(stats.totalRevenue)}</p>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Tổng doanh thu
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <DollarSign className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lợi nhuận Card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-2">Lợi nhuận (Doanh thu - Chi phí)</p>
              <p className="text-3xl font-bold text-white mb-1">{loading ? "..." : formatVND(stats.totalProfit)}</p>
              <p className="text-xs text-purple-100">
                Chi phí: {formatVND(stats.totalCost)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BarChart3 className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Biểu đồ lợi nhuận */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Thống kê lợi nhuận
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setProfitView("day")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${profitView === "day" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Theo ngày
              </button>
              <button
                onClick={() => setProfitView("month")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${profitView === "month" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Theo tháng
              </button>
              <button
                onClick={() => setProfitView("year")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${profitView === "year" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Theo năm
              </button>
            </div>
          </div>

          {/* Date range picker cho chế độ theo ngày */}
          {profitView === "day" && (
            <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Từ ngày:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Đến ngày:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Month/Year picker cho chế độ theo tháng */}
          {profitView === "month" && (
            <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Tháng:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>Tháng {month}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Năm:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setSelectedMonth(""); setSelectedYear(""); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Year picker cho chế độ theo năm */}
          {profitView === "year" && (
            <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Năm:</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setFilterYear("")}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          <div className="p-6 pt-0">
            {profitView === "day" && (
              <div className="mb-4 text-sm text-gray-600">
                {dateFrom && dateTo ? (
                  <span>Thống kê từ <strong>{new Date(dateFrom).toLocaleDateString("vi-VN")}</strong> đến <strong>{new Date(dateTo).toLocaleDateString("vi-VN")}</strong></span>
                ) : dateFrom ? (
                  <span>Thống kê từ <strong>{new Date(dateFrom).toLocaleDateString("vi-VN")}</strong></span>
                ) : dateTo ? (
                  <span>Thống kê đến <strong>{new Date(dateTo).toLocaleDateString("vi-VN")}</strong></span>
                ) : (
                  <span>Chọn khoảng thời gian để xem thống kê</span>
                )}
              </div>
            )}
            {chartData.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Chưa có dữ liệu lợi nhuận</p>
            ) : (
              <div className="space-y-4">
                {/* Recharts Bar Chart */}
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="period"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatVND(value), 'Lợi nhuận']}
                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                      <Bar
                        dataKey="profit"
                        name="Lợi nhuận"
                        radius={[4, 4, 0, 0]}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#colorGradient)`}
                          />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          {profitView === "day" ? "Ngày" : profitView === "month" ? "Tháng" : "Năm"}
                        </th>
                        <th className="px-4 py-2 text-right text-gray-700 font-semibold">Lợi nhuận</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-600">{item.period}</td>
                          <td className="px-4 py-2 text-right font-semibold text-purple-700">{formatVND(item.profit)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-purple-600 bg-purple-50">
                        <td className="px-4 py-2 font-bold text-gray-800">Tổng cộng</td>
                        <td className="px-4 py-2 text-right font-bold text-purple-700">
                          {formatVND(chartData.reduce((sum, i) => sum + i.profit, 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top sách bán chạy */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                Top 5 sách bán chạy
              </h3>
            </div>
            <div className="p-6">
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, idx) => (
                    <div key={product.bookId} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{idx + 1}</span>
                      </div>
                      <Image
                        src={product.bookImage || "https://placehold.co/400x600/e2e8f0/64748b?text=No+Image"}
                        alt={product.bookName}
                        width={40}
                        height={56}
                        className="w-10 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium truncate text-sm">{product.bookName}</p>
                        <p className="text-xs text-gray-500">Doanh thu: {formatVND(product.totalRevenue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-bold text-lg">{product.totalQuantity}</p>
                        <p className="text-xs text-gray-500">đã bán</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                Thống kê đơn hàng
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-sm font-medium text-gray-700">Hoàn thành</span>
                  <span className="text-lg font-bold text-emerald-600">{stats.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-sm font-medium text-gray-700">Chờ xử lý</span>
                  <span className="text-lg font-bold text-amber-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Đã hủy</span>
                  <span className="text-lg font-bold text-gray-600">{stats.cancelledOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Tổng đơn</span>
                  <span className="text-lg font-bold text-blue-600">{stats.totalOrders}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Đơn hoàn thành</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-amber-600 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Sách sắp hết</p>
                <p className="text-2xl font-bold text-gray-800">{stats.lowStockBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-teal-600 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Danh mục</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}