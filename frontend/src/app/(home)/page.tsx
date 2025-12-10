
import { testCardBooks } from "@/constants/user.index";
import BannerSlider from "./components/Banner";
import BookShowCase from "./components/BookShowCase";
import CategorySidebar from "./components/CategorySidebar";
import BrandCarousel from "./components/BrandCarousel";

export default function HomePage() {
  return (
    <div className="w-full max-w-[1200px] p-2 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1">
        <CategorySidebar />
        <BannerSlider />
      </div>
      <BrandCarousel />
    </div>
  );
}
