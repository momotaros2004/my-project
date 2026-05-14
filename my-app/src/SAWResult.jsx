import React, { useEffect, useState } from "react";
import "./SAWResult.css";

const criteria = [
  { key: "performance", label: "Performance" },
  { key: "price_score", label: "Price Fit" },
  { key: "upgrade_score", label: "Upgradeability" },
<<<<<<< HEAD
  { key: "efficiency", label: "Efficiency / Noise" }
];

const tierWeights = {
  performance: 0.55,
  price_score: 0.25,
  upgrade_score: 0.20,
  efficiency: 0.15
=======
  { key: "efficiency", label: "Efficiency / Noise" },
];

const tierWeights = {
  low: { performance: 0.35, price_score: 0.45, upgrade_score: 0.15, efficiency: 0.05 },
  mid: { performance: 0.45, price_score: 0.25, upgrade_score: 0.2, efficiency: 0.1 },
  high: { performance: 0.55, price_score: 0.1, upgrade_score: 0.2, efficiency: 0.15 },
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
};

function SAWResult() {
  const [coms, setComs] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    try {
      const raw = localStorage.getItem("saw_results");
      const data = raw ? JSON.parse(raw) : [];

      setComs(Array.isArray(data) ? data : []);
    } catch {
      setComs([]);
    }
  }, []);

  const top3 = coms.slice(0, 3);

  return (
    <div className="result-container">
      <h2>SAW Calculation</h2>

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

              {top3.map((pc) => (
                <td key={pc.id || pc.name}>
                  {(
                    (Number(pc?.[c.key]) || 0) *
                    tierWeights[c.key]
                  ).toFixed(2)}
                </td>
              ))}
            </tr>
          ))}

          <tr className="total-row">
            <td>TOTAL</td>

            {top3.map((pc) => (
              <td key={pc.id || pc.name}>
                {(Number(pc?.totalScore) || 0).toFixed(2)}
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

            <p>{c?.name}</p>
            <p>CPU {c?.cpu}</p>
            <p>GPU {c?.gpu}</p>
            <p>RAM {c?.ram}</p>

            <b>{(Number(c?.totalScore) || 0).toFixed(2)}</b>
=======
    setComs(JSON.parse(localStorage.getItem("saw_results")) || []);
  }, []);

  const top3 = coms.slice(0, 3);

  return (
    <div className="result-container">
      <h2>SAW Calculation</h2>

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
          {criteria.map((c) => {
            const w =
              c.key === "performance"
                ? tierWeights.high
                : c.key === "price_score"
                ? tierWeights.low
                : tierWeights.mid;

            return (
              <tr key={c.key}>
                <td>{c.label}</td>

                {top3.map((pc) => (
                  <td key={pc.id}>
                    {((pc[c.key] || 0) * w[c.key]).toFixed(2)}
                  </td>
                ))}
              </tr>
            );
          })}

          <tr className="total-row">
            <td>TOTAL</td>
            {top3.map((pc) => (
              <td key={pc.id}>{Number(pc.total || 0).toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <h2>Top 3 Result</h2>

      <div className="result-grid">
        {top3.map((c, i) => (
          <div className={`result-card rank-${i + 1}`} key={c.id}>
            <h3>อันดับ {i + 1}</h3>

            {/* ใช้ ID */}
            <h4>MODEL #{c.id}</h4>

            <p>CPU {c.cpu}</p>
            <p>GPU {c.gpu}</p>
            <p>RAM {c.ram}</p>

            {/* ราคา */}
            <p>💰 {Number(c.price || 0).toLocaleString()} บาท</p>

            <b>{Number(c.total || 0).toFixed(2)}</b>
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3

            <button className="buy-btn">สั่งซื้อ</button>
          </div>
        ))}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default SAWResult;
=======
export default SAWResult;
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
