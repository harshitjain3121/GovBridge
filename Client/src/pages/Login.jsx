import React, { useState } from "react";
import API from "../api/axios";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      
      // Fetch user details to get role
      try {
        const userRes = await API.get(`/users/${res.data.id}`);
        localStorage.setItem("role", userRes.data.user.role);
      } catch (userErr) {
        console.error("Failed to fetch user role:", userErr);
      }
      
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          className="input"
          type="text"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button blue" type="submit">Login</button>
      </form>
    </div>
  );
}
