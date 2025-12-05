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
      },
      withCredentials: true,
    })
    .then((res) => res.data);
};

export function formatPrice (price : number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

export function getSlug(categoryName: string): string {
  const slug = categoryName
    .trim()
    .toLowerCase()
    
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    

    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  
  return slug;
}