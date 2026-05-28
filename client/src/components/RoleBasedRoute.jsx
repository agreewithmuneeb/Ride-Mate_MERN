import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAllowedRole } from "../utils/auth";

export default function RoleBasedRoute({ allowedRoles }) {
  const { user } = useAuth();
  if (!isAllowedRole(user, allowedRoles)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
