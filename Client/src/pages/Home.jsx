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
    <div className="container" style={{ maxWidth: "1200px", margin: "2rem auto", padding: "2rem" }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "3rem",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)",
        borderRadius: "20px",
        color: "white",
        boxShadow: "var(--shadow-xl)",
        position: "relative",
        overflow: "hidden"
      }}>
        <h1 style={{ 
          margin: "0 0 1rem 0", 
          fontSize: "2.5rem",
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          Community Issues
        </h1>
        <p style={{
          fontSize: "1.1rem",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto 1.5rem auto"
        }}>
          Report and track community issues. Your voice matters in building a better neighborhood.
        </p>
        
        {isLoggedIn && (
          <button
            onClick={() => navigate("/create-issue")}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "#fff",
              border: "2px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "12px",
              padding: "1rem 2rem",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.25)";
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.15)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
            }}
          >
            📝 Create New Issue
          </button>
        )}
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
          <div className="spinner" style={{ width: 40, height: 40, border: "4px solid var(--color-border)", borderTop: "4px solid var(--color-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}</style>
        </div>
      )}
      {error && (
        <div style={{ color: "var(--color-danger)", background: "#fef2f2", padding: "1rem", borderRadius: "12px", marginBottom: "1rem", textAlign: "center", border: "1px solid #fee2e2" }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        issues.length > 0 ? (
          <IssueList issues={issues} onIssuesUpdate={setIssues} />
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            background: "var(--color-surface)",
            borderRadius: "16px",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3 style={{ color: "var(--color-muted)", marginBottom: "8px", fontSize: "18px" }}>
              No Issues Found
            </h3>
            <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
              There are currently no issues to display. Check back later or create a new issue.
            </p>
          </div>
        )
      )}
    </div>
  );
}
