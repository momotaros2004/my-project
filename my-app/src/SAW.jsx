import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./SAW.css";

function SAW() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [performance, setPerformance] = useState("");
  const [price, setPrice] = useState("");
  const [upgrade, setUpgrade] = useState("");
  const [efficiency, setEfficiency] = useState("");

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
      return;
    }

    const weightData = {
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
    }
  };

  return (
    <div className="saw-container">
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
      </div>
    </div>
  );
}

export default SAW;
