import type { User } from "@/types/user.type";
import type { SupplyReceipt } from "@/types/supplyreceipt.type";
import type { Order } from "@/types/order.type";
import type { Category } from "@/types/category.type";

export const users: User[] = [
  {
    id: "u1",
    fullName: "Admin Store",
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u2",
    fullName: "Nguyễn Văn A",
    username: "nguyena",
    password: "password",
    role: "user",
  },
  {
    id: "u3",
    fullName: "Trần Thị B",
    username: "tranb",
    password: "password",
    role: "user",
  },
  {
    id: "u4",
    fullName: "Lê Văn C",
    username: "levanc",
    password: "password123",
    role: "user",
  },
  {
    id: "u5",
    fullName: "Phạm Thị D",
    username: "phamthid",
    password: "password123",
    role: "user",
  },
  {
    id: "u6",
    fullName: "Hoàng Văn E",
    username: "hoangvane",
    password: "password123",
    role: "user",
  },
  {
    id: "u7",
    fullName: "Vũ Thị F",
    username: "vuthif",
    password: "password123",
    role: "user",
  },
  {
    id: "u8",
    fullName: "Đặng Văn G",
    username: "dangvang",
    password: "password123",
    role: "user",
  },
  {
    id: "u9",
    fullName: "Bùi Thị H",
    username: "buithih",
    password: "password123",
    role: "user",
  },
  {
    id: "u10",
    fullName: "Ngô Văn I",
    username: "ngovani",
    password: "password123",
    role: "user",
  },
  {
    id: "u11",
    fullName: "Dương Thị K",
    username: "duongthik",
    password: "password123",
    role: "user",
  },
  {
    id: "u12",
    fullName: "Lý Văn L",
    username: "lyvanl",
    password: "password123",
    role: "user",
  },
  {
    id: "u13",
    fullName: "Trịnh Thị M",
    username: "trinhthim",
    password: "password123",
    role: "user",
  },
  {
    id: "u14",
    fullName: "Admin Phụ",
    username: "admin2",
    password: "admin456",
    role: "admin",
  },
  {
    id: "u15",
    fullName: "Cao Văn N",
    username: "caovann",
    password: "password123",
    role: "user",
  },
];



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

// Cart per customer (simple)
export const carts = [
  {
    id: "cart_u2",
    customer_id: "u2",
    items: [
      { book_id: "b2", quantity: 1, price: 350000 },
      { book_id: "b6", quantity: 2, price: 60000 }
    ],
    total_quantity: 3,
    total_price: 350000 + 2 * 60000
  },
  {
    id: "cart_u3",
    customer_id: "u3",
    items: [{ book_id: "b1", quantity: 1, price: 95000 }],
    total_quantity: 1,
    total_price: 95000
  }
];

// Orders (each order contains items array similar order_details)
export const orders: Order[] = [
  {
    id: "o1",
    user_id: "u2",
    payment_method: "cash",
    purchase_date: "2024-11-15",
    purchase_status: "delivered",
    items: [
      { book_id: "b2", quantity: 1, price: 350000, sub_total: 350000 },
      { book_id: "b6", quantity: 2, price: 60000, sub_total: 120000 }
    ],
    total_price: 470000
  },
  {
    id: "o2",
    user_id: "u3",
    payment_method: "card",
    purchase_date: "2024-11-28",
    purchase_status: "processing",
    items: [{ book_id: "b1", quantity: 1, price: 95000, sub_total: 95000 }],
    total_price: 95000
  },
  {
    id: "o3",
    user_id: "u4",
    payment_method: "cash",
    purchase_date: "2024-12-05",
    purchase_status: "delivered",
    items: [
      { book_id: "b7", quantity: 2, price: 85000, sub_total: 170000 },
      { book_id: "b8", quantity: 1, price: 110000, sub_total: 110000 }
    ],
    total_price: 280000
  },
  {
    id: "o4",
    user_id: "u5",
    payment_method: "card",
    purchase_date: "2024-12-20",
    purchase_status: "delivered",
    items: [{ book_id: "b10", quantity: 3, price: 180000, sub_total: 540000 }],
    total_price: 540000
  },
  {
    id: "o5",
    user_id: "u6",
    payment_method: "cash",
    purchase_date: "2025-01-10",
    purchase_status: "cancelled",
    items: [{ book_id: "b11", quantity: 1, price: 125000, sub_total: 125000 }],
    total_price: 125000
  },
  {
    id: "o6",
    user_id: "u7",
    payment_method: "card",
    purchase_date: "2025-01-25",
    purchase_status: "delivered",
    items: [
      { book_id: "b14", quantity: 1, price: 220000, sub_total: 220000 },
      { book_id: "b9", quantity: 2, price: 75000, sub_total: 150000 }
    ],
    total_price: 370000
  },
  {
    id: "o7",
    user_id: "u8",
    payment_method: "cash",
    purchase_date: "2025-02-14",
    purchase_status: "delivered",
    items: [{ book_id: "b12", quantity: 1, price: 95000, sub_total: 95000 }],
    total_price: 95000
  },
  {
    id: "o8",
    user_id: "u9",
    payment_method: "card",
    purchase_date: "2025-03-08",
    purchase_status: "delivered",
    items: [
      { book_id: "b13", quantity: 1, price: 250000, sub_total: 250000 },
      { book_id: "b15", quantity: 2, price: 89000, sub_total: 178000 }
    ],
    total_price: 428000
  },
  {
    id: "o9",
    user_id: "u10",
    payment_method: "cash",
    purchase_date: "2025-04-02",
    purchase_status: "delivered",
    items: [{ book_id: "b3", quantity: 1, price: 120000, sub_total: 120000 }],
    total_price: 120000
  },
  {
    id: "o10",
    user_id: "u11",
    payment_method: "card",
    purchase_date: "2025-05-18",
    purchase_status: "processing",
    items: [{ book_id: "b4", quantity: 1, price: 420000, sub_total: 420000 }],
    total_price: 420000
  },
  {
    id: "o11",
    user_id: "u12",
    payment_method: "cash",
    purchase_date: "2025-06-22",
    purchase_status: "delivered",
    items: [
      { book_id: "b5", quantity: 2, price: 150000, sub_total: 300000 },
      { book_id: "b1", quantity: 1, price: 95000, sub_total: 95000 }
    ],
    total_price: 395000
  },
  {
    id: "o12",
    user_id: "u13",
    payment_method: "card",
    purchase_date: "2025-07-15",
    purchase_status: "delivered",
    items: [{ book_id: "b8", quantity: 3, price: 110000, sub_total: 330000 }],
    total_price: 330000
  },
  {
    id: "o13",
    user_id: "u2",
    payment_method: "cash",
    purchase_date: "2025-09-30",
    purchase_status: "delivered",
    items: [{ book_id: "b7", quantity: 1, price: 85000, sub_total: 85000 }],
    total_price: 85000
  },
  {
    id: "o14",
    user_id: "u3",
    payment_method: "card",
    purchase_date: "2025-11-20",
    purchase_status: "pending",
    items: [
      { book_id: "b10", quantity: 1, price: 180000, sub_total: 180000 },
      { book_id: "b11", quantity: 1, price: 125000, sub_total: 125000 }
    ],
    total_price: 305000
  },
  {
    id: "o15",
    user_id: "u4",
    payment_method: "cash",
    purchase_date: "2025-12-05",
    purchase_status: "processing",
    items: [{ book_id: "b14", quantity: 2, price: 220000, sub_total: 440000 }],
    total_price: 440000
  }
];

// Suppliers + supply receipts (inventory import)
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
  users,
  categories,
  authors,
  publishers,
  books,
  bookAuthors,
  carts,
  orders,
  suppliers,
  supplyReceipts
};

export default fakeDB;
