"use client";

import { testCardBooks } from "@/constants/user.index";
import BannerSlider from "./components/Homepage/Banner";
import BookShowCase from "./components/Homepage/BookShowCase";
import CategoryCarousel from "./components/Homepage/CategoryCarousel";
import CategorySidebar from "./components/Homepage/CategorySidebar";
import BrandCarousel from "./components/Homepage/BrandCarousel";

export default function HomePage() {
  return (
    <div className="w-full max-w-[1200px] p-2 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1">
        <CategorySidebar />
        <BannerSlider />
      </div>
      <CategoryCarousel />
      <BookShowCase 
        title="Sách Bán Chạy"
        books={testCardBooks}
      />
      <BookShowCase 
        title="Sách mới"
        books={testCardBooks}
      />
      <BrandCarousel />
    </div>
  );
}
