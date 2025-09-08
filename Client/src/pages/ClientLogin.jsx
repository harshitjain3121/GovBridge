import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api/axios";

export default function ClientLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      try {
        const userRes = await API.get(`/users/${res.data.id}`);
        const actualRole = userRes.data.user.role;
        localStorage.setItem("role", actualRole);
      } catch (userErr) {
        console.error("Failed to fetch user role:", userErr);
      }
      const from = location.state?.from?.pathname;
      navigate(from || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40 }}>
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, padding: 0 }}>
        <div style={{ padding: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Sign in (Citizen)</h1>
          <p className="text-muted" style={{ marginBottom: 16 }}>Welcome back to GovBridge.</p>
          {error && <div className="badge danger" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <label className="text-muted">Email or Phone</label>
            <input className="input" type="text" placeholder="you@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            <label className="text-muted">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="button blue" type="submit" style={{ width: "100%", marginTop: 12 }}>Continue</button>
          </form>
          <div style={{ marginTop: 12 }}>
            <span className="text-muted">Administrator? </span>
            <Link to="/admin-login">Go to Admin Login</Link>
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #0f67ff 0%, #63a4ff 100%)", color: "#fff", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ marginBottom: 8 }}>Citizen Portal</h2>
          <p style={{ opacity: 0.9, marginBottom: 12 }}>Report and track issues in your community.</p>
          <ul style={{ marginLeft: 16, opacity: 0.95 }}>
            <li>Create issues</li>
            <li>Upvote and comment</li>
            <li>Follow official responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


