import type { User } from "@/types/user.type";
import type { SupplyReceipt } from "@/types/supplyreceipt.type";
import type { Order } from "@/types/order.type";
import type { Category } from "@/types/category.type";
export const categories: Category[] = [
  { _id: "c1", name: "Kinh tế", slug: "kinh-te" },
  { _id: "c2", name: "Lập trình", slug: "lap-trinh" },
  { _id: "c3", name: "Văn học", slug: "van-hoc" },
  { _id: "c4", name: "Thiếu nhi", slug: "thieu-nhi" },
  { _id: "c5", name: "Khoa học", slug: "khoa-hoc" },
  { _id: "c6", name: "Tâm lý", slug: "tam-ly" },
  { _id: "c7", name: "Lịch sử", slug: "lich-su" },
  { _id: "c8", name: "Ngoại ngữ", slug: "ngoai-ngu" },
  { _id: "c9", name: "Kỹ năng sống", slug: "ky-nang-song" },
  { _id: "c10", name: "Giáo khoa", slug: "giao-khoa" },
  { _id: "c11", name: "Tiểu thuyết", slug: "tieu-thuyet" },
  { _id: "c12", name: "Truyện tranh", slug: "truyen-tranh" },
  { _id: "c13", name: "Sức khỏe", slug: "suc-khoe" },
  { _id: "c14", name: "Nghệ thuật", slug: "nghe-thuat" },
  { _id: "c15", name: "Du lịch", slug: "du-lich" }
];

export const authors = [
  { id: "a1", name: "Nguyễn Nhật Ánh" },
  { id: "a2", name: "Robert C. Martin" },
  { id: "a3", name: "Harper Lee" },
  { id: "a4", name: "Đỗ Phủ" },
  { id: "a5", name: "Martin Fowler" },
  { id: "a6", name: "Paulo Coelho" },
  { id: "a7", name: "Tô Hoài" },
  { id: "a8", name: "Dale Carnegie" },
  { id: "a9", name: "Nguyễn Du" },
  { id: "a10", name: "J.K. Rowling" },
  { id: "a11", name: "Haruki Murakami" },
  { id: "a12", name: "Nguyễn Ngọc Tư" },
  { id: "a13", name: "Stephen King" },
  { id: "a14", name: "Yuval Noah Harari" },
  { id: "a15", name: "Nguyễn Phong Việt" }
];

export const publishers = [
  { id: "p1", name: "NXB Trẻ" },
  { id: "p2", name: "NXB Thời Đại" },
  { id: "p3", name: "O'Reilly" },
  { id: "p4", name: "NXB Kim Đồng" },
  { id: "p5", name: "NXB Văn Học" },
  { id: "p6", name: "NXB Giáo Dục" },
  { id: "p7", name: "NXB Tổng Hợp TP.HCM" },
  { id: "p8", name: "NXB Hội Nhà Văn" },
  { id: "p9", name: "Nhã Nam" },
  { id: "p10", name: "Alpha Books" },
  { id: "p11", name: "NXB Lao Động" },
  { id: "p12", name: "NXB Phụ Nữ" },
  { id: "p13", name: "First News" },
  { id: "p14", name: "Thái Hà Books" },
  { id: "p15", name: "NXB Đà Nẵng" }
];

export const books = [
  {
    id: "b1",
    name: "Dế Mèn Phiêu Lưu Ký",
    category_id: "c3",
    publisher_id: "p1",
    author_ids: ["a1"],
    imageUrl: "/images/books/de_me_plk.jpg",
    quantity: 25,
    price: 95000
  },
  {
    id: "b2",
    name: "Clean Code",
    category_id: "c2",
    publisher_id: "p3",
    author_ids: ["a2", "a5"],
    imageUrl: "/images/books/clean_code.jpg",
    quantity: 10,
    price: 350000
  },
  {
    id: "b3",
    name: "To Kill a Mockingbird",
    category_id: "c3",
    publisher_id: "p2",
    author_ids: ["a3"],
    imageUrl: "/images/books/To_Kill_a_Mockingbird.jpg",
    quantity: 5,
    price: 120000
  },
  {
    id: "b4",
    name: "Refactoring",
    category_id: "c2",
    publisher_id: "p3",
    author_ids: ["a5"],
    imageUrl: "/images/books/refactoring.jpg",
    quantity: 8,
    price: 420000
  },
  {
    id: "b5",
    name: "Kinh tế học căn bản",
    category_id: "c1",
    publisher_id: "p2",
    author_ids: ["a4"],
    imageUrl: "/images/books/kinh_te_hoc.jpg",
    quantity: 15,
    price: 150000
  },
  {
    id: "b6",
    name: "Truyện cổ tích cho bé",
    category_id: "c4",
    publisher_id: "p1",
    author_ids: ["a1"],
    imageUrl: "/images/books/truyen_co_tich.jpg",
    quantity: 40,
    price: 60000
  },
  {
    id: "b7",
    name: "Nhà Giả Kim",
    category_id: "c11",
    publisher_id: "p9",
    author_ids: ["a6"],
    imageUrl: "/images/books/nha_gia_kim.jpg",
    quantity: 30,
    price: 85000
  },
  {
    id: "b8",
    name: "Đắc Nhân Tâm",
    category_id: "c9",
    publisher_id: "p13",
    author_ids: ["a8"],
    imageUrl: "/images/books/dac_nhan_tam.jpg",
    quantity: 50,
    price: 110000
  },
  {
    id: "b9",
    name: "Truyện Kiều",
    category_id: "c3",
    publisher_id: "p5",
    author_ids: ["a9"],
    imageUrl: "/images/books/truyen_kieu.jpg",
    quantity: 20,
    price: 75000
  },
  {
    id: "b10",
    name: "Harry Potter và Hòn đá Phù thủy",
    category_id: "c4",
    publisher_id: "p4",
    author_ids: ["a10"],
    imageUrl: "/images/books/harry_potter.jpg",
    quantity: 35,
    price: 180000
  },
  {
    id: "b11",
    name: "Rừng Na-uy",
    category_id: "c11",
    publisher_id: "p9",
    author_ids: ["a11"],
    imageUrl: "/images/books/rung_nauy.jpg",
    quantity: 18,
    price: 125000
  },
  {
    id: "b12",
    name: "Cánh đồng bất tận",
    category_id: "c3",
    publisher_id: "p1",
    author_ids: ["a12"],
    imageUrl: "/images/books/canh_dong_bat_tan.jpg",
    quantity: 22,
    price: 95000
  },
  {
    id: "b13",
    name: "IT",
    category_id: "c11",
    publisher_id: "p2",
    author_ids: ["a13"],
    imageUrl: "/images/books/it_stephen_king.jpg",
    quantity: 12,
    price: 250000
  },
  {
    id: "b14",
    name: "Sapiens: Lược sử loài người",
    category_id: "c7",
    publisher_id: "p10",
    author_ids: ["a14"],
    imageUrl: "/images/books/sapiens.jpg",
    quantity: 28,
    price: 220000
  },
  {
    id: "b15",
    name: "Đi qua thương nhớ",
    category_id: "c3",
    publisher_id: "p1",
    author_ids: ["a15"],
    imageUrl: "/images/books/di_qua_thuong_nho.jpg",
    quantity: 45,
    price: 89000
  }
];

export const bookAuthors = [
  { book_id: "b1", author_id: "a1" },
  { book_id: "b2", author_id: "a2" },
  { book_id: "b3", author_id: "a3" },
  { book_id: "b4", author_id: "a5" },
  { book_id: "b5", author_id: "a4" },
  { book_id: "b6", author_id: "a1" },
  { book_id: "b7", author_id: "a6" },
  { book_id: "b8", author_id: "a8" },
  { book_id: "b9", author_id: "a9" },
  { book_id: "b10", author_id: "a10" },
  { book_id: "b11", author_id: "a11" },
  { book_id: "b12", author_id: "a12" },
  { book_id: "b13", author_id: "a13" },
  { book_id: "b14", author_id: "a14" },
  { book_id: "b15", author_id: "a15" }
];

export const suppliers = [
  { id: "s1", name: "Công ty Sách A", phone: "0281234567", email: "supA@books.com", address: "HCM" },
  { id: "s2", name: "Nhà phân phối B", phone: "0287654321", email: "supB@books.com", address: "HN" },
  { id: "s3", name: "Công ty TNHH Văn hóa C", phone: "0283456789", email: "supC@books.com", address: "Đà Nẵng" },
  { id: "s4", name: "Nhà sách Phương Nam", phone: "0284567890", email: "phuongnam@books.com", address: "HCM" },
  { id: "s5", name: "Công ty Fahasa", phone: "0285678901", email: "fahasa@books.com", address: "HCM" },
  { id: "s6", name: "Nhà phân phối Minh Long", phone: "0286789012", email: "minhlong@books.com", address: "HN" },
  { id: "s7", name: "Công ty Sách Thành Nghĩa", phone: "0287890123", email: "thanhnghia@books.com", address: "Cần Thơ" },
  { id: "s8", name: "Nhà sách Tiến Thọ", phone: "0288901234", email: "tientho@books.com", address: "Hải Phòng" },
  { id: "s9", name: "Công ty Văn Lang", phone: "0289012345", email: "vanlang@books.com", address: "HCM" },
  { id: "s10", name: "Nhà phân phối Đông A", phone: "0280123456", email: "donga@books.com", address: "HN" },
  { id: "s11", name: "Công ty Sách Việt", phone: "0281111111", email: "sachviet@books.com", address: "Huế" },
  { id: "s12", name: "Nhà sách Trí Tuệ", phone: "0282222222", email: "tritue@books.com", address: "Nha Trang" },
  { id: "s13", name: "Công ty Phát hành Sách Sài Gòn", phone: "0283333333", email: "saigonbook@books.com", address: "HCM" },
  { id: "s14", name: "Nhà phân phối Bách Khoa", phone: "0284444444", email: "bachkhoa@books.com", address: "HN" },
  { id: "s15", name: "Công ty Sách Tương Lai", phone: "0285555555", email: "tuonglai@books.com", address: "Bình Dương" }
];

export const supplyReceipts: SupplyReceipt[] = [
  {
    id: "r1",
    supplier_id: "s1",
    admin_id: "u1",
    supply_date: "2025-03-20",
    supply_status: "completed",
    items: [
      { book_id: "b2", import_price: 250000, quantity: 10, sub_amount: 2500000 },
      { book_id: "b4", import_price: 300000, quantity: 5, sub_amount: 1500000 }
    ],
    total_amount: 4000000
  },
  {
    id: "r2",
    supplier_id: "s2",
    admin_id: "u1",
    supply_date: "2025-04-01",
    supply_status: "completed",
    items: [{ book_id: "b6", import_price: 30000, quantity: 100, sub_amount: 3000000 }],
    total_amount: 3000000
  },
  {
    id: "r3",
    supplier_id: "s3",
    admin_id: "u1",
    supply_date: "2025-04-05",
    supply_status: "completed",
    items: [{ book_id: "b7", import_price: 50000, quantity: 50, sub_amount: 2500000 }],
    total_amount: 2500000
  },
  {
    id: "r4",
    supplier_id: "s4",
    admin_id: "u14",
    supply_date: "2025-04-08",
    supply_status: "pending",
    items: [
      { book_id: "b8", import_price: 70000, quantity: 30, sub_amount: 2100000 },
      { book_id: "b9", import_price: 45000, quantity: 20, sub_amount: 900000 }
    ],
    total_amount: 3000000
  },
  {
    id: "r5",
    supplier_id: "s5",
    admin_id: "u1",
    supply_date: "2025-04-10",
    supply_status: "completed",
    items: [{ book_id: "b10", import_price: 120000, quantity: 40, sub_amount: 4800000 }],
    total_amount: 4800000
  },
  {
    id: "r6",
    supplier_id: "s6",
    admin_id: "u14",
    supply_date: "2025-04-12",
    supply_status: "completed",
    items: [{ book_id: "b11", import_price: 80000, quantity: 25, sub_amount: 2000000 }],
    total_amount: 2000000
  },
  {
    id: "r7",
    supplier_id: "s7",
    admin_id: "u1",
    supply_date: "2025-04-14",
    supply_status: "pending",
    items: [
      { book_id: "b12", import_price: 60000, quantity: 35, sub_amount: 2100000 }
    ],
    total_amount: 2100000
  },
  {
    id: "r8",
    supplier_id: "s8",
    admin_id: "u1",
    supply_date: "2025-04-16",
    supply_status: "completed",
    items: [{ book_id: "b13", import_price: 180000, quantity: 15, sub_amount: 2700000 }],
    total_amount: 2700000
  },
  {
    id: "r9",
    supplier_id: "s9",
    admin_id: "u14",
    supply_date: "2025-04-18",
    supply_status: "completed",
    items: [
      { book_id: "b14", import_price: 150000, quantity: 30, sub_amount: 4500000 },
      { book_id: "b15", import_price: 55000, quantity: 50, sub_amount: 2750000 }
    ],
    total_amount: 7250000
  },
  {
    id: "r10",
    supplier_id: "s10",
    admin_id: "u1",
    supply_date: "2025-04-20",
    supply_status: "pending",
    items: [{ book_id: "b1", import_price: 60000, quantity: 40, sub_amount: 2400000 }],
    total_amount: 2400000
  },
  {
    id: "r11",
    supplier_id: "s11",
    admin_id: "u1",
    supply_date: "2025-04-22",
    supply_status: "completed",
    items: [{ book_id: "b3", import_price: 75000, quantity: 20, sub_amount: 1500000 }],
    total_amount: 1500000
  },
  {
    id: "r12",
    supplier_id: "s12",
    admin_id: "u14",
    supply_date: "2025-04-24",
    supply_status: "completed",
    items: [
      { book_id: "b5", import_price: 100000, quantity: 25, sub_amount: 2500000 }
    ],
    total_amount: 2500000
  },
  {
    id: "r13",
    supplier_id: "s13",
    admin_id: "u1",
    supply_date: "2025-04-26",
    supply_status: "pending",
    items: [{ book_id: "b7", import_price: 50000, quantity: 60, sub_amount: 3000000 }],
    total_amount: 3000000
  },
  {
    id: "r14",
    supplier_id: "s14",
    admin_id: "u14",
    supply_date: "2025-04-28",
    supply_status: "completed",
    items: [
      { book_id: "b8", import_price: 70000, quantity: 40, sub_amount: 2800000 },
      { book_id: "b10", import_price: 120000, quantity: 20, sub_amount: 2400000 }
    ],
    total_amount: 5200000
  },
  {
    id: "r15",
    supplier_id: "s15",
    admin_id: "u1",
    supply_date: "2025-04-30",
    supply_status: "completed",
    items: [{ book_id: "b14", import_price: 150000, quantity: 25, sub_amount: 3750000 }],
    total_amount: 3750000
  }
];


// Convenience default export (if you want)
const fakeDB = {
  categories,
  authors,
  publishers,
  books,
  bookAuthors,
  suppliers,
  supplyReceipts
};

export default fakeDB;
