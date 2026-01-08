import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/authStore";

export default function ProtectedRoute({ children, roles }: any) {
  const user = useUserStore(state => state.userData);

  if (!user) return <Navigate to="/auth/login" replace />;

  if (roles && !roles.includes(user.role?.[0]?.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
