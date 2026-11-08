import { Navigate } from "react-router-dom";
import { isAdminUser } from "./auth";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");

  // ❌ ยังไม่ login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdminUser()) {
    return <Navigate to="/beforehome" replace />;
  }

  // ✅ login แล้ว
  return children;
}

export default ProtectedRoute;
