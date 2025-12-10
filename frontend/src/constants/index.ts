export const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const sortBookOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "name_asc", label: "Tên A-Z" },
  { value: "name_desc", label: "Tên Z-A" },
];
