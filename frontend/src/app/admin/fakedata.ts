import type { User } from "@/types/user.type";
import type { SupplyReceipt } from "@/types/supplyreceipt.type";
import type { Order } from "@/types/order.type";

export const users: User[] = [
  {
    id: "u1",
    fullName: "Admin Store",
    username: "admin",
    password: "admin123",
    phone: "0900000001",
    email: "admin@bookstore.local",
    role: "admin",
    status: "active",
    online: true,
    gender: "male",
  },
  {
    id: "u2",
    fullName: "Nguyễn Văn A",
    username: "nguyena",
    password: "password",
    phone: "0900000002",
    email: "a@example.com",
    role: "customer",
    status: "active",
    online: false,
    gender: "male",
  },
  {
    id: "u3",
    fullName: "Trần Thị B",
    username: "tranb",
    password: "password",
    phone: "0900000003",
    email: "b@example.com",
    role: "customer",
    status: "inactive",
    online: false,
    gender: "female",
  },
];



export const categories = [
  { id: "c1", name: "Kinh tế" },
  { id: "c2", name: "Lập trình" },
  { id: "c3", name: "Văn học" },
  { id: "c4", name: "Thiếu nhi" }
];

export const authors = [
  { id: "a1", name: "Nguyễn Nhật Ánh" },
  { id: "a2", name: "Robert C. Martin" },
  { id: "a3", name: "Harper Lee" },
  { id: "a4", name: "Đỗ Phủ" },
  { id: "a5", name: "Martin Fowler" }
];

export const publishers = [
  { id: "p1", name: "NXB Trẻ" },
  { id: "p2", name: "NXB Thời Đại" },
  { id: "p3", name: "O'Reilly" }
];

export const books = [
  {
    id: "b1",
    name: "Dế Mèn Phiêu Lưu Ký",
    category_id: "c3",
    publisher_id: "p1",
    imageUrl: "https://placehold.co/200x300?text=DemMen",
    quantity: 25,
    price: 95000
  },
  {
    id: "b2",
    name: "Clean Code",
    category_id: "c2",
    publisher_id: "p3",
    imageUrl: "https://placehold.co/200x300?text=Clean+Code",
    quantity: 10,
    price: 350000
  },
  {
    id: "b3",
    name: "To Kill a Mockingbird",
    category_id: "c3",
    publisher_id: "p2",
    imageUrl: "https://placehold.co/200x300?text=Mockingbird",
    quantity: 5,
    price: 120000
  },
  {
    id: "b4",
    name: "Refactoring",
    category_id: "c2",
    publisher_id: "p3",
    imageUrl: "https://placehold.co/200x300?text=Refactoring",
    quantity: 8,
    price: 420000
  },
  {
    id: "b5",
    name: "Kinh tế học căn bản",
    category_id: "c1",
    publisher_id: "p2",
    imageUrl: "https://placehold.co/200x300?text=Kinh+te",
    quantity: 15,
    price: 150000
  },
  {
    id: "b6",
    name: "Truyện cổ tích cho bé",
    category_id: "c4",
    publisher_id: "p1",
    imageUrl: "https://placehold.co/200x300?text=CoTich",
    quantity: 40,
    price: 60000
  }
];

export const bookAuthors = [
  { book_id: "b1", author_id: "a1" },
  { book_id: "b2", author_id: "a2" },
  { book_id: "b3", author_id: "a3" },
  { book_id: "b4", author_id: "a5" },
  { book_id: "b5", author_id: "a4" },
  { book_id: "b6", author_id: "a1" }
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
    purchase_date: "2025-04-10",
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
    purchase_date: "2025-04-12",
    purchase_status: "processing",
    items: [{ book_id: "b1", quantity: 1, price: 95000, sub_total: 95000 }],
    total_price: 95000
  }
];

// Suppliers + supply receipts (inventory import)
export const suppliers = [
  { id: "s1", name: "Công ty Sách A", phone: "0281234567", email: "supA@books.com", address: "HCM" },
  { id: "s2", name: "Nhà phân phối B", phone: "0287654321", email: "supB@books.com", address: "HN" }
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
