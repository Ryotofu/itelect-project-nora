export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}