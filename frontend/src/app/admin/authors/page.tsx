"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import type { Author } from "@/types/author.type";
import Pagination from "../components/Pagination";
import { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } from "@/api/authorApi";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<{ name: string }>({ name: "" });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch authors from API
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await getAllAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
      alert("Lỗi khi tải danh sách tác giả!");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng nhập tên tác giả!',
      });
      return;
    }

    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor._id, { name: formData.name.trim() });
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật tác giả thành công!',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createAuthor({ name: formData.name.trim() });
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm tác giả thành công!',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      await fetchAuthors();
      resetForm();
    } catch (error) {
      console.error("Error saving author:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Không thể lưu tác giả',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa tác giả',
      html: `Bạn có chắc muốn xóa "<strong>${name}</strong>"?<br/><small class="text-red-500">⚠️ Hành động này không thể hoàn tác!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteAuthor(id);
        toast.success('Xóa tác giả thành công!', {
          position: 'bottom-right',
          duration: 3000,
          style: {
            fontSize: '15px',
            padding: '16px',
          },
        });
        await fetchAuthors();
      } catch (error) {
        console.error("Error deleting author:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.response?.data?.message || 'Lỗi khi xóa tác giả!',
        });
      }
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : paginatedAuthors.length === 0 ? (
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
                      key={a._id}
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
                            onClick={() => handleDelete(a._id, a.name)}
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
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md transform transition-all animate-slideUp border border-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
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