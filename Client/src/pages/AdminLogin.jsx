import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import '../App.css';
import registerBg from '../assets/register.png';

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
    <div style={{ maxWidth: "100%", height: "100vh", textAlign:"center"}}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, padding: 0 }}>
        <div style={{ alignContent: "center", padding: "8%" }}>
          <h1 style={{ marginBottom: "2.5%" }}>Admin Login</h1>
          <p className="text-muted" style={{ marginBottom: "10%" }}>Welcome to Government Portal</p>
          {error && <div className="badge danger" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
              </span>
              <input className="form-input" type="text" placeholder="Enter Admin Email Address" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>

            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input className="form-input" type="password" placeholder="Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button className="button blue" type="submit" style={{ width: "100%", marginTop: 12 }}>Sign in</button>
            <div style={{ marginTop: "5%", marginBottom: "2.5%", textAlign: "center", fontWeight: "bold", fontSize: "large" }}>
              <span ><a href="/login" style={{ textDecoration: "none" }}>Citizen Login</a></span>
            </div>
          </form>
        </div>


        <div style={{
          position: 'relative',
          height: '100vh',
          margin: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${registerBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            opacity: 0.2, 
            zIndex: -1,  
          }} />

          <div style={{
            height: '100%',
            color: 'black',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <h1 style={{ marginBottom: '1%' }}>Authority Portal</h1>
            <p style={{ opacity: 0.9, marginBottom: '8%' }}>
              (Review, update, and respond to issues officially)
            </p>
            <ul style={{
              justifyItems:'left',
              marginLeft: 16,
              listStyle: 'disc', 
              opacity: 0.95
            }}>
              <li style={{ marginBottom: 16 }}>Manage all issues</li>
              <li style={{ marginBottom: 16 }}>Post official responses</li>
              <li style={{ marginBottom: 16 }}>Update statuses</li>
            </ul>
          </div>

        </div>
      </div >
    </div >
  );
}


