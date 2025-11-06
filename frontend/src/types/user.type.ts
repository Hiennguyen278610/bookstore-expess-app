export interface User {
  id: string;
  fullName: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  role: "admin" | "customer";
  status?: string;       // trạng thái tài khoản (tùy chọn)
  online?: boolean;      // đang hoạt động hay không
  gender?: string | null; // giới tính
}
