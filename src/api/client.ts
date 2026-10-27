import type { AiReview } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://itelect4-backend-weld.vercel.app';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed.');
  }

  return data as T;
}

// ===== SESSION 11: ASK AI API CALL =====
export function askAi(prompt: string): Promise<AiReview> {
  return apiFetch<AiReview>('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}