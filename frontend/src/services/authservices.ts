import axios from 'axios';
import useSWR from 'swr';

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
        const res = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data);
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
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}): Promise<AuthResponse | ErrorResponse> {
    try {
        const res = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
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

const popupCenter = (url: string, title: string) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;

    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},height=${550 / systemZoom
      },top=${top},left=${left}`
    );
    newWindow?.focus();
    return newWindow;
};