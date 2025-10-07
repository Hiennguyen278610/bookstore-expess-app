import {z} from "zod";
export const LoginRequestSchema = z.object({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().min(6, "Mật khẩu chứa ít nhất 6 ký tự"),
})
export const RegisterRequestSchema = z.object({
    fullname: z.string().min(1, "Họ và tên không được để trống"),
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu chứa ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Nhập lại mật khẩu không được để trống"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
})