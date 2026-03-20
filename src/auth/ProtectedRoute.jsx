import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "./auth";

export default function ProtectedRoute({ allowRoles }) {
  const auth = getAuth();

  if (!auth) return <Navigate to="/login" replace />;

  if (allowRoles?.length && !allowRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}