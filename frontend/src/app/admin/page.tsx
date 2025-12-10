"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, Users, ShoppingCart, Package, TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { getOverviewStats, getProfitStats, getRevenueStats, getTopProducts, getTopCategories, getPaymentMethodsStats, getComparisonStats } from "@/api/statisticsApi";

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
    totalCost: 0,
    // Comparison data
    revenueChange: 0,
    ordersChange: 0,
    profitChange: 0,
    usersChange: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profitLoading, setProfitLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [topProductsLoading, setTopProductsLoading] = useState(false);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>({ methods: [], totalOrders: 0 });
  const [profitView, setProfitView] = useState<"day" | "month" | "year">("month");
  const [revenueView, setRevenueView] = useState<"day" | "month" | "year">("month");

  // State cho lọc theo ngày (profit)
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // State cho lọc theo tháng (profit)
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // State cho lọc theo năm (profit)
  const [filterYear, setFilterYear] = useState<string>("");

  // State cho revenue filters
  const [revenueDateFrom, setRevenueDateFrom] = useState<string>("");
  const [revenueDateTo, setRevenueDateTo] = useState<string>("");
  const [revenueMonth, setRevenueMonth] = useState<string>("");
  const [revenueYear, setRevenueYear] = useState<string>("");
  const [revenueFilterYear, setRevenueFilterYear] = useState<string>("");

  // Fetch overview stats
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const [overviewResponse, comparisonResponse] = await Promise.all([
          getOverviewStats(),
          getComparisonStats()
        ]);

        if (overviewResponse.success) {
          const statsWithComparison = {
            ...overviewResponse.data,
            ...(comparisonResponse.success ? comparisonResponse.data : {
              revenueChange: 0,
              ordersChange: 0,
              profitChange: 0,
              usersChange: 0
            })
          };
          setStats(statsWithComparison);
        } else {
          setError("Không thể tải dữ liệu thống kê");
        }
      } catch (error) {
        console.error("Error fetching overview stats:", error);
        setError("Lỗi khi tải dữ liệu thống kê");
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
        setProfitLoading(true);
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
      } finally {
        setProfitLoading(false);
      }
    };
    fetchProfit();
  }, [profitView, dateFrom, dateTo, selectedMonth, selectedYear, filterYear]);

  // Fetch revenue stats
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setRevenueLoading(true);
        let from: string | null = null;
        let to: string | null = null;

        if (revenueView === "day" && revenueDateFrom && revenueDateTo) {
          from = revenueDateFrom;
          to = revenueDateTo;
        } else if (revenueView === "month" && revenueYear && revenueMonth) {
          from = `${revenueYear}-${revenueMonth.padStart(2, '0')}-01`;
          const lastDay = new Date(parseInt(revenueYear), parseInt(revenueMonth), 0).getDate();
          to = `${revenueYear}-${revenueMonth.padStart(2, '0')}-${lastDay}`;
        } else if (revenueView === "year" && revenueFilterYear) {
          from = `${revenueFilterYear}-01-01`;
          to = `${revenueFilterYear}-12-31`;
        }

        const response = await (getRevenueStats as any)(revenueView, from, to);
        if (response.success) {
          setRevenueData(response.data);
        }
      } catch (error) {
        console.error("Error fetching revenue stats:", error);
      } finally {
        setRevenueLoading(false);
      }
    };
    fetchRevenue();
  }, [revenueView, revenueDateFrom, revenueDateTo, revenueMonth, revenueYear, revenueFilterYear]);

  // Fetch top products, categories, and payment methods
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTopProductsLoading(true);
        const [productsRes, categoriesRes, paymentRes] = await Promise.all([
          getTopProducts(5),
          getTopCategories(5),
          getPaymentMethodsStats()
        ]);

        if (productsRes.success) {
          setTopProducts(productsRes.data);
        }
        if (categoriesRes.success) {
          setTopCategories(categoriesRes.data);
        }
        if (paymentRes.success) {
          setPaymentMethods(paymentRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTopProductsLoading(false);
      }
    };
    fetchData();
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

  // Render trend indicator
  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Minus className="w-3 h-3" />
          0%
        </span>
      );
    }

    const isPositive = value > 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  // Prepare chart data from API response
  const chartData = profitData.map(item => ({
    period: item.period,
    profit: item.profit,
    revenue: item.revenue,
    cost: item.cost
  }));

  const revenueChartData = revenueData.map(item => ({
    period: item.period,
    revenue: item.revenue,
    cost: item.cost,
    profit: item.profit
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

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => window.location.reload()} className="text-sm text-red-700 hover:text-red-900 font-medium">Thử lại</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Stats Grid - Row 1: 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Doanh thu */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-2">Doanh thu</p>
                <p className="text-2xl font-bold text-white mb-1">{loading ? "..." : formatVND(stats.totalRevenue)}</p>
                <div className="flex items-center gap-2">
                  <TrendIndicator value={stats.revenueChange} />
                  <span className="text-xs text-emerald-100">vs tháng trước</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Lợi nhuận */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-2">Lợi nhuận</p>
                <p className="text-2xl font-bold text-white mb-1">{loading ? "..." : formatVND(stats.totalProfit)}</p>
                <div className="flex items-center gap-2">
                  <TrendIndicator value={stats.profitChange} />
                  <span className="text-xs text-purple-100">vs tháng trước</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Đơn hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Đơn hàng</p>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.totalOrders}</p>
                  <TrendIndicator value={stats.ordersChange} />
                </div>
                <p className="text-xs text-amber-600">{stats.pendingOrders} chờ xử lý</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-lg">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Khách hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Khách hàng</p>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                  <TrendIndicator value={stats.usersChange} />
                </div>
                <p className="text-xs text-gray-500">So với tháng trước</p>
              </div>
              <div className="bg-teal-600 p-4 rounded-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

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
        </div>

        {/* Two Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {profitLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-80 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Chưa có dữ liệu lợi nhuận</p>
                  <p className="text-gray-400 text-sm mt-1">Dữ liệu sẽ hiển thị khi có đơn hàng hoàn thành</p>
                </div>
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

          {/* Biểu đồ doanh thu */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Thống kê doanh thu & chi phí
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setRevenueView("day")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${revenueView === "day" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Theo ngày
                </button>
                <button
                  onClick={() => setRevenueView("month")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${revenueView === "month" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Theo tháng
                </button>
                <button
                  onClick={() => setRevenueView("year")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${revenueView === "year" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Theo năm
                </button>
              </div>
            </div>

            {/* Date filters for revenue */}
            {revenueView === "day" && (
              <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">Từ ngày:</label>
                  <input
                    type="date"
                    value={revenueDateFrom}
                    onChange={(e) => setRevenueDateFrom(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">Đến ngày:</label>
                  <input
                    type="date"
                    value={revenueDateTo}
                    onChange={(e) => setRevenueDateTo(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => { setRevenueDateFrom(""); setRevenueDateTo(""); }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {revenueView === "month" && (
              <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">Tháng:</label>
                  <select
                    value={revenueMonth}
                    onChange={(e) => setRevenueMonth(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    value={revenueYear}
                    onChange={(e) => setRevenueYear(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    {getAvailableYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => { setRevenueMonth(""); setRevenueYear(""); }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {revenueView === "year" && (
              <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">Năm:</label>
                  <select
                    value={revenueFilterYear}
                    onChange={(e) => setRevenueFilterYear(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    {getAvailableYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setRevenueFilterYear("")}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            <div className="p-6 pt-0">
              {revenueLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-80 bg-gray-200 rounded-lg"></div>
                </div>
              ) : revenueChartData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Chưa có dữ liệu doanh thu</p>
                  <p className="text-gray-400 text-sm mt-1">Dữ liệu sẽ hiển thị khi có đơn hàng hoàn thành</p>
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueChartData}
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
                        formatter={(value: number, name: string) => {
                          const labels: Record<string, string> = {
                            revenue: 'Doanh thu',
                            cost: 'Chi phí',
                            profit: 'Lợi nhuận'
                          };
                          return [formatVND(value), labels[name] || name];
                        }}
                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Doanh thu"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        name="Chi phí"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Lợi nhuận"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Three Column Layout: Top Products + Order Stats + Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top sách bán chạy */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                Top 5 sách bán chạy
              </h3>
            </div>
            <div className="p-6">
              {topProductsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="w-10 h-14 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Chưa có dữ liệu</p>
                  <p className="text-gray-400 text-sm mt-1">Sản phẩm bán chạy sẽ hiển thị tại đây</p>
                </div>
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

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Top 5 thể loại bán chạy
              </h3>
            </div>
            <div className="p-6">
              {topCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Chưa có dữ liệu</div>
              ) : (
                <div className="space-y-3">
                  {topCategories.map((category, idx) => {
                    const colors = ["bg-purple-600", "bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-pink-600"];
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                            <div>
                              <p className="font-medium text-gray-800">{category.name}</p>
                              <p className="text-xs text-gray-500">{formatVND(category.revenue)}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{category.percentage?.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${colors[idx % colors.length]} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${category.percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-4 text-center">Dựa trên doanh thu bán hàng</p>
            </div>
          </div>
        </div>

        {/* Payment Methods - Full Width */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Phương thức thanh toán
            </h3>
          </div>
          <div className="p-6">
            {paymentMethods.methods?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Chưa có dữ liệu</div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.methods?.map((payment: any, idx: number) => {
                  const methodConfig: Record<string, { label: string; icon: string; color: string }> = {
                    "COD": { label: "COD (Tiền mặt)", icon: "💵", color: "bg-emerald-600" },
                    "cash": { label: "COD (Tiền mặt)", icon: "💵", color: "bg-emerald-600" },
                    "CARD": { label: "Thẻ tín dụng", icon: "💎", color: "bg-purple-600" },
                    "creditCard": { label: "Thẻ tín dụng", icon: "💎", color: "bg-purple-600" },
                    "PAYOS": { label: "PayOS (QR Code)", icon: "💳", color: "bg-indigo-600" },
                    "payos": { label: "PayOS (QR Code)", icon: "💳", color: "bg-indigo-600" }
                  };
                  const config = methodConfig[payment.method] || { label: payment.method, icon: "💰", color: "bg-gray-600" };
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <p className="font-medium text-gray-800">{config.label}</p>
                            <p className="text-xs text-gray-500">{payment.count} đơn hàng - {formatVND(payment.totalAmount)}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-700">{payment.percentage?.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`${config.color} h-2.5 rounded-full transition-all duration-500`}
                          style={{ width: `${payment.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tổng giao dịch</span>
                <span className="text-xl font-bold text-blue-600">{paymentMethods.totalOrders || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}