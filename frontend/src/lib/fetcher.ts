import { getJWTfromCookie } from '@/lib/cookies';
import axios from 'axios';

export const fetcherWithToken = async (url: string) => {
  const token = await getJWTfromCookie();

  if (!token) {
    throw new Error("No token found");
  }

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(url, { headers });
  return response.data;
};