import api from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { LoginRequest, LoginResponse } from './interface';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(ENDPOINTS.login, data);
  return response.data;
};