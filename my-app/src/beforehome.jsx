import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import "./BeforeHome.css";

function BeforeHome() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");

  // ดึงชื่อผู้ใช้จาก localStorage
  useEffect(() => {
    const name = localStorage.getItem("username");

    if (name) {
      setUsername(name);
    }
  }, []);

  return (
    <div className="before-container">

      <div className="before-hero">
        <p className="before-welcome">{t("welcome", { user: username })}</p>
        <span className="before-eyebrow">{t("mode.kicker")}</span>
        <h1 className="before-title">{t("choose.mode")}</h1>
        <p className="before-subtitle">{t("mode.subtitle")}</p>
      </div>

      <div className="before-box-wrapper">

        <div className="before-box" onClick={() => navigate("/home2")}>
          <strong>{t("mode.manual")}</strong>
          <span className="before-box-description">{t("mode.manualDescription")}</span>
          <span className="before-box-action">{t("mode.start")}<span aria-hidden="true">→</span></span>
        </div>

        <div className="before-box" onClick={() => navigate("/home")}>
          <strong>{t("mode.auto")}</strong>
          <span className="before-box-description">{t("mode.autoDescription")}</span>
          <span className="before-box-action">{t("mode.browse")}<span aria-hidden="true">→</span></span>
        </div>

      </div>
    </div>
  );
}

export default BeforeHome;
