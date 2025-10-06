import {z} from "zod";
export const LoginRequestSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password is required"),
})