import React, { useEffect, useState } from "react";
import "./SAWResult.css";

const criteria = [
  { key: "performance", label: "Performance" },
  { key: "price_score", label: "Price Fit" },
  { key: "upgrade_score", label: "Upgradeability" },
  { key: "efficiency", label: "Efficiency / Noise" },
];

// ✅ Multi-tier SAW weighting system (keep this version)
const tierWeights = {
  low: {
    performance: 0.35,
    price_score: 0.45,
    upgrade_score: 0.15,
    efficiency: 0.05,
  },
  mid: {
    performance: 0.45,
    price_score: 0.25,
    upgrade_score: 0.2,
    efficiency: 0.1,
  },
  high: {
    performance: 0.55,
    price_score: 0.1,
    upgrade_score: 0.2,
    efficiency: 0.15,
  },
};

function SAWResult() {
  const [coms, setComs] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("saw_results");
      const data = raw ? JSON.parse(raw) : [];
      setComs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Invalid saw_results:", err);
      setComs([]);
    }
  }, []);

  const top3 = coms.slice(0, 3);

  // optional helper: choose tier (you can later connect to backend/user input)
  const getTier = () => "mid";
  const weights = tierWeights[getTier()];

  return (
    <div className="result-container">
      <h2>SAW Calculation Result</h2>

      <table className="saw-table">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>อันดับ 1</th>
            <th>อันดับ 2</th>
            <th>อันดับ 3</th>
          </tr>
        </thead>

        <tbody>
          {criteria.map((c) => (
            <tr key={c.key}>
              <td>{c.label}</td>

              {top3.map((pc, idx) => (
                <td key={pc.id || idx}>
                  {(
                    (Number(pc?.[c.key]) || 0) *
                    (weights?.[c.key] || 0)
                  ).toFixed(2)}
                </td>
              ))}
            </tr>
          ))}

          <tr className="total-row">
            <td>TOTAL</td>

            {top3.map((pc, idx) => (
              <td key={pc.id || idx}>
                {Number(pc?.totalScore || pc?.total || 0).toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <h2>Top 3 Result</h2>

      <div className="result-grid">
        {top3.map((c, i) => (
          <div className={`result-card rank-${i + 1}`} key={c.id || i}>
            <h3>อันดับ {i + 1}</h3>

            <h4>MODEL #{c.id}</h4>

            <p>CPU: {c.cpu}</p>
            <p>GPU: {c.gpu}</p>
            <p>RAM: {c.ram}</p>
            <p>💰 {Number(c.price || 0).toLocaleString()} บาท</p>

            <b>{Number(c.totalScore || c.total || 0).toFixed(2)}</b>

            <button className="buy-btn">สั่งซื้อ</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SAWResult;