import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLanguage } from "./LanguageContext";
import "./Payment.css";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [method, setMethod] = useState("promptpay");
  const com = state?.com;

  if (!com) {
    return (
      <main className="payment-container">
        <section className="payment-card payment-empty">
          <span className="payment-eyebrow">{t("payment.title")}</span>
          <h1>{t("payment.noData")}</h1>
          <button className="payment-secondary-button" onClick={() => navigate("/home2")}>
            {t("recommend.home")}
          </button>
        </section>
      </main>
    );
  }

  const price = typeof com.price === "number"
    ? com.price
    : Number(String(com.price ?? "").replace(/[\s,]/g, ""));
  const formattedPrice = Number.isFinite(price)
    ? `${price.toLocaleString()} ${t("currency.thb")}`
    : "—";

  const handleConfirm = () => {
    Swal.fire({
      icon: "info",
      title: t("payment.title"),
      text: t("payment.notConnected"),
      confirmButtonText: t("alert.ok"),
      confirmButtonColor: "#b5f36d",
    });
  };

  return (
    <main className="payment-container">
      <section className="payment-card">
        <button
          className="payment-back-button"
          onClick={() => navigate("/home2")}
        >
          <span aria-hidden="true">←</span>{t("payment.back")}
        </button>

        <header className="payment-header">
          <span className="payment-eyebrow">PIM TO BUY COM</span>
          <h1>{t("payment.title")}</h1>
          <p>{t("payment.subtitle")}</p>
        </header>

        <section className="payment-order">
          <h2>{t("payment.order")}</h2>
          <div className="payment-order-name">
            <span>{com.name || t("recommend.pc")}</span>
            {com.tier && <em>{com.tier}</em>}
          </div>
          <dl className="payment-specs">
            <div><dt>{t("pc.cpu")}</dt><dd>{com.cpu || "—"}</dd></div>
            <div><dt>{t("pc.gpu")}</dt><dd>{com.gpu || "—"}</dd></div>
            <div><dt>{t("pc.ram")}</dt><dd>{com.ram || "—"}</dd></div>
            <div><dt>{t("pc.storage")}</dt><dd>{com.storage || "—"}</dd></div>
          </dl>
          <div className="payment-total">
            <span>{t("recommend.price")}</span>
            <strong>{formattedPrice}</strong>
          </div>
        </section>

        <fieldset className="payment-methods">
          <legend>{t("payment.method")}</legend>
          {[
            ["promptpay", t("payment.promptpay"), "▦"],
            ["transfer", t("payment.transfer"), "↗"],
            ["card", t("payment.card"), "▰"],
          ].map(([value, label, icon]) => (
            <label className={`payment-method${method === value ? " is-selected" : ""}`} key={value}>
              <input
                type="radio"
                name="payment-method"
                value={value}
                checked={method === value}
                onChange={() => setMethod(value)}
              />
              <span className="payment-method-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              <span className="payment-radio-mark" aria-hidden="true" />
            </label>
          ))}
        </fieldset>

        <p className="payment-demo-note">{t("payment.demo")}</p>
        <button className="payment-confirm-button" onClick={handleConfirm}>
          {t("payment.confirm")}<span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}
