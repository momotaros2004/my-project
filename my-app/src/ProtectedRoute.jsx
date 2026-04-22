import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ ยังไม่ login → เด้งไปหน้า login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ login แล้ว → เข้าได้
  return children;
}

export default ProtectedRoute;