export const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
    : "/api/v1";

export const sortBookOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "name_asc", label: "Tên A-Z" },
  { value: "name_desc", label: "Tên Z-A" },
];

export const statusMap = new Map([
  ["all", "Tất cả"],
  ['pending', 'Chờ xử lý'],
  ['processing', 'Đang xử lý'],
  ['delivery', 'Đang giao hàng'],
  ['completed', 'Đã hoàn thành'],
  ['canceled', 'Đã hủy']
]);