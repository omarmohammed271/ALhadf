import { useUserStore } from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  console.log("Home");
  
  const userData = useUserStore((state) => state.userData);
  useEffect(() => {

    if (userData.isLogged === true) {
      navigate(`/dashboard`, { replace: true });
    } else {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);

  return <></>;
}
