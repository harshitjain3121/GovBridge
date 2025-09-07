import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import IssueList from "../components/IssueList";

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is logged in (token exists)
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const fetchIssues = async () => {
    try {
  const res = await API.get("/issues");
      setIssues(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load issues. Please try again later.");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="container" style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem", background: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>All Issues</h1>
      {isLoggedIn && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/create-issue")}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.75rem 1.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}
          >
            + Create Issue
          </button>
        </div>
      )}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
          <div className="spinner" style={{ width: 40, height: 40, border: "4px solid #ccc", borderTop: "4px solid #007bff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}</style>
        </div>
      )}
      {error && (
        <div style={{ color: "#d32f2f", background: "#fff0f0", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", textAlign: "center" }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        issues.length > 0 ? (
          <IssueList issues={issues} />
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>No issues found.</p>
        )
      )}
    </div>
  );
}
