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
    <nav className="navbar">
      <div className="container" style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="nav-links" style={{ alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: 700 }}>CivicConnect</Link>
          <Link to="/">Home</Link>
          {token && role === "citizen" && <Link to="/create-issue">Create Issue</Link>}
          {token && role === "government" && <Link to="/dashboard">Dashboard</Link>}
        </div>
        <div className="nav-links">
          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/register">Register</Link>}
          {token && <button className="button blue" onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}
