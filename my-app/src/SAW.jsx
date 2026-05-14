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

<<<<<<< HEAD
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
=======
  const p = Number(performance || 0);
  const pr = Number(price || 0);
  const u = Number(upgrade || 0);
  const e = Number(efficiency || 0);

  const total = +(p + pr + u + e).toFixed(2);

  const handleNext = async () => {
    if (!performance || !price || !upgrade || !efficiency) {
      alert("⚠️ กรุณาเลือก weight ให้ครบ");
      return;
    }

    if (total !== 1) {
      alert(`❌ ผลรวม weight ต้องเท่ากับ 1\nตอนนี้ได้ = ${total}`);
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
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
<<<<<<< HEAD
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
=======
      performance: p,
      price: pr,
      upgrade: u,
      efficiency: e,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/saw/filter", {
        cart,
        weights: weightData,
      });

      localStorage.setItem("saw_results", JSON.stringify(res.data));
      navigate("/sawresult");
    } catch (err) {
      console.log(err);
      alert("Server error");
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
    }
  };

  return (
    <div className="saw-container">
<<<<<<< HEAD

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
=======
      <div className="saw-box">
        <h2>SAW WEIGHT</h2>

        <select onChange={(e) => setPerformance(e.target.value)}>
          <option value="">Performance</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>

        <select onChange={(e) => setPrice(e.target.value)}>
          <option value="">Price</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>

        <select onChange={(e) => setUpgrade(e.target.value)}>
          <option value="">Upgrade</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>

        <select onChange={(e) => setEfficiency(e.target.value)}>
          <option value="">Efficiency</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>

        {/* TOTAL */}
        <p
          style={{
            color: total === 1 ? "#00ffcc" : "red",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          Total Weight : {total}
        </p>

        <button
          onClick={handleNext}
          disabled={total !== 1}
          style={{
            opacity: total === 1 ? 1 : 0.4,
            cursor: total === 1 ? "pointer" : "not-allowed",
          }}
        >
          NEXT
        </button>
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
      </div>
    </div>
  );
}

export default SAW;