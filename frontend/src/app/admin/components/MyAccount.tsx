"use client";
import { useState } from "react";
import { X, User, Shield, Pencil, Eye, EyeOff, Save } from "lucide-react";
import { users } from "../fakedata";
import type { User as UserType } from "@/types/user.type";

interface MyAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyAccount({ isOpen, onClose }: MyAccountProps) {
  // Get admin user from fakedata
  const adminUser = users.find(u => u.role === "ADMIN") || users[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Omit<UserType, "id" | "role">>({
    fullName: adminUser.fullName,
    username: adminUser.username,
    password: adminUser.password,
  });
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    // Cập nhật thông tin vào fakedata (trong thực tế sẽ gọi API)
    const userIndex = users.findIndex(u => u.id === adminUser.id);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
      };
    }
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleCancel = () => {
    setFormData({
      fullName: adminUser.fullName,
      username: adminUser.username,
      password: adminUser.password,
    });
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-white/30"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isEditing ? formData.fullName : adminUser.fullName}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
              {adminUser.role === "ADMIN" ? "Quản trị viên" : "User"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {savedMessage && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm text-center border border-emerald-200">
              ✓ Đã lưu thay đổi thành công!
            </div>
          )}

          {/* Họ tên */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-gray-500">Họ tên</p>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              />
            ) : (
              <p className="text-gray-800 font-medium">{adminUser.fullName}</p>
            )}
          </div>

          {/* Tên đăng nhập */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-gray-500">Tên đăng nhập</p>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              />
            ) : (
              <p className="text-gray-800 font-medium">{adminUser.username}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-gray-500">Mật khẩu</p>
            </div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-500 hover:text-emerald-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <p className="text-gray-800 font-medium font-mono">••••••••</p>
            )}
          </div>

          {/* Vai trò (không chỉnh sửa được) */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-gray-500">Vai trò</p>
            </div>
            <p className="text-gray-800 font-medium">
              {adminUser.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
