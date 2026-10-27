import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AiReview } from "../types/index";
import { askAi } from "../api/client";
import { reviewFormSchema, type ReviewFormValues } from "../schemas/reviewSchema";

const READINESS_STYLE: Record<AiReview["readiness"], string> = {
  "ready": "bg-green-100 text-green-800",
  "almost": "bg-yellow-100 text-yellow-800",
  "not-yet": "bg-red-100 text-red-800",
};

export default function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });

  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  return (
    <div style={{ maxWidth: "672px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
        AI Review
      </h2>
      <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
        Describe your project and get feedback before you submit it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "grid", gap: "0.375rem" }}>
          <label htmlFor="prompt" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
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
              padding: "0.625rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "0.875rem",
            }}
          />
          {errors.prompt && (
            <p style={{ fontSize: "0.875rem", color: "#dc2626" }}>
              {errors.prompt.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={review.isPending}
          style={{
            justifySelf: "start",
            padding: "0.5rem 1rem",
            backgroundColor: review.isPending ? "#9ca3af" : "#2563eb",
            color: "#ffffff",
            borderRadius: "0.375rem",
            border: "none",
            cursor: review.isPending ? "not-allowed" : "pointer",
          }}
        >
          {review.isPending ? "Reviewing..." : "Review my project"}
        </button>
      </form>

      {review.isError && (
        <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#b91c1c" }}>
          {review.error.message}
        </p>
      )}

      {review.data && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "grid",
            gap: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            padding: "1.25rem",
            backgroundColor: "#ffffff",
          }}
        >
          <span
            className={READINESS_STYLE[review.data.readiness]}
            style={{
              justifySelf: "start",
              borderRadius: "0.25rem",
              padding: "0.125rem 0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {review.data.readiness}
          </span>

          <p style={{ color: "#111827" }}>{review.data.summary}</p>

          <div>
            <h3 style={{ fontWeight: 600, color: "#111827" }}>Strengths</h3>
            <ul style={{ paddingLeft: "1.25rem", fontSize: "0.875rem", color: "#374151" }}>
              {review.data.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 600, color: "#111827" }}>Before you submit</h3>
            <ul style={{ paddingLeft: "1.25rem", fontSize: "0.875rem", color: "#374151" }}>
              {review.data.improvements.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}