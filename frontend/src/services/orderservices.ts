import api from '@/lib/axios';
import useSWR from 'swr';

interface ItemCart {
  bookId: string;
  quantity: number;
}
export async function createOrder(details : ItemCart[]){
  return await api.post("/orders", {details}).then((res) => res.data)
}
export function getOrderById(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
  );
  return {
    order: data,
    error,
    isLoading,
    mutate,
  };
}