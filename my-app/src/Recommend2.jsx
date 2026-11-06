import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Recommend2.css";
import { useLanguage } from "./LanguageContext";

export default function Recommend2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const com = state?.com;

  // 🔐 กันไม่ login เข้า
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ❌ ไม่มีข้อมูล (หรือ refresh แล้ว state หาย)
  if (!com) {
    return (
      <div className="rec-container">
        <section className="rec-empty-card">
          <div className="rec-empty-icon" aria-hidden="true">?</div>
          <span className="rec-eyebrow">{t("recommend.title")}</span>
          <h1>{t("recommend.none")}</h1>
          <button className="rec-primary-button" onClick={() => navigate("/home2")}>
            <span aria-hidden="true">←</span>{t("recommend.home")}
          </button>
        </section>
      </div>
    );
  }

  const price = typeof com.price === "number"
    ? com.price
    : Number(String(com.price ?? "").replace(/[\s,]/g, ""));
  const formattedPrice = Number.isFinite(price)
    ? `${price.toLocaleString()} ${t("currency.thb")}`
    : "—";

  const specs = [
    { key: "cpu", label: t("pc.cpu"), value: com.cpu, icon: "CPU" },
    { key: "gpu", label: t("pc.gpu"), value: com.gpu, icon: "GPU" },
    { key: "ram", label: t("pc.ram"), value: com.ram, icon: "RAM" },
    { key: "storage", label: t("pc.storage"), value: com.storage, icon: "SSD" },
  ];
  const scores = [
    { key: "performance", label: t("saw.performance"), value: com.performance },
    { key: "price_score", label: t("saw.price"), value: com.price_score },
    { key: "upgrade_score", label: t("saw.upgrade"), value: com.upgrade_score },
    { key: "efficiency", label: t("saw.efficiency"), value: com.efficiency },
  ];

  return (
    <div className="rec-container">
      <div className="rec-card">
        <button className="rec-back-button" onClick={() => navigate("/home2")}>
          <span aria-hidden="true">←</span>{t("recommend.back")}
        </button>

        <header className="rec-header">
          <span className="rec-success-mark" aria-hidden="true">✓</span>
          <span className="rec-eyebrow">{t("recommend.success")}</span>
          <h1>{com.name || t("recommend.pc")}</h1>
          <p>{t("recommend.title")}</p>
        </header>

        <section className="rec-price-card" aria-label={t("recommend.price")}>
          <span>{t("recommend.price")}</span>
          <strong>{formattedPrice}</strong>
          {com.tier && <em>{com.tier}</em>}
        </section>

        <section className="rec-spec-section">
          <h2>{t("recommend.pc")}</h2>
          <div className="rec-spec-grid">
            {specs.map((spec) => (
              <article className="rec-spec-item" key={spec.key}>
                <span className="rec-spec-icon" aria-hidden="true">{spec.icon}</span>
                <div>
                  <span className="rec-spec-label">{spec.label}</span>
                  <strong>{spec.value || "—"}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rec-score-section">
          <div className="rec-score-heading">
            <h2>{t("result.criteria")}</h2>
            <span>0–100</span>
          </div>
          <div className="rec-score-chart">
            {scores.map((score) => {
              const value = Number(score.value);
              const validValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

              return (
                <div className="rec-score-row" key={score.key}>
                  <div className="rec-score-label">
                    <span>{score.label}</span>
                    <strong>{Number.isFinite(value) ? value : "—"}</strong>
                  </div>
                  <div
                    className="rec-score-track"
                    role="progressbar"
                    aria-label={score.label}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={validValue}
                  >
                    <span style={{ width: `${validValue}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <button className="rec-primary-button" onClick={() => navigate("/home2")}>
          {t("recommend.back")}<span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
