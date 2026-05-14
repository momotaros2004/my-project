import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

<<<<<<< HEAD
  // ❌ ยังไม่ login → เด้งไปหน้า login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ login แล้ว → เข้าได้
  return children;
}

export default ProtectedRoute;
=======
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
