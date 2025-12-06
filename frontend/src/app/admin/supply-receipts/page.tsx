"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supplyReceipts as fakeReceipts, suppliers, books, users } from "@/app/admin/fakedata";
import type { SupplyReceipt, SupplyItem } from "@/types/supplyreceipt.type";
import type { Supplier } from "@/types/supplier.type";
import type { Book } from "@/types/book.type";
import type { User } from "@/types/user.type";

export default function SupplyReceiptsPage() {
  const [receipts, setReceipts] = useState<SupplyReceipt[]>(fakeReceipts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SupplyReceipt | null>(null);
  const [formData, setFormData] = useState<Omit<SupplyReceipt, "id" | "total_amount">>({
    supplier_id: "",
    admin_id: "u1",
    supply_date: new Date().toISOString().slice(0, 10),
    supply_status: "pending",
    items: [],
  });

  // Tính tổng tiền
  const calcTotal = (items: SupplyItem[]) =>
    items.reduce((sum, i) => sum + i.import_price * i.quantity, 0);

  // Mở modal
  const openModal = (receipt: SupplyReceipt | null = null) => {
    if (receipt) {
      setEditing(receipt);
      setFormData({
        supplier_id: receipt.supplier_id,
        admin_id: receipt.admin_id,
        supply_date: receipt.supply_date.slice(0, 10),
        supply_status: receipt.supply_status,
        items: receipt.items,
      });
    } else {
      setEditing(null);
      setFormData({
        supplier_id: "",
        admin_id: "u1",
        supply_date: new Date().toISOString().slice(0, 10),
        supply_status: "pending",
        items: [],
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      supplier_id: "",
      admin_id: "u1",
      supply_date: new Date().toISOString().slice(0, 10),
      supply_status: "pending",
      items: [],
    });
    setShowModal(false);
  };

  // Thêm dòng sản phẩm
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { book_id: "", import_price: 0, quantity: 1, sub_amount: 0 }],
    });
  };

  // Cập nhật dòng
  const updateItem = (index: number, field: keyof SupplyItem, value: any) => {
    const newItems = [...formData.items];
    const updatedItem = { ...newItems[index], [field]: value };
    updatedItem.sub_amount = updatedItem.import_price * updatedItem.quantity;
    newItems[index] = updatedItem;
    setFormData({ ...formData, items: newItems });
  };

  // Xóa dòng sản phẩm
  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  // Lưu phiếu nhập
  const handleSubmit = () => {
    if (!formData.supplier_id || formData.items.length === 0) {
      alert("Vui lòng chọn nhà cung cấp và thêm ít nhất 1 sản phẩm!");
      return;
    }

    const total = calcTotal(formData.items);

    if (editing) {
      setReceipts((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                id: r.id,
                supplier_id: formData.supplier_id,
                admin_id: formData.admin_id,
                supply_date: formData.supply_date,
                supply_status: formData.supply_status,
                items: formData.items,
                total_amount: total,
              }
            : r
        )
      );
    } else {
      const newReceipt: SupplyReceipt = {
        id: `r${Date.now()}`,
        supplier_id: formData.supplier_id,
        admin_id: formData.admin_id,
        supply_date: formData.supply_date,
        supply_status: formData.supply_status,
        items: formData.items,
        total_amount: total,
      };
      setReceipts((prev) => [...prev, newReceipt]);
    }

    resetForm();
  };

  // Xóa phiếu
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa phiếu nhập này?")) {
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 text-2xl font-bold">Quản lý phiếu nhập hàng</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý thông tin nhập hàng từ nhà cung cấp</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> Thêm phiếu nhập
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
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Mã phiếu</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Nhà cung cấp</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Ngày nhập</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-gray-700 font-semibold text-sm">Tổng tiền</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {receipts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      Chưa có phiếu nhập nào 📦
                    </td>
                  </tr>
                ) : (
                  receipts.map((r) => {
                    const supplier = suppliers.find((s) => s.id === r.supplier_id);
                    return (
                      <tr key={r.id} className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                        <td className="px-4 py-4 text-gray-800 font-medium">{r.id}</td>
                        <td className="px-4 py-4 text-gray-600">{supplier?.name || "Không rõ"}</td>
                        <td className="px-4 py-4 text-gray-600">
                          {new Date(r.supply_date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            r.supply_status === "completed"
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : r.supply_status === "cancelled"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {r.supply_status === "completed"
                              ? "Hoàn tất"
                              : r.supply_status === "cancelled"
                              ? "Đã hủy"
                              : "Đang xử lý"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-gray-800 font-semibold">
                          {r.total_amount.toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openModal(r)}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b-2 border-emerald-600">
              {editing ? "Sửa phiếu nhập" : "Thêm phiếu nhập mới"}
            </h3>

            {/* Nhà cung cấp */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium text-sm">Nhà cung cấp *</label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày và trạng thái */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 font-medium text-sm">Ngày nhập *</label>
                <input
                  type="date"
                  value={formData.supply_date}
                  onChange={(e) =>
                    setFormData({ ...formData, supply_date: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 font-medium text-sm">Trạng thái *</label>
                <select
                  value={formData.supply_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supply_status: e.target.value as SupplyReceipt["supply_status"],
                    })
                  }
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="pending">Đang xử lý</option>
                  <option value="completed">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium text-sm">Chi tiết sản phẩm *</label>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={item.book_id}
                      onChange={(e) =>
                        updateItem(index, "book_id", e.target.value)
                      }
                      className="border border-gray-300 px-3 py-2.5 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Chọn sách</option>
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      className="w-24 border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="SL"
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.import_price}
                      onChange={(e) =>
                        updateItem(index, "import_price", Number(e.target.value))
                      }
                      className="w-32 border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Giá nhập"
                    />
                    <span className="w-28 text-right text-gray-800 font-medium">
                      {item.sub_amount.toLocaleString("vi-VN")} ₫
                    </span>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="mt-3 flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 transition"
              >
                <Plus className="w-4 h-4" /> Thêm sản phẩm
              </button>
            </div>

            {/* Tổng tiền */}
            <div className="text-right text-gray-800 font-bold text-lg mb-4 pb-4 border-t border-gray-200 pt-4">
              Tổng tiền: {calcTotal(formData.items).toLocaleString("vi-VN")} ₫
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {editing ? "Cập nhật" : "Thêm mới"}
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