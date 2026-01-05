import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  console.log("Home");
  
  useEffect(() => {
    const userRole = localStorage.getItem("user-role");
    const username = localStorage.getItem("username");
    const isAuthenticated = localStorage.getItem("is-authenticated");
    const token = localStorage.getItem("token");

    if (isAuthenticated === "true") {
      navigate(`/dashboard`, { replace: true });
    } else {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);

  return <></>;
}
