import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/authStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[]; // list of allowed roles
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useUserStore(state => state.userData);

  if (!user) return <Navigate to="/auth/login" replace />;

  // If roles are defined, check if user has at least one matching role (case-insensitive)
  if (
    roles &&
    !user.role.some((r: string) => roles.some(role => role.toLowerCase() === r.toLowerCase()))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
