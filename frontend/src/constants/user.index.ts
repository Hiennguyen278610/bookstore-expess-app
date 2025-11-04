
import {
  BookOpen,
  BookMarked,
  Book,
  LineChart,
  ClipboardCheck,
  FileText,
  Music,
  Baby,
  Languages,
  Globe,
} from "lucide-react";

export const categories = [
  { icon: BookOpen, label: "Sách Bán Chạy" },
  { icon: BookMarked, label: "Sách Mới Về" },
  { icon: Book, label: "Văn Học" },
  { icon: LineChart, label: "Kinh Tế" },
  { icon: ClipboardCheck, label: "Kĩ Năng Sống" },
  { icon: FileText, label: "Lịch Sử, Văn Hóa, Xã Hội" },
  { icon: Music, label: "Sách Truyện Thiếu Nhi" },
  { icon: Baby, label: "Nuôi Dạy Con" },
  { icon: Languages, label: "Sách Học Ngoại Ngữ" },
  { icon: Globe, label: "Sách Ngoại Văn" },
];

export const bannerImages = [
  "/images/banners/slider_1.webp",
  "/images/banners/slider_2.webp",
  "/images/banners/slider_3.webp",
];

export const smallBanners = [
  "/images/banners/sub_banner_1.webp",
  "/images/banners/sub_banner_2.webp",
  "/images/banners/sub_banner_3.webp",
];

export interface ProductCardProps {
  name: string;
  price: number;
  imgSrc: string;
}

export const testCardBooks= [
  {
    name: "Sách Bán Chạy 1",
    price: 99000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 2",
    price: 120000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 3",
    price: 85000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 4",
    price: 105000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 5",
    price: 99000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 6",
    price: 113000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 7",
    price: 89000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 8",
    price: 135000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 9",
    price: 76000,
    imgSrc: "/images/test1.webp",
  },
  {
    name: "Sách Bán Chạy 10",
    price: 149000,
    imgSrc: "/images/test1.webp",
  },
];

export const brandLogos = [
  "/images/brands/brand_01.webp",
  "/images/brands/brand_02.webp",
  "/images/brands/brand_03.webp",
  "/images/brands/brand_04.webp",
  "/images/brands/brand_05.webp",
  "/images/brands/brand_06.webp",
  "/images/brands/brand_07.webp",
]