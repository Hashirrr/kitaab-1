import { LocalStorage } from '@/constants/enums';
import { LoginResponse } from './auth/interface';
import { ENDPOINTS } from '@/constants/endpoints';
import { PLACEHOLDERS } from '@/constants/placeholders';
import axios, { InternalAxiosRequestConfig } from 'axios';

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

let loginPromise: Promise<string> | null = null;

const AUTH_PAYLOAD = {
  password: '11e3*!RQ$V11',
  email: 'hashir.dev12@gmail.com',
  anonymous_id: '62854e4b7a0475e2',
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const reLogin = async (): Promise<string> => {
  const response = await axios.post<LoginResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.login}`,
    AUTH_PAYLOAD
  );

  const newToken = response.data.access_token;
  if (typeof window !== UNDEFINED) {
    localStorage.setItem(LocalStorage.access_token, newToken);
  }

  return newToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes(ENDPOINTS.login)) {
      originalRequest._retry = true;

      try {
        if (!loginPromise)
          loginPromise = reLogin().finally(() => {
            loginPromise = null;
          });

        const newToken = await loginPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (loginError) {
        if (typeof window !== UNDEFINED)
          localStorage.removeItem(LocalStorage.access_token);
        return Promise.reject(loginError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;