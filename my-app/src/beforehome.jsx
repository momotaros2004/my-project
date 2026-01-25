import React from "react";
import { useNavigate } from "react-router-dom";
import "./BeforeHome.css";
function BeforeHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ล้างข้อมูล login (ถ้ามี)
    localStorage.clear();

    // กลับหน้า login
    navigate("/login");
  };

  return (
    <div className="before-container">

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="before-title">เลือกรูปแบบการจัดรายการ</h1>

      <div className="before-box-wrapper">

        <div
          className="before-box"
          onClick={() => navigate("/home2")}
        >
          จัด เอง
        </div>

        <div
          className="before-box"
          onClick={() => navigate("/home")}
        >
          จัด อัตโนมัติ
        </div>

      </div>
    </div>
  );
}

export default BeforeHome;
