import api from '@/lib/axios';
import useSWR from 'swr';

export async function createPayment(id: string){
  return await api.post(`/payment/create/${id}`).then((res) => res.data)
}
export async function cancelPayment(id: string){
  return await api.put(`/payment/cancel/${id}`).then((res) => res.data)
}
export function getAllOrderByToken(page: number, limit: number, status : string) {
  // Xử lý logic: Nếu là ALL thì gửi chuỗi rỗng để Backend không lọc
  const statusParam = status === 'ALL' ? '' : status;
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status: statusParam
  }).toString();

  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/me/?${queryString}`,
  );

  return {
    order: data,
    error,
    isLoading,
    mutate,
  };
}
