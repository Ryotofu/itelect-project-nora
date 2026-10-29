import React, { useState } from "react";
import type { Course, Submission } from "../types";
import { addSubmission } from "../api/submissions";

interface Props {
  courses: Course[];
  initialCourseCode?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (submission: Submission) => void;
}

export default function SubmissionFormModal({
  courses,
  initialCourseCode,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState(initialCourseCode || courses[0]?.code || "");
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!courseCode) {
      setError("Please select a course.");
      return;
    }
    if (!githubUrl.trim().startsWith("https://github.com/")) {
      setError("Please enter a valid GitHub URL (e.g. https://github.com/username/repository).");
      return;
    }

    setError("");
    const created = addSubmission({ title, courseCode, githubUrl });
    onSuccess(created);
    setTitle("");
    setGithubUrl("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          padding: "1.5rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#f8fafc" }}>
            Submit Project Repository
          </h3>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.25rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "6px", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.35rem" }}>
              Submission Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fullstack Student Portal"
              style={{
                width: "100%",
                padding: "0.65rem",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                border: "1px solid #475569",
                color: "#ffffff",
                fontSize: "0.875rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.35rem" }}>
              Target Course
            </label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                border: "1px solid #475569",
                color: "#ffffff",
                fontSize: "0.875rem",
                boxSizing: "border-box",
              }}
            >
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.35rem" }}>
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              style={{
                width: "100%",
                padding: "0.65rem",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                border: "1px solid #475569",
                color: "#ffffff",
                fontSize: "0.875rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                backgroundColor: "#334155",
                color: "#f8fafc",
                border: "none",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}