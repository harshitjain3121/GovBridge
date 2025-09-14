import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="nav-links" style={{ alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: 700 }}>GovBridge</Link>
          <Link to="/">Home</Link>
          {token && role === "citizen" && <Link to="/create-issue">Create Issue</Link>}
          {token && role === "government" && <Link to="/dashboard">Dashboard</Link>}
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {currentUser && <NotificationBell />}
          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/admin-login">Admin Login</Link>}
          {!token && <Link to="/register">Register</Link>}
          {token && <button className="button blue" onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}
