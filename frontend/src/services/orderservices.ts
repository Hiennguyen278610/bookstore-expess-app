import api from '@/lib/axios';
import useSWR from 'swr';
import { OrderPayload } from '@/validation/orderSchema';


export async function createOrder(payload: OrderPayload) {
  return await api.post("/orders", payload).then((res) => res.data);
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