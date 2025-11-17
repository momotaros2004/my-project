import React from "react";
import { useNavigate } from "react-router-dom";

function BeforeHome() {
  const navigate = useNavigate();

  return (
    <div className="before-container">

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
