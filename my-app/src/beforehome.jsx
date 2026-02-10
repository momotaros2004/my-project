import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BeforeHome.css";

function BeforeHome() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // ดึงชื่อผู้ใช้จาก localStorage
  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

  // Logout + confirm
  const handleLogout = () => {
    const confirmLogout = window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?");

    if (!confirmLogout) return;

    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="before-container">

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <p style={{ color: "white", marginBottom: "15px" }}>
        👋 สวัสดี {username}
      </p>

      <h1 className="before-title">เลือกรูปแบบการจัดรายการ</h1>

      <div className="before-box-wrapper">

        <div className="before-box" onClick={() => navigate("/home2")}>
          จัด เอง
        </div>

        <div className="before-box" onClick={() => navigate("/home")}>
          จัด อัตโนมัติ
        </div>

      </div>
    </div>
  );
}

export default BeforeHome;
