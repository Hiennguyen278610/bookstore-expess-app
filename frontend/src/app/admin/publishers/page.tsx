"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { Publisher } from "@/types/publisher.type";
import Pagination from "../components/Pagination";
import { getAllPublishers, createPublisher, updatePublisher, deletePublisher } from "@/api/publisherApi";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [formData, setFormData] = useState<{ name: string }>({ name: "" });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch publishers from API
  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const data = await getAllPublishers();
      setPublishers(data);
    } catch (error) {
      console.error("Error fetching publishers:", error);
      alert("Lỗi khi tải danh sách nhà xuất bản!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo tên
  const filteredPublishers = publishers.filter((pub) =>
    pub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
  const paginatedPublishers = filteredPublishers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mở modal thêm/sửa
  const openModal = (publisher: Publisher | null = null) => {
    if (publisher) {
      setEditingPublisher(publisher);
      setFormData({ name: publisher.name });
    } else {
      setEditingPublisher(null);
      setFormData({ name: "" });
    }
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "" });
    setEditingPublisher(null);
    setShowModal(false);
  };

  // Lưu form
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên nhà xuất bản!");
      return;
    }

    try {
      if (editingPublisher) {
        console.log("Updating publisher with ID:", editingPublisher._id);
        console.log("Data:", { name: formData.name.trim() });
        await updatePublisher(editingPublisher._id, { name: formData.name.trim() });
        alert('Cập nhật nhà xuất bản thành công!');
      } else {
        await createPublisher({ name: formData.name.trim() });
        alert('Thêm nhà xuất bản thành công!');
      }
      await fetchPublishers();
      resetForm();
    } catch (error) {
      console.error("Error saving publisher:", error);
      console.error("Error response:", error.response?.data);
      alert(`Lỗi: ${error.response?.data?.message || 'Không thể lưu nhà xuất bản'}`);
    }
  };

  // Xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà xuất bản này?")) {
      try {
        await deletePublisher(id);
        alert('Xóa nhà xuất bản thành công!');
        await fetchPublishers();
      } catch (error) {
        console.error("Error deleting publisher:", error);
        console.error("Error response:", error.response?.data);
        alert(`Lỗi: ${error.response?.data?.message || 'Không thể xóa nhà xuất bản'}`);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 text-2xl font-bold">Quản lý nhà xuất bản</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý thông tin nhà xuất bản</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> Thêm nhà xuất bản
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <input
                placeholder="Nhập tên nhà xuất bản cần tìm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 bg-white px-4 py-2.5 pl-10 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">
                    Tên nhà xuất bản
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
                ) : paginatedPublishers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      Không tìm thấy nhà xuất bản nào 🏢
                    </td>
                  </tr>
                ) : (
                  paginatedPublishers.map((pub) => (
                    <tr
                      key={pub._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-4 py-4 text-gray-800 font-medium">
                        {pub.name}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(pub)}
                            className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pub._id)}
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
            totalItems={filteredPublishers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b-2 border-emerald-600">
              {editingPublisher ? "Sửa nhà xuất bản" : "Thêm nhà xuất bản mới"}
            </h3>
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Tên nhà xuất bản *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nhập tên nhà xuất bản..."
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {editingPublisher ? "Cập nhật" : "Thêm mới"}
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