import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./BeforeHome.css";

function BeforeHome() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

<<<<<<< HEAD
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณต้องการ Logout ใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Logout",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      localStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "ออกจากระบบแล้ว",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/login");
    }
=======
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
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
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