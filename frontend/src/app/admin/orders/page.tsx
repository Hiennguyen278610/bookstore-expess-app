"use client";
import React, { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { orders as fakeOrders, users, books } from "../fakedata";
import type { Order, OrderItem } from "@/types/order.type";
import type { User } from "@/types/user.type";
import type { Book } from "@/types/book.type";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(fakeOrders);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter và Pagination logic
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(o => o.purchase_status === statusFilter);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Đếm số lượng theo từng trạng thái
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.purchase_status === "pending").length,
    processing: orders.filter(o => o.purchase_status === "processing").length,
    delivered: orders.filter(o => o.purchase_status === "delivered").length,
    cancelled: orders.filter(o => o.purchase_status === "cancelled").length,
  };

  const [formData, setFormData] = useState<Omit<Order, "id" | "total_price">>({
    user_id: "",
    payment_method: "cash",
    purchase_date: new Date().toISOString().slice(0, 10),
    purchase_status: "pending",
    items: [],
  });

  // Helpers
  const calcTotal = (items: OrderItem[]) =>
    items.reduce((s, it) => s + it.sub_total, 0);

  const calcSub = (item: OrderItem) => item.quantity * item.price;

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // CRUD modal open
  const openModal = (order: Order | null = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        user_id: order.user_id,
        payment_method: order.payment_method,
        purchase_date: order.purchase_date.slice(0, 10),
        purchase_status: order.purchase_status,
        items: order.items.map((it) => ({ ...it })), // copy
      });
    } else {
      setEditingOrder(null);
      setFormData({
        user_id: "",
        payment_method: "cash",
        purchase_date: new Date().toISOString().slice(0, 10),
        purchase_status: "pending",
        items: [],
      });
    }
    setShowModal(true);
  };

  // add item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { book_id: "", quantity: 1, price: 0, sub_total: 0 }],
    }));
  };

  // update item field (and recalc sub_total)
  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    setFormData((prev) => {
      const items = prev.items.map((it, i) => (i === index ? { ...it, [field]: value } : it));
      const updated = items[index];

      // Nếu chọn sách mới, tự động lấy giá từ sách
      if (field === "book_id" && value) {
        const selectedBook = books.find((b: any) => b.id === value);
        if (selectedBook) {
          updated.price = selectedBook.price || 0;
        }
      }

      // recalc sub_total for updated line
      const qty = Number(updated.quantity) || 0;
      const pr = Number(updated.price) || 0;
      items[index] = { ...updated, quantity: qty, price: pr, sub_total: qty * pr };
      return { ...prev, items };
    });
  };

  // remove item
  const removeItem = (index: number) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  // submit order
  const handleSubmit = () => {
    if (!formData.user_id) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng chọn khách hàng!',
      });
      return;
    }
    if (formData.items.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng thêm ít nhất 1 sản phẩm!',
      });
      return;
    }
    // validate items: no empty book_id and positive qty/price
    for (const it of formData.items) {
      if (!it.book_id) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Vui lòng chọn sách cho mỗi dòng sản phẩm!',
        });
        return;
      }
      if (it.quantity <= 0 || it.price < 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Số lượng phải >= 1 và giá phải >= 0.',
        });
        return;
      }
    }

    const total = calcTotal(formData.items as OrderItem[]);

    if (editingOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...o, ...formData, total_price: total } : o
        )
      );
    } else {
      const newOrder: Order = {
        id: `o${Date.now()}`,
        ...formData,
        total_price: total,
      };
      setOrders((prev) => [...prev, newOrder]);
    }

    resetForm();
  };

  const handleDelete = async (id: string, userName: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa đơn hàng',
      html: `Bạn có chắc muốn xóa đơn hàng của "<strong>${userName}</strong>"?<br/><small class="text-red-500">⚠️ Hành động này không thể hoàn tác!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success('Xóa đơn hàng thành công!', {
        position: 'bottom-right',
        duration: 3000,
        style: {
          fontSize: '15px',
          padding: '16px',
        },
      });
    }
  };

  const resetForm = () => {
    setEditingOrder(null);
    setFormData({
      user_id: "",
      payment_method: "cash",
      purchase_date: new Date().toISOString().slice(0, 10),
      purchase_status: "pending",
      items: [],
    });
    setShowModal(false);
  };

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 text-2xl font-bold">Quản lý đơn hàng</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý thông tin đơn hàng trong cửa hàng</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> Thêm đơn hàng
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${statusFilter === "all"
              ? "bg-teal-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Tất cả <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{statusCounts.all}</span>
          </button>
          <button
            onClick={() => { setStatusFilter("pending"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${statusFilter === "pending"
              ? "bg-amber-500 text-white shadow-md"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              }`}
          >
            Đang chờ <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{statusCounts.pending}</span>
          </button>
          <button
            onClick={() => { setStatusFilter("processing"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${statusFilter === "processing"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
          >
            Đang xử lý <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{statusCounts.processing}</span>
          </button>
          <button
            onClick={() => { setStatusFilter("delivered"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${statusFilter === "delivered"
              ? "bg-teal-500 text-white shadow-md"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
              }`}
          >
            Đã giao <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{statusCounts.delivered}</span>
          </button>
          <button
            onClick={() => { setStatusFilter("cancelled"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${statusFilter === "cancelled"
              ? "bg-red-500 text-white shadow-md"
              : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              }`}
          >
            Đã hủy <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{statusCounts.cancelled}</span>
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Mã đơn</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Ngày mua</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      Chưa có đơn hàng nào 📦
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const user = users.find((u: any) => u.id === order.user_id);
                    const isExpanded = expandedOrders.has(order.id);
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                          <td className="px-4 py-4">
                            <button
                              onClick={() => toggleExpand(order.id)}
                              className="flex items-center gap-2 text-gray-800 font-medium hover:text-emerald-700 transition"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              {order.id}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-gray-600">{user?.fullName || "Không rõ"}</td>
                          <td className="px-4 py-4 text-gray-600">{new Date(order.purchase_date).toLocaleDateString("vi-VN")}</td>
                          <td className="px-4 py-4 text-gray-800 font-semibold">{formatVND(order.total_price)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${order.purchase_status === "delivered"
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : order.purchase_status === "processing"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : order.purchase_status === "cancelled"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                              {order.purchase_status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openModal(order)}
                                className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(order.id, user?.fullName || user?.username || 'Không rõ')}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-8 py-4">
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-3">Chi tiết đơn hàng:</h4>
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-gray-700 font-medium text-sm">Sách</th>
                                      <th className="px-3 py-2 text-center text-gray-700 font-medium text-sm">Số lượng</th>
                                      <th className="px-3 py-2 text-right text-gray-700 font-medium text-sm">Đơn giá</th>
                                      <th className="px-3 py-2 text-right text-gray-700 font-medium text-sm">Thành tiền</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, idx) => {
                                      const book = books.find((b: any) => b.id === item.book_id);
                                      return (
                                        <tr key={idx} className="border-t border-gray-200">
                                          <td className="px-3 py-2 text-gray-600">
                                            {book?.name || "Không tìm thấy sách"}
                                          </td>
                                          <td className="px-3 py-2 text-center text-gray-600">{item.quantity}</td>
                                          <td className="px-3 py-2 text-right text-gray-600">{formatVND(item.price)}</td>
                                          <td className="px-3 py-2 text-right text-gray-800 font-semibold">{formatVND(item.sub_total)}</td>
                                        </tr>
                                      );
                                    })}
                                    <tr className="border-t-2 border-emerald-600">
                                      <td colSpan={3} className="px-3 py-2 text-right text-gray-700 font-semibold">Tổng cộng:</td>
                                      <td className="px-3 py-2 text-right text-gray-800 font-bold text-lg">{formatVND(order.total_price)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={orders.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.3)] transform transition-all animate-slideUp">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b-2 border-emerald-600">
              {editingOrder ? "Sửa đơn hàng" : "Thêm đơn hàng mới"}
            </h3>

            {/* Customer & date & status */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Khách hàng *</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {users.filter((u: any) => u.role === "user").map((u: any) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Ngày mua *</label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Trạng thái *</label>
                <select
                  value={formData.purchase_status}
                  onChange={(e) => setFormData({ ...formData, purchase_status: e.target.value as Order["purchase_status"] })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium text-sm">Sản phẩm *</label>
              <div className="space-y-3">
                {formData.items.map((it, idx) => {
                  const book = books.find((b: any) => b.id === it.book_id);
                  return (
                    <div key={idx} className="flex gap-2 items-center">
                      <select
                        value={it.book_id}
                        onChange={(e) => updateItem(idx, "book_id", e.target.value)}
                        className="border border-gray-300 px-3 py-2.5 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Chọn sách</option>
                        {books.map((b: any) => <option key={b.id} value={b.id}>{b.name || b.id}</option>)}
                      </select>

                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                        className="w-24 border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="SL"
                      />
                      <input
                        type="number"
                        min={0}
                        value={it.price}
                        onChange={(e) => updateItem(idx, "price", Number(e.target.value))}
                        className="w-32 border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Giá"
                      />
                      <div className="w-32 text-right text-gray-800 font-medium">{formatVND(it.sub_total)}</div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addItem}
                className="mt-3 flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 transition"
              >
                <Plus className="w-4 h-4" /> Thêm sản phẩm
              </button>
            </div>

            {/* Total */}
            <div className="text-right text-gray-800 font-bold text-lg mb-4 pb-4 border-t border-gray-200 pt-4">
              Tổng tiền: {formatVND(calcTotal(formData.items as OrderItem[]))}
            </div>

            {/* buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {editingOrder ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}