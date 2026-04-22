import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home2.css";

function Home2() {
  const navigate = useNavigate();

  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 protect page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    setError("");

    if (!cpu || !gpu || !ram || !storage) {
      setError("⚠ กรุณาเลือกข้อมูลให้ครบ");
      return;
    }

    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/check-com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔐 ADD
        },
        body: JSON.stringify({ cpu, gpu, ram, storage }),
      });

      const data = await res.json();

      if (data.found) {
        navigate("/recommend2", {
          state: {
            success: true,
            com: data.data,
          },
        });
      } else {
        setError("❌ ของหมด / ไม่มีสเปคนี้ในระบบ");
      }
    } catch (err) {
      setError("เซิร์ฟเวอร์ไม่ตอบสนอง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pc-container">
      <div className="pc-card">
        <h1 className="title">เลือกสเปคคอม</h1>

        {error && <p className="error-box">{error}</p>}

        <select value={cpu} onChange={(e) => setCpu(e.target.value)}>
          <option value="">CPU</option>
          <option value="Intel i3-12100">Intel i3-12100</option>
          <option value="Intel i5-12400">Intel i5-12400</option>
          <option value="Ryzen 5 5600">Ryzen 5 5600</option>
        </select>

        <select value={gpu} onChange={(e) => setGpu(e.target.value)}>
          <option value="">GPU</option>
          <option value="GTX 1650">GTX 1650</option>
          <option value="RTX 3060">RTX 3060</option>
          <option value="RTX 4070">RTX 4070</option>
        </select>

        <select value={ram} onChange={(e) => setRam(e.target.value)}>
          <option value="">RAM</option>
          <option value="8 GB">8 GB</option>
          <option value="16 GB">16 GB</option>
          <option value="32 GB">32 GB</option>
        </select>

        <select value={storage} onChange={(e) => setStorage(e.target.value)}>
          <option value="">Storage</option>
          <option value="SSD 512GB">SSD 512GB</option>
          <option value="SSD 1TB">SSD 1TB</option>
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "กำลังตรวจสอบ..." : "✔ ตรวจสอบ"}
        </button>
      </div>
    </div>
  );
}

export default Home2;