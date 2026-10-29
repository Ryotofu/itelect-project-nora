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

// ===== SESSION 11: AI REVIEW TYPE =====
export interface AiReview {
  summary: string;
  strengths: string[];
  improvements: string[];
  readiness: "ready" | "almost" | "not-yet";
}

// ===== PROJECT SUBMISSION TYPE =====
export interface Submission {
  id: string;
  courseCode: string;
  title: string;
  githubUrl: string;
  createdAt: string;
}