import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SAWResult.css";

function SAWResult() {
  const navigate = useNavigate();

  const weight = JSON.parse(localStorage.getItem("saw_weights"));

  if (!weight) {
    return (
      <div className="saw-result">
        <h2>ไม่พบข้อมูล Weight</h2>
        <p>คุณยังไม่ได้ทำการประเมินคะแนน SAW</p>
        <button onClick={() => navigate(-1)}>กลับ</button>
      </div>
    );
  }

  const [coms, setComs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/comset").then((res) => {
      const data = res.data;

      const calculated = data.map((item) => ({
        ...item,
        id: item.id,
        total:
          item.performance * weight.performance +
          item.price_score * weight.price +
          item.upgrade_score * weight.upgrade +
          item.efficiency * weight.efficiency,
      }));

      calculated.sort((a, b) => b.total - a.total);
      setComs(calculated);
    });
  }, []);

  return (
    <div className="saw-page">

      {/* ตาราง SAW */}
      <div className="saw-table-box">
        <h2>SAW Result</h2>

        <table>
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Weight</th>

              {/* Top 3 ID */}
              {coms.slice(0, 3).map((c) => (
                <th key={c.id}>ID {c.id}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Performance</td>
              <td>{weight.performance}</td>
              {coms.slice(0, 3).map((c, i) => (
                <td key={"p" + i}>{c.performance}</td>
              ))}
            </tr>

            <tr>
              <td>Price Fit</td>
              <td>{weight.price}</td>
              {coms.slice(0, 3).map((c, i) => (
                <td key={"pr" + i}>{c.price_score}</td>
              ))}
            </tr>

            <tr>
              <td>Upgrade</td>
              <td>{weight.upgrade}</td>
              {coms.slice(0, 3).map((c, i) => (
                <td key={"u" + i}>{c.upgrade_score}</td>
              ))}
            </tr>

            <tr>
              <td>Efficiency</td>
              <td>{weight.efficiency}</td>
              {coms.slice(0, 3).map((c, i) => (
                <td key={"e" + i}>{c.efficiency}</td>
              ))}
            </tr>

            <tr className="total-row">
              <td>Total</td>
              <td></td>
              {coms.slice(0, 3).map((c, i) => (
                <td key={"t" + i}>{Math.round(c.total)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* การ์ด 3 อันดับ */}
      <div className="com-grid">
        {coms.slice(0, 3).map((c, index) => (
          <div className="com-card" key={c.id}>

            {/* ⭐ แสดงชื่ออันดับ */}
            <h2 className="rank-title">อันดับ {index + 1}</h2>

            <h3>ID {c.id}</h3>

            <p>CPU: {c.cpu}</p>
            <p>GPU: {c.gpu}</p>
            <p>RAM: {c.ram}</p>
            <p>Storage: {c.storage}</p>
            <p>ราคา: {c.price} บาท</p>

            <p className="total-score">
              คะแนนรวม: <b>{Math.round(c.total)}</b>
            </p>

            <button className="buy-btn">สั่งซื้อ</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default SAWResult;
