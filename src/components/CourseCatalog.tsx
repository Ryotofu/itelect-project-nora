import { useState } from "react";
import type { Course } from "../types";

interface CourseCatalogProps {
  courses: Course[];
}

export default function CourseCatalog({ courses }: CourseCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem =
      selectedSemester === "all" || course.semester === selectedSemester;
    return matchesSearch && matchesSem;
  });

  return (
    <div style={{ backgroundColor: "#1e293b", padding: "1.75rem", borderRadius: "12px", border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc" }}>
            Course Catalog
          </h2>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "#94a3b8" }}>
            Browse enrolled IT Elective subjects and curriculum modules.
          </p>
        </div>

        {/* SEARCH & SEMESTER FILTERS */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", flex: 1, maxWidth: "500px", justifyContent: "flex-end" }}>
          <input
            type="text"
            placeholder="Search course code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: "180px",
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
        </div>
      </div>

      {/* COURSE CARDS GRID */}
      {filteredCourses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px dashed #334155" }}>
          <p style={{ margin: 0, color: "#94a3b8" }}>No courses matched your search criteria.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {filteredCourses.map((c) => (
            <div
              key={c.code}
              style={{
                padding: "1.25rem",
                backgroundColor: "#0f172a",
                borderRadius: "10px",
                border: "1px solid #334155",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
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
                <span style={{ color: "#22c55e" }}>✓ Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}