import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ ยังไม่ login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ login แล้ว
  return children;
}

export default ProtectedRoute;