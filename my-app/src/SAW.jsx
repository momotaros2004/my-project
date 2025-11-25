import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SAW.css";

function SAW() {
  const navigate = useNavigate();

  const [performance, setPerformance] = useState("");
  const [price, setPrice] = useState("");
  const [upgrade, setUpgrade] = useState("");
  const [efficiency, setEfficiency] = useState("");

  // ================== Submit SAW ==================
  const handleNext = async () => {
    if (!performance || !price || !upgrade || !efficiency) {
      alert("⚠️ กรุณาเลือกน้ำหนักให้ครบทุกข้อ");
      return;
    }

    const total =
      Number(performance) +
      Number(price) +
      Number(upgrade) +
      Number(efficiency);

    if (total > 1) {
      alert("⚠️ ค่าน้ำหนักรวมต้องไม่เกิน 1");
      return;
    }

    const weightData = {
      performance: Number(performance),
      price: Number(price),
      upgrade: Number(upgrade),
      efficiency: Number(efficiency),
    };

    try {
      // ส่งไป Backend คำนวณ SAW
      const res = await axios.post("http://localhost:5000/saw/calc", {
        weights: weightData,
      });

      // บันทึกข้อมูลใน localStorage
      localStorage.setItem("saw_results", JSON.stringify(res.data.results));
      localStorage.setItem("saw_weights", JSON.stringify(weightData));

      // ไปหน้าผลลัพธ์
      navigate("/sawresult");

    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการคำนวณ SAW");
    }
  };

  return (
    <div className="saw-container">
      <div className="saw-box">
        <h2>SAW</h2>
        <p>โปรดใส่ค่าน้ำหนักที่สะท้อนความสำคัญในการเลือกคอมพิวเตอร์ของคุณ</p>

        {/* Performance */}
        <div className="saw-item">
          <label>Performance (ประสิทธิภาพ)</label>
          <select value={performance} onChange={(e) => setPerformance(e.target.value)}>
            <option value="">-- เลือกค่า --</option>
            <option value="0.25">0.25</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
            <option value="0.5">0.5</option>
            <option value="0.6">0.6</option>
            <option value="0.7">0.7</option>
          </select>
        </div>

        {/* Price */}
        <div className="saw-item">
          <label>Price (ราคา)</label>
          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">-- เลือกค่า --</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.25">0.25</option>
            <option value="0.3">0.3</option>
            <option value="0.35">0.35</option>
            <option value="0.4">0.4</option>
          </select>
        </div>

        {/* Upgrade */}
        <div className="saw-item">
          <label>Upgrade (อัปเกรดได้)</label>
          <select value={upgrade} onChange={(e) => setUpgrade(e.target.value)}>
            <option value="">-- เลือกค่า --</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.25">0.25</option>
            <option value="0.3">0.3</option>
            <option value="0.35">0.35</option>
            <option value="0.4">0.4</option>
          </select>
        </div>

        {/* Efficiency */}
        <div className="saw-item">
          <label>Efficiency (ประหยัดพลังงาน)</label>
          <select value={efficiency} onChange={(e) => setEfficiency(e.target.value)}>
            <option value="">-- เลือกค่า --</option>
            <option value="0.1">0.1</option>
            <option value="0.125">0.125</option>
            <option value="0.2">0.2</option>
            <option value="0.25">0.25</option>
          </select>
        </div>

        <button className="next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default SAW;
