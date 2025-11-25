import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home2.css";

function Home2() {
  const navigate = useNavigate();

  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [error, setError] = useState(""); // <-- เพิ่ม state สำหรับข้อความเตือน

  const handleSubmit = () => {
    if (!cpu || !gpu || !ram || !storage) {
      setError("⚠ กรุณาเลือกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setError(""); // เคลียร์ก่อนส่งข้อมูล

    navigate("/recommend2", {
      state: { cpu, gpu, ram, storage },
    });
  };

  return (
    <div className="pc-container">
      <div className="pc-card">
        <h1 className="title">เลือกสเปคคอมที่คุณต้องการ</h1>

        {/* กล่องแสดงข้อความเตือน */}
        {error && <p className="error-box">{error}</p>}

        <div className="select-group">
          <label>เลือก CPU</label>
          <select value={cpu} onChange={(e) => setCpu(e.target.value)}>
            <option value="">-- เลือก CPU --</option>
            <option value="Intel i3 12th Gen">Intel i3 12th Gen</option>
            <option value="Intel i5 12th Gen">Intel i5 12th Gen</option>
            <option value="Intel i7 12th Gen">Intel i7 12th Gen</option>
            <option value="Ryzen 3">AMD Ryzen 3</option>
            <option value="Ryzen 5">AMD Ryzen 5</option>
            <option value="Ryzen 7">AMD Ryzen 7</option>
          </select>
        </div>

        <div className="select-group">
          <label>เลือกการ์ดจอ (GPU)</label>
          <select value={gpu} onChange={(e) => setGpu(e.target.value)}>
            <option value="">-- เลือก GPU --</option>
            <option value="GTX 1650">GTX 1650</option>
            <option value="RTX 3050">RTX 3050</option>
            <option value="RTX 3060">RTX 3060</option>
            <option value="RTX 4060">RTX 4060</option>
            <option value="RTX 4070">RTX 4070</option>
          </select>
        </div>

        <div className="select-group">
          <label>เลือก RAM</label>
          <select value={ram} onChange={(e) => setRam(e.target.value)}>
            <option value="">-- เลือก RAM --</option>
            <option value="8GB">8GB</option>
            <option value="16GB">16GB</option>
            <option value="32GB">32GB</option>
            <option value="64GB">64GB</option>
          </select>
        </div>

        <div className="select-group">
          <label>เลือก Storage</label>
          <select value={storage} onChange={(e) => setStorage(e.target.value)}>
            <option value="">-- เลือก Storage --</option>
            <option value="SSD 256GB">SSD 256GB</option>
            <option value="SSD 512GB">SSD 512GB</option>
            <option value="SSD 1TB">SSD 1TB</option>
            <option value="HDD 1TB">HDD 1TB</option>
          </select>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          ✔ บันทึกสเปคที่เลือก
        </button>
      </div>
    </div>
  );
}

export default Home2;

