import React, { useEffect, useState } from "react";
import { getCourses } from "./api/courses";
import { loginUser, registerUser, logoutUser } from "./api/auth";
import type { Course } from "./types";
import Navbar from "./components/Navbar";
import CourseCatalog from "./components/CourseCatalog";
import ReviewPage from "./pages/ReviewPage";
import useToggle from "./hooks/useToggle";

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"ai-review" | "courses">("ai-review");

  // Auth States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, toggleRegistering] = useToggle(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [error, setError] = useState("");

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await registerUser({ username: username || email.split("@")[0], email, password });
      } else {
        await loginUser({ email, password });
      }
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        courseCount={courses.length}
      />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {!isLoggedIn ? (
          <div style={{ maxWidth: "420px", margin: "3rem auto", padding: "2rem", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)" }}>
            <h2 style={{ margin: "0 0 0.35rem 0", fontSize: "1.5rem", fontWeight: 700 }}>
              {isRegistering ? "Create Account" : "Sign In"}
            </h2>
            <p style={{ margin: "0 0 1.5rem 0", color: "#94a3b8", fontSize: "0.875rem" }}>
              {isRegistering ? "Register to access Gemini AI features." : "Log in with your test student credentials."}
            </p>

            {error && (
              <div style={{ padding: "0.75rem", marginBottom: "1rem", backgroundColor: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", borderRadius: "6px", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {isRegistering && (
                <div>
                  <label htmlFor="username" style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.25rem", fontWeight: 500 }}>Username</label>
                  <input id="username" type="text" placeholder="student_dev" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", backgroundColor: "#0f172a", border: "1px solid #475569", color: "#fff", boxSizing: "border-box" }} />
                </div>
              )}

              <div>
                <label htmlFor="email" style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.25rem", fontWeight: 500 }}>Email</label>
                <input id="email" type="email" placeholder="student@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", backgroundColor: "#0f172a", border: "1px solid #475569", color: "#fff", boxSizing: "border-box" }} />
              </div>

              <div>
                <label htmlFor="password" style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.25rem", fontWeight: 500 }}>Password</label>
                <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", backgroundColor: "#0f172a", border: "1px solid #475569", color: "#fff", boxSizing: "border-box" }} />
              </div>

              <button type="submit" style={{ padding: "0.75rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" }}>
                {isRegistering ? "Register Account" : "Sign In"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", marginTop: "1.25rem", marginBottom: 0 }}>
              {isRegistering ? "Already registered? " : "Need an account? "}
              <button type="button" onClick={() => { toggleRegistering(); setError(""); }} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", textDecoration: "underline", fontWeight: 500 }}>
                {isRegistering ? "Sign in" : "Register here"}
              </button>
            </p>
          </div>
        ) : (
          <div>
            {activeTab === "ai-review" && (
              <div style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "12px", border: "1px solid #334155" }}>
                <ReviewPage />
              </div>
            )}

            {activeTab === "courses" && (
              <CourseCatalog courses={courses} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}