"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { orders as fakeOrders, users, books } from "../fakedata";
import type { Order, OrderItem } from "@/types/order.type";
import type { User } from "@/types/user.type";
import type { Book } from "@/types/book.type";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(fakeOrders);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

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
      // recalc sub_total for updated line
      const updated = items[index];
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
      alert("Vui lòng chọn khách hàng!");
      return;
    }
    if (formData.items.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm!");
      return;
    }
    // validate items: no empty book_id and positive qty/price
    for (const it of formData.items) {
      if (!it.book_id) {
        alert("Vui lòng chọn sách cho mỗi dòng sản phẩm!");
        return;
      }
      if (it.quantity <= 0 || it.price < 0) {
        alert("Số lượng phải >= 1 và giá phải >= 0.");
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

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
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
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Đơn hàng</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition"
        >
          <Plus className="w-4 h-4" /> Thêm đơn hàng
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        <div className="bg-white rounded-md shadow-sm border border-[#E6D6B8] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#D1B892]">
              <tr>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Mã đơn</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Khách hàng</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Ngày mua</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-center text-[#6B4E2E] font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6B4E2E] italic">
                    Chưa có đơn hàng nào 📦
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const user = users.find((u) => u.id === order.user_id);
                  const isExpanded = expandedOrders.has(order.id);
                  return (
                    <>
                      <tr key={order.id} className="border-t border-[#E6D6B8] hover:bg-[#F9F6EC] transition">
                        <td className="px-4 py-3 text-[#6B4E2E]">
                          <button 
                            onClick={() => toggleExpand(order.id)}
                            className="flex items-center gap-2 hover:text-[#8B6F5C] transition"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {order.id}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-[#6B4E2E]">{user?.fullName || "Không rõ"}</td>
                        <td className="px-4 py-3 text-[#6B4E2E]">{new Date(order.purchase_date).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-3 text-[#6B4E2E]">{formatVND(order.total_price)}</td>
                        <td className="px-4 py-3 text-[#6B4E2E] capitalize">{order.purchase_status}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openModal(order)} className="p-2 bg-[#D1B892] text-[#6B4E2E] rounded-lg hover:bg-[#C0A57A] transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(order.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#F9F6EC]">
                          <td colSpan={6} className="px-8 py-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E6D6B8]">
                              <h4 className="font-semibold text-[#6B4E2E] mb-3">Chi tiết đơn hàng:</h4>
                              <table className="w-full">
                                <thead className="bg-[#F9F6EC]">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-[#6B4E2E] font-medium">Sách</th>
                                    <th className="px-3 py-2 text-center text-[#6B4E2E] font-medium">Số lượng</th>
                                    <th className="px-3 py-2 text-right text-[#6B4E2E] font-medium">Đơn giá</th>
                                    <th className="px-3 py-2 text-right text-[#6B4E2E] font-medium">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, idx) => {
                                    const book = books.find((b: Book) => b.id === item.book_id);
                                    return (
                                      <tr key={idx} className="border-t border-[#E6D6B8]">
                                        <td className="px-3 py-2 text-[#6B4E2E]">
                                          {(book as any)?.title || (book as any)?.name || "Không tìm thấy sách"}
                                        </td>
                                        <td className="px-3 py-2 text-center text-[#6B4E2E]">{item.quantity}</td>
                                        <td className="px-3 py-2 text-right text-[#6B4E2E]">{formatVND(item.price)}</td>
                                        <td className="px-3 py-2 text-right text-[#6B4E2E] font-semibold">{formatVND(item.sub_total)}</td>
                                      </tr>
                                    );
                                  })}
                                  <tr className="border-t-2 border-[#B18F7C]">
                                    <td colSpan={3} className="px-3 py-2 text-right text-[#6B4E2E] font-semibold">Tổng cộng:</td>
                                    <td className="px-3 py-2 text-right text-[#6B4E2E] font-bold text-lg">{formatVND(order.total_price)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-[#6B4E2E] mb-4">
              {editingOrder ? "Sửa đơn hàng" : "Thêm đơn hàng mới"}
            </h3>

            {/* Customer & date & status */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Khách hàng *</label>
                <select value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className="w-full border border-[#D1B892] px-3 py-2 rounded-md">
                  <option value="">-- Chọn khách hàng --</option>
                  {users.filter(u => u.role === "customer").map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Ngày mua *</label>
                <input type="date" value={formData.purchase_date} onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })} className="w-full border border-[#D1B892] px-3 py-2 rounded-md" />
              </div>

              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Trạng thái *</label>
                <select value={formData.purchase_status} onChange={(e) => setFormData({ ...formData, purchase_status: e.target.value as Order["purchase_status"] })} className="w-full border border-[#D1B892] px-3 py-2 rounded-md">
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <label className="block text-[#6B4E2E] mb-2 font-medium">Sản phẩm *</label>
              <div className="space-y-3">
                {formData.items.map((it, idx) => {
                  const book = books.find((b: Book) => b.id === it.book_id);
                  return (
                    <div key={idx} className="flex gap-2 items-center">
                      <select value={it.book_id} onChange={(e) => updateItem(idx, "book_id", e.target.value)} className="border border-[#D1B892] px-2 py-2 rounded-md flex-1">
                        <option value="">Chọn sách</option>
                        {books.map((b: Book) => <option key={b.id} value={b.id}>{(b as any).title || (b as any).name || b.id}</option>)}
                      </select>

                      <input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} className="w-24 border border-[#D1B892] px-2 py-2 rounded-md" />
                      <input type="number" min={0} value={it.price} onChange={(e) => updateItem(idx, "price", Number(e.target.value))} className="w-32 border border-[#D1B892] px-2 py-2 rounded-md" />
                      <div className="w-32 text-right text-[#6B4E2E]">{formatVND(it.sub_total)}</div>
                      <button onClick={() => removeItem(idx)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button onClick={addItem} className="mt-3 flex items-center gap-2 text-[#6B4E2E] font-medium hover:text-[#8B6F5C] transition">
                <Plus className="w-4 h-4" /> Thêm sản phẩm
              </button>
            </div>

            {/* Total */}
            <div className="text-right text-[#6B4E2E] font-semibold mb-4">Tổng tiền: {formatVND(calcTotal(formData.items as OrderItem[]))}</div>

            {/* buttons */}
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="flex-1 bg-[#B18F7C] text-white px-4 py-2 rounded-lg hover:bg-[#8B6F5C] transition font-semibold">
                {editingOrder ? "Cập nhật" : "Thêm mới"}
              </button>
              <button onClick={resetForm} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}