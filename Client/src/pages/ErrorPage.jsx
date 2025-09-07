import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Oops! Page not found.</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
