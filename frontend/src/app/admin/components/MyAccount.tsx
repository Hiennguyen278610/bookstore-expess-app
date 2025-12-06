"use client";
import { X, User, Mail, Phone, Shield, Circle } from "lucide-react";
import { users } from "../fakedata";

interface MyAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyAccount({ isOpen, onClose }: MyAccountProps) {
  if (!isOpen) return null;

  // Get admin user from fakedata
  const user = users.find(u => u.role === "admin") || users[0];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-white/30"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
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
          <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white capitalize">
              {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
            </span>
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${user.status === "active" ? "bg-green-500/30 text-green-100" : "bg-red-500/30 text-red-100"}`}>
              <Circle className={`w-2 h-2 ${user.status === "active" ? "fill-green-300" : "fill-red-300"}`} />
              {user.status === "active" ? "Hoạt động" : "Ngừng"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Tên đăng nhập</p>
              <p className="text-gray-800 font-medium">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="text-gray-800 font-medium">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Giới tính</p>
              <p className="text-gray-800 font-medium capitalize">
                {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
