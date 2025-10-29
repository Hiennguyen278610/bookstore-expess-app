"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-1 items-center justify-center ">
        <div className="w-full max-w-xl px-8 py-10 rounded-2xl text-center">
          <h1 className="text-3xl font-mono mb-4 font-bold">Trang chủ</h1>

          {/* 👇 Nút đi đến trang Admin */}
          <Link
            href="/admin"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            Đi tới trang Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
