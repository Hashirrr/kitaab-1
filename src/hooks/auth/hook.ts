import { login } from './api';
import { LocalStorage } from '@/constants/enums';
import { useMutation } from '@tanstack/react-query';
import { LoginRequest, LoginResponse } from './interface';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem(LocalStorage.access_token, data.access_token);
    }
  });
};