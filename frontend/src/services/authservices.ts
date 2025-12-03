import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'sonner';

export function useUser() {
    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
    );
    return {
        user: data,
        error,
        isLoading,
        mutate,
    };
}

export async function login(data: { username: string; password: string }) {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const errorData = err.response?.data;
            return {
                code: errorData?.code || "AXIOS_ERROR",
                message: errorData?.message || err.message,
            };
        }
        return { code: "UNKNOWN_ERROR", message: "Something went wrong" };
    }
}

export async function registerUser(data: {
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}) {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const errorData = err.response?.data;
            return {
                code: errorData?.code || "AXIOS_ERROR",
                message: errorData?.message || err.message,
                errors: errorData?.errors || [],
            };
        }
        return {
            code: "UNKNOWN_ERROR",
            message: "Something went wrong",
            errors: []
        };
    }
}

export async function loginGoogle(code: string){
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {code});
        console.log("Res: ", res);
        return res.data;
    }catch (err : unknown) {
        if (axios.isAxiosError(err)) {
            return {
                code: err.response?.data.code || "AXIOS_ERROR",
                message: err.response?.data.message || err
            }
        }
        return { code: "UNKNOWN_ERROR", message: "Something went wrong" };
    }
}
export async function sendMailForgotPassword(email: string){
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {email})
        toast.success("Thư xác nhận thay đổi đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư rác")
        return res.data;
    }catch (err : unknown) {
        if (axios.isAxiosError(err)) {
            return {
                code: err.response?.data.code || "AXIOS_ERROR",
                message: err.response?.data.message || err
            }
        }
        return { code: "UNKNOWN_ERROR", message: "Something went wrong" };
    }
}
