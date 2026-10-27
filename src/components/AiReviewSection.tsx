import { useState } from "react";
import { askAi } from "../api/client";
import type { AiReview } from "../types";

const READINESS_STYLE: Record<AiReview["readiness"], { bg: string; color: string; label: string }> = {
  ready: { bg: "#dcfce7", color: "#166534", label: "Ready to Submit" },
  almost: { bg: "#fef9c3", color: "#854d0e", label: "Almost Ready" },
  "not-yet": { bg: "#fee2e2", color: "#991b1b", label: "Needs Work" },
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
    } catch (err: any) {
      setError(err.message || "Failed to generate AI review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>AI Project Review</h2>
      <p style={{ color: "#555", fontSize: "0.9rem" }}>
        Describe your project and get feedback before submitting.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <textarea
          rows={5}
          placeholder="Describe what your app does, technologies used, authentication, and deployment URL..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />

        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", cursor: "pointer" }}>
          {loading ? "Reviewing..." : "Review My Project"}
        </button>
      </form>

      {review && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "6px", border: "1px solid #ddd" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Review Summary</h3>
            <span
              style={{
                backgroundColor: READINESS_STYLE[review.readiness].bg,
                color: READINESS_STYLE[review.readiness].color,
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              {READINESS_STYLE[review.readiness].label}
            </span>
          </div>

          <p><strong>{review.summary}</strong></p>

          <h4>Strengths:</h4>
          <ul>
            {review.strengths.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>

          <h4>Things to Improve:</h4>
          <ul>
            {review.improvements.map((imp, idx) => (
              <li key={idx}>{imp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}