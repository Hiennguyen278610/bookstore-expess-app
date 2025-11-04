
import { Book, LineChart, ClipboardCheck, FileText, Music, Baby, Languages, Globe, LucideIcon } from "lucide-react";

export interface Category {
  label: string;
  image: string;
  icon: LucideIcon;
  slug?: string;
}

export const categories: Category[] = [
  { 
    label: "Văn Học", 
    image: "/images/banners/cat_card_3.webp", 
    icon: Book,
    slug: "van-hoc"
  },
  { 
    label: "Kinh Tế", 
    image: "/images/banners/cat_card_4.webp", 
    icon: LineChart 
  },
  { 
    label: "Kĩ Năng Sống", 
    image: "/images/banners/cat_card_5.webp", 
    icon: ClipboardCheck 
  },
  {
    label: "Lịch Sử, Văn Hóa, Xã Hội",
    image: "/images/banners/cat_card_6.webp",
    icon: FileText
  },
  { 
    label: "Sách Truyện Thiếu Nhi", 
    image: "/images/banners/cat_card_7.webp", 
    icon: Music 
  },
  { 
    label: "Nuôi Dạy Con", 
    image: "/images/banners/cat_card_8.jpg", 
    icon: Baby 
  },
  { 
    label: "Sách Học Ngoại Ngữ", 
    image: "/images/banners/cat_card_9.webp", 
    icon: Languages 
  },
  { 
    label: "Sách Ngoại Văn", 
    image: "/images/banners/cat_card_2.webp", 
    icon: Globe 
  },
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
  id: string,
  name: string;
  price: number;
  imgSrc: string;
}


export const brandLogos = [
  "/images/brands/brand_01.webp",
  "/images/brands/brand_02.webp",
  "/images/brands/brand_03.webp",
  "/images/brands/brand_04.webp",
  "/images/brands/brand_05.webp",
  "/images/brands/brand_06.webp",
  "/images/brands/brand_07.webp",
]

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imgSrc: string;
}

export const testCardBooks = [
  {
    id: "1",
    name: "Sách Bán Chạy 1",
    price: 99000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "2",
    name: "Sách Bán Chạy 2",
    price: 120000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "3",
    name: "Sách Bán Chạy 3",
    price: 85000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "4",
    name: "Sách Bán Chạy 4",
    price: 105000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "5",
    name: "Sách Bán Chạy 5",
    price: 99000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "6",
    name: "Sách Bán Chạy 6",
    price: 113000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "7",
    name: "Sách Bán Chạy 7",
    price: 89000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "8",
    name: "Sách Bán Chạy 8",
    price: 135000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "9",
    name: "Sách Bán Chạy 9",
    price: 76000,
    imgSrc: "/images/test1.webp",
  },
  {
    id: "10",
    name: "Sách Bán Chạy 10",
    price: 149000,
    imgSrc: "/images/test1.webp",
  },
];

export const products: ProductCardProps[] = [
  // Under 50k
  {
    id: "11",
    name: "Truyện Tranh Thiếu Nhi",
    price: 45000,
    imgSrc: "/images/test1.webp",
  },
  { 
    id: "12", 
    name: "Sách Tô Màu Cho Bé", 
    price: 35000, 
    imgSrc: "/images/test1.webp" 
  },
  { 
    id: "13", 
    name: "Truyện Cổ Tích Ngắn 12 32 12312312312312332321424124123123123", 
    price: 42000, 
    imgSrc: "/images/test1.webp" 
  },

  // 50k-100k
  { 
    id: "14", 
    name: "Kỹ Năng Sống Cơ Bản", 
    price: 75000, 
    imgSrc: "/images/test1.webp" 
  },
  { 
    id: "15", 
    name: "Tiểu Thuyết Ngắn", 
    price: 68000, 
    imgSrc: "/images/test1.webp" 
  },
  { 
    id: "16", 
    name: "Sách Học Tiếng Anh", 
    price: 89000, 
    imgSrc: "/images/test1.webp" 
  },
  { 
    id: "17", 
    name: "Văn Học Việt Nam", 
    price: 92000, 
    imgSrc: "/images/test1.webp" 
  },

  // 100k-150k
  { 
    id: "18", 
    name: "Kinh Tế Ứng Dụng", 
    price: 125000, 
    imgSrc: "/images/test1.webp" 
  },
  {
    id: "19",
    name: "Sách Phát Triển Bản Thân",
    price: 118000,
    imgSrc: "/images/test1.webp",
  },
  { 
    id: "20", 
    name: "Lịch Sử Thế Giới", 
    price: 135000, 
    imgSrc: "/images/test1.webp" 
  },
  {
    id: "21",
    name: "Nuôi Dạy Con Hiện Đại",
    price: 142000,
    imgSrc: "/images/test1.webp",
  },
  { 
    id: "22", 
    name: "Tiếng Trung Cơ Bản", 
    price: 128000, 
    imgSrc: "/images/test1.webp" 
  },

  // 150k-200k
  { 
    id: "23", 
    name: "Sách Chuyên Ngành IT", 
    price: 178000, 
    imgSrc: "/images/test1.webp" 
  },
  { 
    id: "24", 
    name: "Tâm Lý Học Ứng Dụng", 
    price: 165000, 
    imgSrc: "/images/test1.webp" 
  },
  {
    id: "25",
    name: "Sách Y Học Thường Thức",
    price: 192000,
    imgSrc: "/images/test1.webp",
  },
  { 
    id: "26", 
    name: "Kinh Doanh Quốc Tế", 
    price: 185000, 
    imgSrc: "/images/test1.webp" 
  },

  // Over 200k
  { 
    id: "27", 
    name: "Bộ Sách Chuyên Sâu", 
    price: 256000, 
    imgSrc: "/images/test1.webp" 
  },
  {
    id: "28",
    name: "Sách Ngoại Văn Original",
    price: 289000,
    imgSrc: "/images/test1.webp",
  },
  { 
    id: "29", 
    name: "Bách Khoa Toàn Thư", 
    price: 320000, 
    imgSrc: "/images/test1.webp" 
  },
  { 
    id: "30", 
    name: "Sách Limited Edition", 
    price: 450000, 
    imgSrc: "/images/test1.webp" 
  },
];