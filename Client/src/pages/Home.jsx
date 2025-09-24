import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import IssueList from "../components/IssueList";

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [layout, setLayout] = useState("list"); // 'list' | 'grid'
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

  const categories = useMemo(() => {
    const set = new Set();
    issues.forEach((i) => i.category && set.add(i.category));
    return ["all", ...Array.from(set)];
  }, [issues]);

  const filteredIssues = useMemo(() => {
    let result = issues;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(i => i.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter(i => i.category === categoryFilter);
    }

    switch (sortBy) {
      case "newest":
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "mostUpvoted":
        result = [...result].sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
        break;
      default:
        break;
    }

    return result;
  }, [issues, query, statusFilter, categoryFilter, sortBy]);

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

      {/* Controls */}
      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16
      }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          <div className="input-wrapper" style={{ maxWidth: 380 }}>
            <span className="input-icon">🔎</span>
            <input
              className="form-input"
              type="text"
              placeholder="Search issues..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--color-border)" }}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--color-border)" }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--color-border)" }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostUpvoted">Most upvoted</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setLayout("list")}
            aria-label="List layout"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: layout === "list" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: layout === "list" ? "#eff6ff" : "#fff",
              cursor: "pointer"
            }}
          >
            📋 List
          </button>
          <button
            type="button"
            onClick={() => setLayout("grid")}
            aria-label="Grid layout"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: layout === "grid" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: layout === "grid" ? "#eff6ff" : "#fff",
              cursor: "pointer"
            }}
          >
            🧱 Grid
          </button>
        </div>
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
        filteredIssues.length > 0 ? (
          <IssueList issues={filteredIssues} onIssuesUpdate={setIssues} layout={layout} />
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
