"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { users as fakeUsers } from "../fakedata";
import Pagination from "../components/Pagination";
import type { User } from "@/types/user.type";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(fakeUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Omit<User, "id">>({
    fullName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    role: "customer",
    status: "active",
    online: false,
    gender: null,
  });

  // Lọc user
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Submit form
  const handleSubmit = () => {
    if (
      !formData.fullName ||
      !formData.username ||
      !formData.password ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        ...formData,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const openModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        username: user.username,
        password: user.password,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status || "active",
        online: user.online || false,
        gender: user.gender || null,
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        role: "customer",
        status: "active",
        online: false,
        gender: null,
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      username: "",
      password: "",
      phone: "",
      email: "",
      role: "customer",
      status: "active",
      online: false,
      gender: null,
    });
    setShowModal(false);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 text-2xl font-bold">Quản lý người dùng</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý thông tin tài khoản người dùng</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> Thêm người dùng
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              placeholder="Tìm theo tên, username hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="customer">Khách hàng</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Họ tên</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Username</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Mật khẩu</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Điện thoại</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Email</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Vai trò</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Giới tính</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                      Không tìm thấy người dùng nào 👥
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-4 text-gray-800 font-medium">{user.fullName}</td>
                      <td className="px-4 py-4 text-gray-600">{user.username}</td>
                      <td className="px-4 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showPassword[user.id] ? user.password : "••••••••"}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-gray-400 hover:text-teal-600 transition"
                          >
                            {showPassword[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{user.phone}</td>
                      <td className="px-4 py-4 text-gray-600">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {user.role === "admin" ? "Admin" : "Khách hàng"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active" 
                            ? "bg-teal-50 text-teal-700 border border-teal-200" 
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {user.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {user.gender === "male"
                          ? "Nam"
                          : user.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(user)}
                            className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b-2 border-emerald-600">
              {editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
            </h3>

            <div className="space-y-4">
              {(
                [
                  ["Họ tên *", "fullName"],
                  ["Username *", "username"],
                  ["Mật khẩu *", "password"],
                  ["Số điện thoại *", "phone"],
                  ["Email *", "email"],
                ] as const
              ).map(([label, field]) => (
                <div key={field}>
                  <label className="block text-gray-700 mb-2 font-medium text-sm">{label}</label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              ))}

              {/* Vai trò */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as User["role"] })
                  }
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Trạng thái *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Giới tính *</label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value || null,
                    })
                  }
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Chưa chọn</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  {editingUser ? "Cập nhật" : "Thêm mới"}
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
        </div>
      )}
    </div>
  );
}