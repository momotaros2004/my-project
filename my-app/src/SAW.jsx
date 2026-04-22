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

  // 🔥 popup state
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });

    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 2000);
  };

  const handleNext = async () => {
    if (!performance || !price || !upgrade || !efficiency) {
      showPopup("error", "⚠ กรุณาเลือก weight ให้ครบ");
      return;
    }

    const sum =
      Number(performance) +
      Number(price) +
      Number(upgrade) +
      Number(efficiency);

    // 🔥 ต้องรวม = 1
    if (sum !== 1) {
      showPopup("error", `⚠ ผลรวมต้องเท่ากับ 1 (ตอนนี้ = ${sum})`);
      return;
    }

    const token = localStorage.getItem("token");

    const weightData = {
      performance: Number(performance),
      price: Number(price),
      upgrade: Number(upgrade),
      efficiency: Number(efficiency),
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/saw/calc",
        { weights: weightData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "saw_results",
        JSON.stringify(res.data.results)
      );

      showPopup("success", "✅ คำนวณสำเร็จ");

      setTimeout(() => {
        navigate("/SAWResult");
      }, 1000);

    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        showPopup("error", "❌ Session หมดอายุ กรุณา login ใหม่");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {
        showPopup("error", "❌ เกิดข้อผิดพลาด");
      }
    }
  };

  return (
    <div className="saw-container">

      {/* 🔥 POPUP */}
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      <div className="saw-box">
        <h2>SAW</h2>

        {["performance", "price", "upgrade", "efficiency"].map((k, i) => (
          <select
            key={i}
            onChange={(e) => {
              if (k === "performance") setPerformance(e.target.value);
              if (k === "price") setPrice(e.target.value);
              if (k === "upgrade") setUpgrade(e.target.value);
              if (k === "efficiency") setEfficiency(e.target.value);
            }}
          >
            <option value="">เลือก {k}</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
          </select>
        ))}

        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default SAW;