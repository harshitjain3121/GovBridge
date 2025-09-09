import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      try {
        const userRes = await API.get(`/users/${res.data.id}`);
        const actualRole = userRes.data.user.role;
        if (actualRole !== "government") {
          setError("This account is not an Admin account.");
          return;
        }
        localStorage.setItem("role", actualRole);
      } catch (userErr) {
        console.error("Failed to fetch user role:", userErr);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40 }}>
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, padding: 0 }}>
        <div style={{ padding: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Admin Login</h1>
          <p className="text-muted" style={{ marginBottom: 16 }}>Government portal access only.</p>
          {error && <div className="badge danger" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <label className="text-muted">Email or Phone</label>
            <input className="input" type="text" placeholder="you@gov.in" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            <label className="text-muted">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="button blue" type="submit" style={{ width: "100%", marginTop: 12 }}>Sign in</button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <span className="text-muted">Need a citizen account? </span>
              <a href="/register">Register</a>
            </div>
          </form>
        </div>
        <div style={{ background: "linear-gradient(135deg, #0f67ff 0%, #63a4ff 100%)", color: "#fff", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ marginBottom: 8 }}>Admin Portal</h2>
          <p style={{ opacity: 0.9, marginBottom: 12 }}>Review, update, and respond to issues officially.</p>
          <ul style={{ marginLeft: 16, opacity: 0.95 }}>
            <li>Manage all issues</li>
            <li>Post official responses</li>
            <li>Update statuses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


