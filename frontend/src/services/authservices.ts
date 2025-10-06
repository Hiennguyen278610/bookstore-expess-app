import axios from "axios";
import useSWR from "swr";

export function useUser() {
    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`
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
}): Promise<
    | { token: string; code?: string; message?: string }
    | { code: string; message: string }
> {
    try {
        const res = await axios.post<{
            token: string;
            code?: string;
            message?: string;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data);
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