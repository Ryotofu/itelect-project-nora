interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  activeTab: "ai-review" | "courses";
  onTabChange: (tab: "ai-review" | "courses") => void;
  courseCount: number;
}

export default function Navbar({
  isLoggedIn,
  onLogout,
  activeTab,
  onTabChange,
  courseCount,
}: NavbarProps) {
  return (
    <header style={{ backgroundColor: "#1e293b", borderBottom: "1px solid #334155", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* LOGO & BRAND */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "grid",
            placeItems: "center",
            fontSize: "1.25rem",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)"
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              ITELECT4 <span style={{ color: "#60a5fa" }}>AI Hub</span>
            </h1>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Gemini Integration & Course Portal
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS & AUTH STATUS */}
        {isLoggedIn && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", backgroundColor: "#0f172a", padding: "4px", borderRadius: "8px", border: "1px solid #334155" }}>
              <button
                type="button"
                onClick={() => onTabChange("ai-review")}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: activeTab === "ai-review" ? "#2563eb" : "transparent",
                  color: activeTab === "ai-review" ? "#ffffff" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                ✨ AI Review
              </button>

              <button
                type="button"
                onClick={() => onTabChange("courses")}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: activeTab === "courses" ? "#2563eb" : "transparent",
                  color: activeTab === "courses" ? "#ffffff" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                📚 Catalog ({courseCount})
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "1px solid #334155", paddingLeft: "1rem" }}>
              <span style={{
                backgroundColor: "#166534",
                color: "#86efac",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80" }}></span>
                Online
              </span>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: "0.45rem 0.85rem",
                  backgroundColor: "#334155",
                  color: "#f8fafc",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}