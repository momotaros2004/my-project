import { useLocation, useNavigate } from "react-router-dom";
import "./Recommend2.css";

export default function Recommend2() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="rec-container">
        <h2>ไม่มีข้อมูลที่เลือกมา</h2>
        <button onClick={() => navigate("/home2")}>กลับไปเลือกใหม่</button>
      </div>
    );
  }

  const { cpu, gpu, ram, storage } = state;

  return (
    <div className="rec-container">
      <div className="rec-card">
        <h1 className="title">✔ สรุปสเปคที่คุณเลือก</h1>

        <div className="summary-box">
          <p><strong>CPU:</strong> {cpu}</p>
          <p><strong>GPU:</strong> {gpu}</p>
          <p><strong>RAM:</strong> {ram}</p>
          <p><strong>Storage:</strong> {storage}</p>
        </div>

        <button className="back-btn" onClick={() => navigate("/home2")}>
          🔙 เลือกใหม่
        </button>
      </div>
    </div>
  );
}
