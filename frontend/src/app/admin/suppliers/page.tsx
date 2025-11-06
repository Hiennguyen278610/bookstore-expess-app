"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { suppliers as fakeSuppliers } from "../fakedata";
import type { Supplier } from "@/types/supplier.type";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(fakeSuppliers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Omit<Supplier, "id">>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Lọc theo tên hoặc số điện thoại
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mở modal thêm/sửa
  const openModal = (supplier: Supplier | null = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
    setEditingSupplier(null);
    setShowModal(false);
  };

  // Submit form
  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert("Vui lòng nhập ít nhất tên và số điện thoại!");
      return;
    }

    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id ? { ...s, ...formData } : s
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: `sp${Date.now()}`,
        ...formData,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }

    resetForm();
  };

  // Xóa
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này?")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Nhà cung cấp</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition"
        >
          <Plus className="w-4 h-4" /> Thêm nhà cung cấp
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        {/* Ô tìm kiếm */}
        <div className="flex gap-4 mb-4">
          <div className="relative w-full">
            <input
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#D1B892] bg-white px-3 py-2 pl-10 rounded-md w-full text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
            />
            <Search className="w-5 h-5 text-[#B18F7C] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md shadow-sm border border-[#E6D6B8] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#D1B892]">
              <tr>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Tên nhà cung cấp</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Địa chỉ</th>
                <th className="px-4 py-3 text-center text-[#6B4E2E] font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#6B4E2E] italic">
                    Không tìm thấy nhà cung cấp nào 🚚
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-t border-[#E6D6B8] hover:bg-[#F9F6EC] transition"
                  >
                    <td className="px-4 py-3 text-[#6B4E2E] font-medium">
                      {supplier.name}
                    </td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{supplier.phone}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{supplier.email}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{supplier.address}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(supplier)}
                          className="p-2 bg-[#D1B892] text-[#6B4E2E] rounded-lg hover:bg-[#C0A57A] transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-[#6B4E2E] mb-4">
              {editingSupplier ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
            </h3>

            <div className="space-y-4">
              {(
                [
                  ["Tên nhà cung cấp *", "name"],
                  ["Số điện thoại *", "phone"],
                  ["Email", "email"],
                  ["Địa chỉ", "address"],
                ] as const
              ).map(([label, field]) => (
                <div key={field}>
                  <label className="block text-[#6B4E2E] mb-1 font-medium">{label}</label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={`Nhập ${label.toLowerCase()}`}
                    className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#B18F7C] text-white px-4 py-2 rounded-lg hover:bg-[#8B6F5C] transition font-semibold"
              >
                {editingSupplier ? "Cập nhật" : "Thêm mới"}
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
