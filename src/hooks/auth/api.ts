import { ENDPOINTS } from '@/constants/endpoints';
import api from '../axios';
import { LoginRequest, LoginResponse } from './interface';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(ENDPOINTS.login, data);
  return response.data;
};