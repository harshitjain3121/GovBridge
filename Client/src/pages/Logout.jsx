import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {   // <-- Must be default
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  }, [navigate]);

  return <p>Logging out...</p>;
}
