export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
