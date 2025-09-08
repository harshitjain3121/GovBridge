import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("citizen");
  const navigate = useNavigate();
  const location = useLocation();
  const forceGovernment = location.pathname.includes("/admin-login");

  useEffect(() => {
    if (forceGovernment) {
      setActiveRole("government");
    }
  }, [forceGovernment]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      
      // Fetch user details to get role
      try {
        const userRes = await API.get(`/users/${res.data.id}`);
        const actualRole = userRes.data.user.role;
        localStorage.setItem("role", actualRole);
        // If user selected Admin but role mismatch, show error
        if (activeRole === "government" && actualRole !== "government") {
          setError("This account is not an Admin account.");
          return;
        }
      } catch (userErr) {
        console.error("Failed to fetch user role:", userErr);
      }
      
      const from = location.state?.from?.pathname;
      if (activeRole === "government") {
        navigate("/dashboard", { replace: true });
      } else if (from) {
        navigate(from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40 }}>
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, padding: 0 }}>
        <div style={{ padding: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Sign in</h1>
          <p className="text-muted" style={{ marginBottom: 16 }}>Welcome back. Choose your portal and continue.</p>

          {!forceGovernment ? (
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                type="button"
                className={`button ${activeRole === "citizen" ? "blue" : ""}`}
                onClick={() => setActiveRole("citizen")}
              >
                Citizen Portal
              </button>
              <button
                type="button"
                className={`button ${activeRole === "government" ? "blue" : ""}`}
                onClick={() => setActiveRole("government")}
              >
                Admin Portal
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <span className="badge" style={{ background: "#0f67ff", color: "#fff" }}>Admin Portal</span>
            </div>
          )}

          {error && <div className="badge danger" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <label className="text-muted">Email or Phone</label>
            <input
              className="input"
              type="text"
              placeholder="you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <label className="text-muted">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="button blue" type="submit" style={{ width: "100%", marginTop: 12 }}>Continue</button>
          </form>
        </div>
        <div style={{ background: "linear-gradient(135deg, #0f67ff 0%, #63a4ff 100%)", color: "#fff", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ marginBottom: 8 }}>GovBridge Access</h2>
          <p style={{ opacity: 0.9, marginBottom: 12 }}>
            Secure access for citizens and administrators. Manage issues, track progress, and respond officially.
          </p>
          <ul style={{ marginLeft: 16, opacity: 0.95 }}>
            <li>Citizens: create and upvote issues</li>
            <li>Admins: review, update status, and post official responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
