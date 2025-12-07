import axios from "axios";
import { getJWTfromCookie } from '@/lib/cookies';
import { baseUrl } from '@/constants';

const api = axios.create({
    baseURL : `${baseUrl}`,
});

api.interceptors.request.use(
  async (config) => {
      const token = await getJWTfromCookie();
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => Promise.reject(error)
);

export default api