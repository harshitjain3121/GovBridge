import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
      {token && role === "citizen" && <Link to="/create-issue" style={{ marginRight: "15px" }}>Create Issue</Link>}
      {token && role === "government" && <Link to="/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>}
      {!token && <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>}
      {!token && <Link to="/register" style={{ marginRight: "15px" }}>Register</Link>}
      {token && <button onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</button>}
    </nav>
  );
}
