import { useLocation, useNavigate } from "react-router-dom";
import "./Recommend2.css";

export default function Recommend2() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.com) {
    return (
      <div className="rec-container">
        <h2>❌ ไม่มีข้อมูล</h2>
        <button onClick={() => navigate("/home2")}>กลับ</button>
      </div>
    );
  }

  const { com } = state;

  return (
    <div className="rec-container">
      <div className="rec-card">

        <h1>✅ สำเร็จ</h1>

        <p>ชื่อเครื่อง: {com.name}</p>
        <p>CPU: {com.cpu}</p>
        <p>GPU: {com.gpu}</p>
        <p>RAM: {com.ram}</p>
        <p>Storage: {com.storage}</p>
        <p>ราคา: {com.price} บาท</p>
        <p>Tier: {com.tier}</p>

        <button onClick={() => navigate("/home2")}>
          🔙 เลือกใหม่
        </button>
      </div>
    </div>
  );
}
