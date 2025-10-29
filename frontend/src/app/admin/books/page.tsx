"use client";
import { Plus } from "lucide-react";

export default function BooksPage() {
  return (
    <div className="p-4">

      {/* Header */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Tất cả sách</h2>
        <button className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition">
          <Plus className="w-4 h-4" /> Thêm sách
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        <div className="flex gap-4 mb-4">
          <input
            placeholder="Nhập tên sách cần tìm ..."
            className="border border-[#D1B892] bg-white px-3 py-2 rounded-md w-1/2 text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
          />
          <select className="border border-[#D1B892] bg-white px-3 py-2 rounded-md w-1/2 text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]">
            <option>Chọn thể loại</option>
            <option>Tiểu thuyết</option>
            <option>Khoa học</option>
            <option>Thiếu nhi</option>
          </select>
        </div>

        {/* Table hoặc danh sách sách */}
        <div className="bg-white rounded-md p-4 shadow-sm border border-[#E6D6B8]">
          <p className="text-[#6B4E2E] italic text-center">
            Danh sách sách sẽ hiển thị tại đây 📚
          </p>
        </div>
      </div>
    </div>
  );
}
