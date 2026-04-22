import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Recommend2.css";

export default function Recommend2() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const com = state?.com;

  // 🔐 กันไม่ login เข้า
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ❌ ไม่มีข้อมูล (หรือ refresh แล้ว state หาย)
  if (!com) {
    return (
      <div className="rec-container">
        <h2>❌ ไม่มีข้อมูล หรือรีเฟรชหน้า</h2>

        <button onClick={() => navigate("/home2")}>
          🔙 กลับ
        </button>
      </div>
    );
  }

  return (
    <div className="rec-container">
      <div className="rec-card">

        <h1>✅ สำเร็จ</h1>

        <p>ชื่อเครื่อง: {com.name}</p>
        <p>CPU: {com.cpu}</p>
        <p>GPU: {com.gpu}</p>
        <p>RAM: {com.ram}</p>
        <p>Storage: {com.storage}</p>
        <p>ราคา: {Number(com.price).toLocaleString()} บาท</p>
        <p>Tier: {com.tier}</p>

        <button onClick={() => navigate("/home2")}>
          🔙 เลือกใหม่
        </button>
      </div>
    </div>
  );
}