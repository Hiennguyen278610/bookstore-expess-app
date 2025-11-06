"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { users as fakeUsers } from "../fakedata";
import type { User } from "@/types/user.type";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(fakeUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
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
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Người dùng</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition"
        >
          <Plus className="w-4 h-4" /> Thêm người dùng
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        <div className="flex gap-4 mb-4">
          <input
            placeholder="Tìm theo tên, username hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#D1B892] bg-white px-3 py-2 rounded-md w-1/2 text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-[#D1B892] bg-white px-3 py-2 rounded-md w-1/2 text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md shadow-sm border border-[#E6D6B8] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#D1B892]">
              <tr>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Họ tên</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Username</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Mật khẩu</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Điện thoại</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Vai trò</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Giới tính</th>
                <th className="px-4 py-3 text-center text-[#6B4E2E] font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#6B4E2E] italic">
                    Không tìm thấy người dùng nào 👥
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-[#E6D6B8] hover:bg-[#F9F6EC] transition">
                    <td className="px-4 py-3 text-[#6B4E2E]">{user.fullName}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{user.username}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showPassword[user.id] ? user.password : "••••••••"}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-[#B18F7C] hover:text-[#8B6F5C] transition"
                        >
                          {showPassword[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{user.phone}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{user.email}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{user.role}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">
                      {user.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                    </td>
                    <td className="px-4 py-3 text-[#6B4E2E]">
                      {user.gender === "male"
                        ? "Nam"
                        : user.gender === "female"
                        ? "Nữ"
                        : "Khác"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="p-2 bg-[#D1B892] text-[#6B4E2E] rounded-lg hover:bg-[#C0A57A] transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-[#6B4E2E] mb-4">
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
                  <label className="block text-[#6B4E2E] mb-1 font-medium">{label}</label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                  />
                </div>
              ))}

              {/* Vai trò */}
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as User["role"] })
                  }
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Trạng thái *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Giới tính *</label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value || null,
                    })
                  }
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                >
                  <option value="">Chưa chọn</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#B18F7C] text-white px-4 py-2 rounded-lg hover:bg-[#8B6F5C] transition font-semibold"
                >
                  {editingUser ? "Cập nhật" : "Thêm mới"}
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
        </div>
      )}
    </div>
  );
}
