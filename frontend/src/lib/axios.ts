import { baseUrl } from "@/constants";
import axios from "axios";

function getClientToken(): string | null {
  const match = document.cookie.match(/(^| )access_token=([^;]+)/);
  return match ? match[2] : null;
}

export const publicApi = axios.create({
  baseURL: `${baseUrl}`,
});

export const customerApi = axios.create({
  baseURL: `${baseUrl}`,
});

