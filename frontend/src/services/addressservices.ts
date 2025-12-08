import useSWR from "swr";
import { Address } from "@/types/address.type";
import api from "@/lib/axios";
import { AxiosError } from "axios";

interface LocationItem {
  error: number;
  error_text: string;
  data_name: string;
  data: Province[];
}
export interface Province {
  id: string;
  name: string;
}
export function getProvinces() {
  const { data, error, isLoading, mutate } = useSWR<LocationItem>(
    `${process.env.NEXT_PUBLIC_API_URL}/address/provinces`
  );
  return {
    provinces: data?.data,
    error,
    isLoading,
    mutate,
  };
}
export function getAllAddress() {
  const { data, error, isLoading, mutate } = useSWR<[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/address`
  );
  return {
    addresses: data,
    error,
    isLoading,
    mutate,
  };
}
export async function getDistricts(id: string): Promise<Province[]> {
  return api
    .get(`${process.env.NEXT_PUBLIC_API_URL}/address/districts/${id}`)
    .then((res) => {
      return res.data?.data;
    });
}

export async function createAddress(data: Address) {
  return api.post(`/address`, data).then((res) => {
    return res.data;
  });
}
export async function updateAddress(data: Address) {
  return api.put(`/address/${data._id}`, data).then((res) => {
    return res.data;
  });
}
export async function deleteAddress(id: string) {
  return api.delete(`/address/${id}`).then((res) => {
    return res.data;
  });
}

export async function getAddressFromLatLog(
  latitue: number | null,
  longtitue: number | null
) {
  return api
    .get(
      `https://api.map4d.vn/sdk/v2/geocode?key=${process.env.NEXT_PUBLIC_MAP4D_KEY}&location=${latitue},${longtitue}`
    )
    .then((res) => res?.data?.result[0])
    .catch((error: AxiosError) => {
      console.error(error.message);
    });
}
