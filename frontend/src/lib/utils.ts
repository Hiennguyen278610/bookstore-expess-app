import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getJWTfromCookie } from '@/lib/cookies';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function formatPrice (price : number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

export const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/đ/g, "d")
    // Bỏ hết các từ khóa hành chính
    .replace(/\b(thanh pho|tinh|thanh thi|quan|huyen|thi xa|phuong|xa|thi tran|tp\.|tp|q\.)\b/g, "")
    .replace(/\s+/g, " ") // Xóa khoảng trắng thừa
    .trim();
};

