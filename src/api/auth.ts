import { apiFetch } from './client';
import type { AuthResponse } from '../types';

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  const data = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const registerUser = async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
  const data = await apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const logoutUser = (): void => {
  localStorage.removeItem('token');
};