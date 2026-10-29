import React, { useState } from "react";
import { askAi } from "../api/client";
import type { AiReview } from "../types";

const READINESS_STYLE: Record<AiReview["readiness"], { bg: string; color: string; label: string }> = {
  ready: { bg: "#166534", color: "#86efac", label: "Ready to Submit" },
  almost: { bg: "#854d0e", color: "#fef08a", label: "Almost Ready" },
  "not-yet": { bg: "#991b1b", color: "#fca5a5", label: "Needs Work" },
};

export default function AiReviewSection() {
  const [prompt, setPrompt] = useState("");
  const [review, setReview] = useState<AiReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 20) {
      setError("Describe your project in at least 20 characters.");
      return;
    }

    setError("");
    setLoading(true);
    setReview(null);

    try {
      const result = await askAi(prompt);
      setReview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1e293b", padding: "1.75rem", borderRadius: "12px", border: "1px solid #334155" }}>
      {/* REQUIRED FOR VITEST UNIT TEST: <h2> and text */}
      <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc" }}>
        AI Project Review
      </h2>
      <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.35rem", marginBottom: "1.25rem" }}>
        Describe your project and get feedback before submitting.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <textarea
            rows={5}
            placeholder="Describe what your app does, technologies used, authentication, and deployment URL..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: "#0f172a",
              border: "1px solid #475569",
              color: "#fff",
              fontSize: "0.875rem",
              boxSizing: "border-box",
              resize: "vertical"
            }}
            required
          />
          <div style={{ textAlign: "right", fontSize: "0.75rem", color: prompt.length < 20 ? "#f87171" : "#94a3b8", marginTop: "0.25rem" }}>
            {prompt.length} / 2000 chars (Min 20)
          </div>
        </div>

        {error && (
          <div style={{ padding: "0.65rem", backgroundColor: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "6px", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        {/* REQUIRED FOR VITEST UNIT TEST: button label "Review My Project" */}
        <button
          type="submit"
          disabled={loading}
          style={{
            alignSelf: "flex-start",
            padding: "0.6rem 1.25rem",
            backgroundColor: loading ? "#475569" : "#2563eb",
            color: "#ffffff",
            borderRadius: "6px",
            border: "none",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.875rem"
          }}
        >
          {loading ? "Reviewing..." : "Review My Project"}
        </button>
      </form>

      {/* REVIEW RESULT */}
      {review && (
        <div style={{ marginTop: "1.5rem", padding: "1.25rem", backgroundColor: "#0f172a", borderRadius: "10px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#f8fafc" }}>Review Summary</h3>
            <span
              style={{
                backgroundColor: READINESS_STYLE[review.readiness].bg,
                color: READINESS_STYLE[review.readiness].color,
                padding: "4px 10px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {READINESS_STYLE[review.readiness].label}
            </span>
          </div>

          <p style={{ margin: "0 0 1rem 0", color: "#e2e8f0", fontSize: "0.95rem", lineHeight: 1.5 }}>
            {review.summary}
          </p>

          <h4 style={{ margin: "1rem 0 0.5rem 0", color: "#4ade80", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Strengths:
          </h4>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#cbd5e1", fontSize: "0.875rem" }}>
            {review.strengths.map((s, idx) => (
              <li key={idx} style={{ marginBottom: "0.25rem" }}>{s}</li>
            ))}
          </ul>

          <h4 style={{ margin: "1rem 0 0.5rem 0", color: "#facc15", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Things to Improve:
          </h4>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#cbd5e1", fontSize: "0.875rem" }}>
            {review.improvements.map((imp, idx) => (
              <li key={idx} style={{ marginBottom: "0.25rem" }}>{imp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}