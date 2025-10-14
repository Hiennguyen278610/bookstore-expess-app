import axios from "axios";
import useSWR from "swr";
import { getJWTfromCookie } from '@/lib/cookies';

type AuthResponse = {
    token: string;
    code?: string;
    message?: string;
}
type ErrorResponse = {
    code: string;
    message: string;
}
export  function useUser() {

    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    );
    return {
        user: data,
        error,
        isLoading,
        mutate,
    };
}

export async function login(data: {
    username: string;
    password: string;
}): Promise<AuthResponse | ErrorResponse
> {
    try {
        const res = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, data);
    console.log(res.data);
        return res.data;
    } catch (err : unknown) {
        if (axios.isAxiosError(err)) {
            return {
                code: err.response?.data.code || "AXIOS_ERROR",
                message: err.response?.data.message || err.message,
            }
        }
        return { code: "UNKNOWN_ERROR", message: "Something went wrong" };
    }
}

export async function registerUser(data: {
    fullname: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}): Promise<AuthResponse | ErrorResponse> {
    try {
        const res = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, data);
        return res.data;
    }catch (err : unknown) {
        if (axios.isAxiosError(err)) {
            return {
                code: err.response?.data.code || "AXIOS_ERROR",
                message: err.response?.data.message || err.message,
            }
        }
        return { code: "UNKNOWN_ERROR", message: "Something went wrong" };
    }
}