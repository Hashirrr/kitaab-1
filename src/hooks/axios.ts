import axios from 'axios';
import { LocalStorage } from '@/constants/enums';
import { ENDPOINTS } from '@/constants/endpoints';
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== UNDEFINED) {
        localStorage.removeItem(LocalStorage.access_token);

        if (!error.config?.url?.includes(ENDPOINTS.login) && window.location.pathname !== '/auth' && window.location.pathname !== '/') {
          window.location.href = '/auth';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;