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
    // Tính toán thống kê
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

  // Top 5 sách bán chạy
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

  // Đơn hàng gần đây
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Dashboard - Tổng quan hệ thống</h2>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner space-y-5">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tổng sách */}
          <div className="bg-white rounded-lg p-5 border border-[#E6D6B8] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B4E2E] text-sm font-medium mb-1">Tổng sách</p>
                <p className="text-3xl font-bold text-[#B18F7C]">{stats.totalBooks}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.lowStock} sách sắp hết</p>
              </div>
              <div className="bg-[#D1B892] p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-[#6B4E2E]" />
              </div>
            </div>
          </div>

          {/* Khách hàng */}
          <div className="bg-white rounded-lg p-5 border border-[#E6D6B8] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B4E2E] text-sm font-medium mb-1">Khách hàng</p>
                <p className="text-3xl font-bold text-[#B18F7C]">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Đang hoạt động</p>
              </div>
              <div className="bg-[#D1B892] p-3 rounded-full">
                <Users className="w-6 h-6 text-[#6B4E2E]" />
              </div>
            </div>
          </div>

          {/* Đơn hàng */}
          <div className="bg-white rounded-lg p-5 border border-[#E6D6B8] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B4E2E] text-sm font-medium mb-1">Đơn hàng</p>
                <p className="text-3xl font-bold text-[#B18F7C]">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.pendingOrders} chờ xử lý</p>
              </div>
              <div className="bg-[#D1B892] p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-[#6B4E2E]" />
              </div>
            </div>
          </div>

          {/* Doanh thu */}
          <div className="bg-white rounded-lg p-5 border border-[#E6D6B8] shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B4E2E] text-sm font-medium mb-1">Doanh thu</p>
                <p className="text-2xl font-bold text-[#B18F7C]">{formatVND(stats.totalRevenue)}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Tổng doanh thu
                </p>
              </div>
              <div className="bg-[#D1B892] p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-[#6B4E2E]" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Top sách bán chạy */}
          <div className="bg-white rounded-lg border border-[#E6D6B8] shadow-sm">
            <div className="bg-[#D1B892] px-4 py-3 rounded-t-lg">
              <h3 className="text-[#6B4E2E] font-semibold flex items-center gap-2">
                <Package className="w-4 h-4" />
                Top 5 sách bán chạy
              </h3>
            </div>
            <div className="p-4">
              {topBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-3">
                  {topBooks.map((book, idx) => (
                    <div key={book.id} className="flex items-center gap-3 p-2 hover:bg-[#F9F6EC] rounded transition">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#D1B892] rounded-full flex items-center justify-center">
                        <span className="text-[#6B4E2E] font-bold text-sm">#{idx + 1}</span>
                      </div>
                      <img
                        src={book.imageUrl}
                        alt={book.name}
                        className="w-10 h-14 object-cover rounded border border-[#D1B892]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#6B4E2E] font-medium truncate">{book.name}</p>
                        <p className="text-xs text-gray-500">{formatVND(book.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#B18F7C] font-bold">{book.soldCount}</p>
                        <p className="text-xs text-gray-500">đã bán</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Đơn hàng gần đây */}
          <div className="bg-white rounded-lg border border-[#E6D6B8] shadow-sm">
            <div className="bg-[#D1B892] px-4 py-3 rounded-t-lg">
              <h3 className="text-[#6B4E2E] font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Đơn hàng gần đây
              </h3>
            </div>
            <div className="p-4">
              {recentOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có đơn hàng</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => {
                    const user = users.find(u => u.id === order.user_id);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 border border-[#E6D6B8] rounded-lg hover:bg-[#F9F6EC] transition">
                        <div className="flex-1">
                          <p className="text-[#6B4E2E] font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{user?.fullName || "Không rõ"}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.purchase_date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#B18F7C] font-semibold">{formatVND(order.total_price)}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getStatusColor(order.purchase_status)}`}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-[#E6D6B8] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đơn hoàn thành</p>
                <p className="text-xl font-bold text-[#6B4E2E]">{stats.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E6D6B8] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sách sắp hết</p>
                <p className="text-xl font-bold text-[#6B4E2E]">{stats.lowStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#E6D6B8] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Danh mục</p>
                <p className="text-xl font-bold text-[#6B4E2E]">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}