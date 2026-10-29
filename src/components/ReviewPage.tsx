import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AiReview } from "../types/index";
import { askAi } from "../api/client";
import { reviewFormSchema, type ReviewFormValues } from "../schemas/reviewSchema";

const READINESS_STYLE: Record<AiReview["readiness"], { bg: string; text: string; label: string }> = {
  ready: { bg: "#166534", text: "#86efac", label: "Ready to Submit" },
  almost: { bg: "#854d0e", text: "#fef08a", label: "Almost Ready" },
  "not-yet": { bg: "#991b1b", text: "#fca5a5", label: "Needs Work" },
};

const SAMPLE_PROMPTS = [
  {
    title: "Full-Stack Web App",
    text: "I built a student project tracker using React and TypeScript on the frontend, and Node.js with Express and MongoDB Atlas on the backend. It features JWT authentication, course listing endpoints, Zod schema validation, and Gemini AI integration for project reviews.",
  },
  {
    title: "REST API Backend",
    text: "An Express.js REST API providing course management endpoints, Mongoose ORM models, rate limiting with express-rate-limit, and protected routes using JWT bearer tokens deployed live on Vercel.",
  },
];

export default function ReviewPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });

  const promptValue = watch("prompt") || "";

  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  const handleUsePreset = (text: string) => {
    setValue("prompt", text, { shouldValidate: true });
  };

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.35rem 0", color: "#f8fafc" }}>
          Gemini AI Project Review
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
          Describe your project and get automated feedback before submitting.
        </p>
      </div>

      {/* QUICK PRESET PROMPT BUTTONS */}
      <div style={{ marginBottom: "1.25rem", padding: "1rem", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
        <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
          💡 Try a sample prompt template:
        </span>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SAMPLE_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUsePreset(preset.text)}
              style={{
                padding: "0.4rem 0.75rem",
                backgroundColor: "#1e293b",
                color: "#60a5fa",
                border: "1px solid #334155",
                borderRadius: "6px",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              + {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "grid", gap: "0.375rem" }}>
          {/* REQUIRED FOR VITEST UNIT TEST: label "Project description" linked to id="prompt" */}
          <label htmlFor="prompt" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#cbd5e1" }}>
            Project description
          </label>
          <textarea
            id="prompt"
            rows={6}
            {...register("prompt")}
            aria-invalid={errors.prompt ? true : undefined}
            placeholder="What it does, how it is built, where it runs..."
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: "#0f172a",
              border: errors.prompt ? "1px solid #ef4444" : "1px solid #475569",
              color: "#ffffff",
              fontSize: "0.875rem",
              boxSizing: "border-box",
              resize: "vertical"
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {/* REQUIRED FOR VITEST UNIT TEST: exact schema error text */}
              {errors.prompt && (
                <p style={{ fontSize: "0.85rem", color: "#f87171", margin: 0 }}>
                  {errors.prompt.message}
                </p>
              )}
            </div>
            <span style={{ fontSize: "0.75rem", color: promptValue.length < 20 ? "#f87171" : "#94a3b8" }}>
              {promptValue.length} / 2000 chars
            </span>
          </div>
        </div>

        {/* REQUIRED FOR VITEST UNIT TEST: button "Review my project" */}
        <button
          type="submit"
          disabled={review.isPending}
          style={{
            justifySelf: "start",
            padding: "0.6rem 1.25rem",
            backgroundColor: review.isPending ? "#475569" : "#2563eb",
            color: "#ffffff",
            borderRadius: "6px",
            border: "none",
            fontWeight: 600,
            cursor: review.isPending ? "not-allowed" : "pointer",
            fontSize: "0.875rem"
          }}
        >
          {review.isPending ? "Reviewing..." : "Review my project"}
        </button>
      </form>

      {/* ERROR BANNER */}
      {review.isError && (
        <div style={{ marginTop: "1rem", padding: "0.85rem", backgroundColor: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "8px", fontSize: "0.875rem" }}>
          {review.error.message}
        </div>
      )}

      {/* REVIEW OUTPUT DISPLAY */}
      {review.data && (
        <div
          style={{
            marginTop: "1.75rem",
            display: "grid",
            gap: "1.25rem",
            borderRadius: "10px",
            border: "1px solid #334155",
            padding: "1.5rem",
            backgroundColor: "#0f172a",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
              Review Output
            </h3>
            <span
              style={{
                backgroundColor: READINESS_STYLE[review.data.readiness].bg,
                color: READINESS_STYLE[review.data.readiness].text,
                padding: "4px 10px",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {READINESS_STYLE[review.data.readiness].label}
            </span>
          </div>

          <p style={{ color: "#e2e8f0", margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>
            {review.data.summary}
          </p>

          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: 700, color: "#4ade80", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Strengths
            </h4>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.875rem", color: "#cbd5e1" }}>
              {review.data.strengths.map((s, idx) => (
                <li key={idx} style={{ marginBottom: "0.25rem" }}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: 700, color: "#facc15", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Before you submit
            </h4>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.875rem", color: "#cbd5e1" }}>
              {review.data.improvements.map((s, idx) => (
                <li key={idx} style={{ marginBottom: "0.25rem" }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}