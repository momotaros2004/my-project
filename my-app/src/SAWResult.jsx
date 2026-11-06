import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SAWResult.css";
import { useLanguage } from "./LanguageContext";

const criteria = [
  { key: "performance", label: "saw.performance" },
  { key: "price_score", label: "saw.price" },
  { key: "upgrade_score", label: "saw.upgrade" },
  { key: "efficiency", label: "saw.efficiency" },
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

const formatPrice = (value) => {
  const numericPrice = typeof value === "number"
    ? value
    : Number(String(value ?? "").replace(/[\s,]/g, ""));

  return Number.isFinite(numericPrice) ? numericPrice.toLocaleString() : "—";
};

function SAWResult() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [coms, setComs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data = [];
    try {
      const raw = localStorage.getItem("saw_results");
      const parsed = raw ? JSON.parse(raw) : [];
      data = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Invalid saw_results:", err);
    }

    setComs(data);
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const top3 = coms.slice(0, 3);

  // optional helper: choose tier (you can later connect to backend/user input)
  const getTier = () => "mid";
  const weights = tierWeights[getTier()];

  if (loading) {
    return (
      <div className="result-container result-skeleton-page" aria-busy="true" aria-label={t("loading.title")}>
        <div className="result-skeleton-back loading-skeleton-line" />
        <div className="result-skeleton-title loading-skeleton-line" />
        <div className="result-skeleton-table">
          {[0, 1, 2, 3, 4].map((row) => (
            <div className="result-skeleton-table-row" key={row}>
              <span className="loading-skeleton-line" />
              <span className="loading-skeleton-line" />
              <span className="loading-skeleton-line" />
              <span className="loading-skeleton-line" />
            </div>
          ))}
        </div>
        <div className="result-skeleton-heading loading-skeleton-line" />
        <div className="result-skeleton-chart">
          {[0, 1, 2, 3].map((card) => (
            <div className="result-skeleton-chart-card" key={card}>
              <span className="loading-skeleton-line loading-skeleton-line-short" />
              {[0, 1, 2].map((line) => <span className="loading-skeleton-line" key={line} />)}
            </div>
          ))}
        </div>
        <div className="result-skeleton-heading loading-skeleton-line" />
        <div className="result-skeleton-cards">
          {[0, 1, 2].map((card) => (
            <div className="result-skeleton-result-card" key={card}>
              <span className="loading-skeleton-line loading-skeleton-line-short" />
              <span className="loading-skeleton-line" />
              <span className="loading-skeleton-line" />
              <span className="loading-skeleton-line" />
              <span className="loading-skeleton-line loading-skeleton-line-wide" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <button className="result-back-button" onClick={() => navigate("/home")}>
        <span aria-hidden="true">←</span>{t("saw.back")}
      </button>
      <h2>{t("result.title")}</h2>

      <table className="saw-table">
        <thead>
          <tr>
            <th>{t("result.criteria")}</th>
            <th>{t("result.rank1")}</th>
            <th>{t("result.rank2")}</th>
            <th>{t("result.rank3")}</th>
          </tr>
        </thead>

        <tbody>
          {criteria.map((c) => (
            <tr key={c.key}>
              <td>{t(c.label)}</td>

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
            <td>{t("result.total")}</td>

            {top3.map((pc, idx) => (
              <td key={pc.id || idx}>
                {Number(pc?.totalScore || pc?.total || 0).toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <section className="result-chart-panel">
        <div className="result-chart-heading">
          <div>
            <span>{t("result.title")}</span>
            <h2>{t("result.criteria")}</h2>
          </div>
          <span className="result-chart-scale">0–100</span>
        </div>

        <div className="result-chart-grid">
          {criteria.map((criterion) => (
            <article className="result-metric-card" key={criterion.key}>
              <h3>{t(criterion.label)}</h3>
              <div className="result-metric-bars">
                {top3.map((pc, index) => {
                  const rawScore = Number(pc?.[criterion.key]);
                  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, rawScore)) : 0;

                  return (
                    <div className="result-metric-row" key={pc.id || index}>
                      <span className={`result-rank-dot rank-color-${index + 1}`} aria-hidden="true" />
                      <span className="result-metric-rank">{t("result.rank", { rank: index + 1 })}</span>
                      <div
                        className="result-metric-track"
                        role="progressbar"
                        aria-label={`${t(criterion.label)} · ${t("result.rank", { rank: index + 1 })}`}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={score}
                      >
                        <span className={`rank-bar-${index + 1}`} style={{ width: `${score}%` }} />
                      </div>
                      <strong>{Number.isFinite(rawScore) ? rawScore : "—"}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <h2>{t("result.top")}</h2>

      <div className="result-grid">
        {top3.map((c, i) => (
          <div className={`result-card rank-${i + 1}`} key={c.id || i}>
            <h3>{t("result.rank", { rank: i + 1 })}</h3>

            <h4>MODEL #{c.id}</h4>

            <p>CPU: {c.cpu}</p>
            <p>GPU: {c.gpu}</p>
            <p>RAM: {c.ram}</p>
            <p>💰 {formatPrice(c.price)} {t("currency.thb")}</p>

            <b>{Number(c.totalScore || c.total || 0).toFixed(2)}</b>

            <button className="buy-btn">{t("result.buy")}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SAWResult;
