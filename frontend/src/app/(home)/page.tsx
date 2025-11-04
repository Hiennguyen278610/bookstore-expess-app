"use client";

import BannerSlider from "./components/Homepage/Banner";
import CategorySidebar from "./components/Homepage/CategorySidebar";

export default function HomePage() {
  return (
    <div className="w-full max-w-[1200px] p-2 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1">
        <CategorySidebar />
        <BannerSlider />
      </div>
    </div>
  );
}
