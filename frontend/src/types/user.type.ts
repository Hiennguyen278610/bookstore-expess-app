export interface User {
  id: string;
  fullName: string;
  username: string;
  password: string;
  role: "USER" | "ADMIN";
}
