import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getJWTfromCookie } from "@/lib/cookies";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const token = await getJWTfromCookie();
  return axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      },
    })
    .then((res) => res.data);
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export const normalizeString = (str: string) => {
  return (
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
      .replace(/đ/g, "d")
      // Bỏ hết các từ khóa hành chính
      .replace(
        /\b(thanh pho|tinh|thanh thi|quan|huyen|thi xa|phuong|xa|thi tran|tp\.|tp|q\.)\b/g,
        ""
      )
      .replace(/\s+/g, " ") // Xóa khoảng trắng thừa
      .trim()
  );
};

export const roundPrice = (n: number): number =>
  n <= 0 ? 100000 : Math.ceil(n / 100000) * 100000;

// Helper function để parse search params an toàn
export const parseSearchParams = (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const getString = (key: string): string => {
    const value = searchParams[key];
    if (!value) return "";
    if (Array.isArray(value)) return value[0] || "";
    return value;
  };

  const getNumber = (key: string, defaultValue = 0): number => {
    const value = getString(key);
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  const getStringArray = (key: string): string[] => {
    const value = searchParams[key];
    if (!value) return [];

    if (typeof value === "string") {
      return value.split(",").filter((item) => item.trim());
    }

    if (Array.isArray(value)) {
      return value.filter((item) => typeof item === "string" && item.trim());
    }

    return [];
  };

  return {
    getString,
    getNumber,
    getStringArray,
  };
};
