import type { Submission } from "../types";

const STORAGE_KEY = "itelect4_course_submissions";

const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    courseCode: "ITELECT4",
    title: "ITELECT4 Fullstack Student Portal",
    githubUrl: "https://github.com/Ryotofu/itelect4-project",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-2",
    courseCode: "ITELECT4",
    title: "ITELECT4 Express REST API",
    githubUrl: "https://github.com/Ryotofu/itelect4-backend",
    createdAt: new Date().toISOString(),
  },
];

export function getSubmissions(): Submission[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUBMISSIONS));
    return DEFAULT_SUBMISSIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SUBMISSIONS;
  }
}

export function addSubmission(newSub: Omit<Submission, "id" | "createdAt">): Submission {
  const submissions = getSubmissions();
  const created: Submission = {
    ...newSub,
    id: `sub-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...submissions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return created;
}