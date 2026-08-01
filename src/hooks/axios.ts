import axios from 'axios';
import { LocalStorage } from '@/constants/enums';
import { PLACEHOLDERS } from '@/constants/placeholders';

const { UNDEFINED } = PLACEHOLDERS;
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== UNDEFINED) {
      const accessToken = localStorage.getItem(LocalStorage.access_token);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;