"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { authors as fakeAuthors } from "../fakedata";
import type { Author } from "@/types/author.type";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>(fakeAuthors);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<{ name: string }>({ name: "" });

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (author: Author | null = null) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({ name: author.name });
    } else {
      setEditingAuthor(null);
      setFormData({ name: "" });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingAuthor(null);
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên tác giả!");
      return;
    }

    if (editingAuthor) {
      setAuthors((prev) =>
        prev.map((a) =>
          a.id === editingAuthor.id ? { ...a, name: formData.name } : a
        )
      );
    } else {
      const newAuthor: Author = {
        id: `a${Date.now()}`,
        name: formData.name.trim(),
      };
      setAuthors((prev) => [...prev, newAuthor]);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa tác giả này?")) {
      setAuthors((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Tác giả</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition"
        >
          <Plus className="w-4 h-4" /> Thêm tác giả
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        <div className="flex gap-4 mb-4">
          <div className="relative w-full">
            <input
              placeholder="Nhập tên tác giả cần tìm..."
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
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">
                  Tên tác giả
                </th>
                <th className="px-4 py-3 text-center text-[#6B4E2E] font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-[#6B4E2E] italic"
                  >
                    Không tìm thấy tác giả nào ✍️
                  </td>
                </tr>
              ) : (
                filteredAuthors.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-[#E6D6B8] hover:bg-[#F9F6EC] transition"
                  >
                    <td className="px-4 py-3 text-[#6B4E2E] font-medium">
                      {a.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(a)}
                          className="p-2 bg-[#D1B892] text-[#6B4E2E] rounded-lg hover:bg-[#C0A57A] transition"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Xóa"
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
              {editingAuthor ? "Sửa tác giả" : "Thêm tác giả mới"}
            </h3>
            <div>
              <label className="block text-[#6B4E2E] mb-1 font-medium">
                Tên tác giả *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nhập tên tác giả..."
                className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
              />
            </div>
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#B18F7C] text-white px-4 py-2 rounded-lg hover:bg-[#8B6F5C] transition font-semibold"
              >
                {editingAuthor ? "Cập nhật" : "Thêm mới"}
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
