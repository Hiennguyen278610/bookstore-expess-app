"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { authors as fakeAuthors } from "../fakedata";
import type { Author } from "@/types/author.type";
import Pagination from "../components/Pagination";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>(fakeAuthors);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<{ name: string }>({ name: "" });

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
  const paginatedAuthors = filteredAuthors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 text-2xl font-bold">Quản lý tác giả</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý thông tin tác giả trong cửa hàng</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> Thêm tác giả
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <input
                placeholder="Nhập tên tác giả cần tìm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 bg-white px-4 py-2.5 pl-10 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">
                    Tên tác giả
                  </th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAuthors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      Không tìm thấy tác giả nào ✍️
                    </td>
                  </tr>
                ) : (
                  paginatedAuthors.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-4 py-4 text-gray-800 font-medium">
                        {a.name}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(a)}
                            className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAuthors.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b-2 border-emerald-600">
              {editingAuthor ? "Sửa thông tin tác giả" : "Thêm tác giả mới"}
            </h3>
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Tên tác giả *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nhập tên tác giả..."
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {editingAuthor ? "Cập nhật" : "Thêm mới"}
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