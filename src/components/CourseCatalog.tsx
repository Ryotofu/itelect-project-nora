import { useState } from "react";
import type { Course, Submission } from "../types";
import { getSubmissions } from "../api/submissions";
import SubmissionFormModal from "./SubmissionFormModal";

interface CourseCatalogProps {
  courses: Course[];
}

export default function CourseCatalog({ courses }: CourseCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [submissions, setSubmissions] = useState<Submission[]>(getSubmissions());
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(
    courses[0]?.code || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem =
      selectedSemester === "all" || course.semester === selectedSemester;
    return matchesSearch && matchesSem;
  });

  const activeCourse = courses.find((c) => c.code === selectedCourseCode) || filteredCourses[0] || courses[0];

  const activeSubmissions = submissions.filter(
    (s) => s.courseCode === activeCourse?.code
  );

  const handleSubmissionAdded = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* MAIN CATALOG CONTAINER */}
      <div style={{ backgroundColor: "#1e293b", padding: "1.75rem", borderRadius: "12px", border: "1px solid #334155" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc" }}>
              Course Catalog
            </h2>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "#94a3b8" }}>
              Browse enrolled IT Elective subjects and view student project submissions.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", flex: 1, maxWidth: "600px", justifyContent: "flex-end", alignItems: "center" }}>
            {/* SEARCH & SEMESTER FILTERS */}
            <input
              type="text"
              placeholder="Search course code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: "160px",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                border: "1px solid #475569",
                color: "#fff",
                fontSize: "0.875rem"
              }}
            />

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                border: "1px solid #475569",
                color: "#fff",
                fontSize: "0.875rem",
                cursor: "pointer"
              }}
            >
              <option value="all">All Semesters</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                borderRadius: "6px",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + Submit GitHub Repo
            </button>
          </div>
        </div>

        {/* COURSE CARDS GRID */}
        {filteredCourses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px dashed #334155" }}>
            <p style={{ margin: 0, color: "#94a3b8" }}>No courses matched your search criteria.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {filteredCourses.map((c) => {
              const count = submissions.filter((s) => s.courseCode === c.code).length;
              const isSelected = activeCourse?.code === c.code;

              return (
                <div
                  key={c.code}
                  onClick={() => setSelectedCourseCode(c.code)}
                  style={{
                    padding: "1.25rem",
                    backgroundColor: isSelected ? "#0f172a" : "#0f172a",
                    borderRadius: "10px",
                    border: isSelected ? "2px solid #3b82f6" : "1px solid #334155",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "border 0.2s ease"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#60a5fa", letterSpacing: "0.05em" }}>
                        {c.code}
                      </span>
                      <span style={{ backgroundColor: "#1e293b", color: "#cbd5e1", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", border: "1px solid #334155" }}>
                        {c.units} Units
                      </span>
                    </div>

                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#f8fafc", lineHeight: 1.3 }}>
                      {c.title}
                    </h3>
                  </div>

                  <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#94a3b8" }}>
                    <span>Term: {c.semester || "Regular"}</span>
                    <span style={{ color: count > 0 ? "#38bdf8" : "#64748b", fontWeight: 600 }}>
                      {count} {count === 1 ? "Repo" : "Repos"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUBMISSIONS LIST FOR SELECTED COURSE */}
      {activeCourse && (
        <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#f8fafc", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Submitted Repositories for</span>
              <span style={{ color: "#60a5fa" }}>{activeCourse.code}</span>
            </h3>
          </div>

          {activeSubmissions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#64748b", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px dashed #334155" }}>
              <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem" }}>
                No GitHub submissions recorded for {activeCourse.code} yet.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: "0.45rem 0.9rem",
                  backgroundColor: "#1e293b",
                  color: "#38bdf8",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                + Add submission for this course
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {activeSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    padding: "1rem 1.25rem",
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "1rem", color: "#f8fafc", fontWeight: 600 }}>
                      {sub.title}
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Submitted {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <a
                    href={sub.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.85rem",
                      backgroundColor: "#1e293b",
                      color: "#38bdf8",
                      border: "1px solid #0284c7",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <span>View Repository ↗</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBMISSION FORM MODAL */}
      <SubmissionFormModal
        courses={courses}
        initialCourseCode={activeCourse?.code}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSubmissionAdded}
      />
    </div>
  );
}