"use client"
import BannerSlider from "./components/Banner";
import CategorySidebar from "./components/CategorySidebar";
import BrandCarousel from "./components/BrandCarousel";
import BookShowCase from '@/app/(home)/components/BookShowCase';
import BookNewest from '@/app/(home)/components/BookNewest';
import { getAllTop10BestSellingBooks, getAllTop10NewestBooks } from '@/hooks/useBook';

export default function HomePage() {

  const { bestSelling, isLoading: Selling } = getAllTop10BestSellingBooks()
  const { newest, isLoading: Newest } = getAllTop10NewestBooks()

  if (Selling || Newest) return <div className="text-center py-4 text-sm text-gray-500">Đang tải thông tin sách...</div>;

  return (
    <div className="w-full max-w-[1200px] p-2 mt-4 mx-auto">

      {/* KHU VỰC TRÊN: Sidebar và Banner nằm ngang */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1 mb-8">
        <CategorySidebar />
        <BannerSlider />
      </div>

      {/* KHU VỰC DƯỚI: Các section sách nằm dọc (Full width) */}
      <div className="flex flex-col gap-8">
        <BookShowCase title={"Sách bán chạy"} books={bestSelling} />
        <BookNewest title={"Sách mới nhất"} books={newest} />
      </div>

      <BrandCarousel />
    </div>
  );
}