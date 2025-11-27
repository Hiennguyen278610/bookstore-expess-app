"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supplyReceipts as fakeReceipts, suppliers, books, users } from "../fakedata";
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
          r.id === editing.id ? { ...formData, id: r.id, total_amount: total } : r
        )
      );
    } else {
      const newReceipt: SupplyReceipt = {
        id: `r${Date.now()}`,
        ...formData,
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
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Phiếu nhập hàng</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition"
        >
          <Plus className="w-4 h-4" /> Thêm phiếu nhập
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        <div className="bg-white rounded-md shadow-sm border border-[#E6D6B8] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#D1B892]">
              <tr>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Mã phiếu</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Nhà cung cấp</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Ngày nhập</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-right text-[#6B4E2E] font-semibold">Tổng tiền</th>
                <th className="px-4 py-3 text-center text-[#6B4E2E] font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6B4E2E] italic">
                    Chưa có phiếu nhập nào 📦
                  </td>
                </tr>
              ) : (
                receipts.map((r) => {
                  const supplier = suppliers.find((s) => s.id === r.supplier_id);
                  return (
                    <tr key={r.id} className="border-t border-[#E6D6B8] hover:bg-[#F9F6EC] transition">
                      <td className="px-4 py-3 text-[#6B4E2E] font-medium">{r.id}</td>
                      <td className="px-4 py-3 text-[#6B4E2E]">{supplier?.name || "Không rõ"}</td>
                      <td className="px-4 py-3 text-[#6B4E2E]">
                        {new Date(r.supply_date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-[#6B4E2E] capitalize">
                        {r.supply_status === "completed"
                          ? "Hoàn tất"
                          : r.supply_status === "cancelled"
                          ? "Đã hủy"
                          : "Đang xử lý"}
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B4E2E] font-semibold">
                        {r.total_amount.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(r)}
                            className="p-2 bg-[#D1B892] text-[#6B4E2E] rounded-lg hover:bg-[#C0A57A] transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
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

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-[#6B4E2E] mb-4">
              {editing ? "Sửa phiếu nhập" : "Thêm phiếu nhập mới"}
            </h3>

            {/* Nhà cung cấp */}
            <div className="mb-4">
              <label className="block text-[#6B4E2E] mb-1 font-medium">Nhà cung cấp *</label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
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
                <label className="block text-[#6B4E2E] mb-1 font-medium">Ngày nhập *</label>
                <input
                  type="date"
                  value={formData.supply_date}
                  onChange={(e) =>
                    setFormData({ ...formData, supply_date: e.target.value })
                  }
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[#6B4E2E] mb-1 font-medium">Trạng thái *</label>
                <select
                  value={formData.supply_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supply_status: e.target.value as SupplyReceipt["supply_status"],
                    })
                  }
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                >
                  <option value="pending">Đang xử lý</option>
                  <option value="completed">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="mb-4">
              <label className="block text-[#6B4E2E] mb-2 font-medium">Chi tiết sản phẩm *</label>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={item.book_id}
                      onChange={(e) =>
                        updateItem(index, "book_id", e.target.value)
                      }
                      className="border border-[#D1B892] px-2 py-2 rounded-md flex-1"
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
                      className="w-24 border border-[#D1B892] px-2 py-2 rounded-md"
                      placeholder="SL"
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.import_price}
                      onChange={(e) =>
                        updateItem(index, "import_price", Number(e.target.value))
                      }
                      className="w-32 border border-[#D1B892] px-2 py-2 rounded-md"
                      placeholder="Giá nhập"
                    />
                    <span className="w-28 text-right text-[#6B4E2E]">
                      {item.sub_amount.toLocaleString("vi-VN")} ₫
                    </span>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="mt-3 flex items-center gap-2 text-[#6B4E2E] font-medium hover:text-[#8B6F5C] transition"
              >
                <Plus className="w-4 h-4" /> Thêm sản phẩm
              </button>
            </div>

            {/* Tổng tiền */}
            <div className="text-right text-[#6B4E2E] font-semibold mb-4">
              Tổng tiền: {calcTotal(formData.items).toLocaleString("vi-VN")} ₫
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#B18F7C] text-white px-4 py-2 rounded-lg hover:bg-[#8B6F5C] transition font-semibold"
              >
                {editing ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
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
