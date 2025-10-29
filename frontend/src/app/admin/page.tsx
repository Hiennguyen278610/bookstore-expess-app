"use client";

export default function AdminDashboard() {
  return (
    <div className="bg-[#F9F6EC] rounded-md shadow p-5 ">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Dashboard — Thống kê hệ thống
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="text-lg font-semibold">Sách</h3>
          <p className="text-2xl font-bold text-blue-700">256</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold">Người dùng</h3>
          <p className="text-2xl font-bold text-green-700">1,024</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="text-lg font-semibold">Đơn hàng</h3>
          <p className="text-2xl font-bold text-yellow-700">73</p>
        </div>
      </div>
    </div>
  );
}
