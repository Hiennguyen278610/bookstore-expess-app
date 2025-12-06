"use client";
import { useState, useEffect } from "react";
import { BookOpen, Users, ShoppingCart, Package, TrendingUp, DollarSign } from "lucide-react";
import { books, users, orders, categories } from "./fakedata";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    lowStock: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    const totalBooks = books.length;
    const totalUsers = users.filter(u => u.role === "customer").length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    const totalCategories = categories.length;
    const lowStock = books.filter(b => b.quantity < 10).length;
    const pendingOrders = orders.filter(o => o.purchase_status === "pending").length;
    const completedOrders = orders.filter(o => o.purchase_status === "delivered").length;

    setStats({
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue,
      totalCategories,
      lowStock,
      pendingOrders,
      completedOrders
    });
  }, []);

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const topBooks = books
    .map(book => {
      const soldCount = orders.reduce((sum, order) => {
        const item = order.items.find(i => i.book_id === book.id);
        return sum + (item ? item.quantity : 0);
      }, 0);
      return { ...book, soldCount };
    })
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
    .slice(0, 5);

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
                <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalBooks}</p>
                <p className="text-xs text-amber-600">{stats.lowStock} sách sắp hết</p>
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
                <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalOrders}</p>
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
                <p className="text-2xl font-bold text-white mb-1">{formatVND(stats.totalRevenue)}</p>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Tổng doanh thu
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
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
              {topBooks.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-3">
                  {topBooks.map((book, idx) => (
                    <div key={book.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{idx + 1}</span>
                      </div>
                      <img
                        src={book.imageUrl}
                        alt={book.name}
                        className="w-10 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium truncate text-sm">{book.name}</p>
                        <p className="text-xs text-gray-500">{formatVND(book.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-bold text-lg">{book.soldCount}</p>
                        <p className="text-xs text-gray-500">đã bán</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Đơn hàng gần đây */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-teal-600" />
                Đơn hàng gần đây
              </h3>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Chưa có đơn hàng</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => {
                    const user = users.find(u => u.id === order.user_id);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-gray-50 transition-all duration-200">
                        <div className="flex-1">
                          <p className="text-gray-800 font-semibold text-sm">{order.id}</p>
                          <p className="text-sm text-gray-600 mt-1">{user?.fullName || "Không rõ"}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.purchase_date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-teal-700 font-bold text-base">{formatVND(order.total_price)}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(order.purchase_status)}`}>
                            {order.purchase_status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <p className="text-2xl font-bold text-gray-800">{stats.lowStock}</p>
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