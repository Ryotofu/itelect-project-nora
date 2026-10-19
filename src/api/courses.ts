import { apiFetch } from './client';
import type { Course } from '../types';

export const getCourses = async (): Promise<Course[]> => {
  return apiFetch<Course[]>('/api/courses');
};

export const getCourseByCode = async (code: string): Promise<Course> => {
  return apiFetch<Course>(`/api/courses/${code}`);
};