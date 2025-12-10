import useSWR from 'swr';

export function getAllTop10BestSellingBooks() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/best-selling`,
  );
  return {
    bestSelling: data,
    error,
    isLoading,
    mutate,
  };
}
export function getAllTop10NewestBooks() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/newest`,
  );
  return {
    newest: data,
    error,
    isLoading,
    mutate,
  };
}