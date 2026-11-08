import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./SAW.css";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";
import Swal from "sweetalert2";

function SAW() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { startLoading } = useLoading();
  let cart = location.state?.cart;
  if (!Array.isArray(cart)) {
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      cart = [];
    }
  }
  const selectedPrograms = cart.map((item) => item.title).filter(Boolean);

  const [performance, setPerformance] = useState("");
  const [price, setPrice] = useState("");
  const [upgrade, setUpgrade] = useState("");
  const [efficiency, setEfficiency] = useState("");

  const showPopup = (type, message) => Swal.fire({
    icon: type,
    title: type === "error" ? t("login.error.title") : t("recommend.success"),
    text: message,
    confirmButtonText: t("alert.ok"),
    confirmButtonColor: "#b5f36d",
    timer: type === "success" ? 900 : undefined,
    showConfirmButton: type !== "success",
    timerProgressBar: type === "success",
  });

  const p = Number(performance || 0);
  const pr = Number(price || 0);
  const u = Number(upgrade || 0);
  const e = Number(efficiency || 0);

  const total = +(p + pr + u + e).toFixed(2);

  const handleNext = async () => {
    if (cart.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: t("saw.noPrograms"),
        confirmButtonText: t("alert.ok"),
        confirmButtonColor: "#b5f36d",
      });
      navigate("/home", { replace: true });
      return;
    }

    if (!performance || !price || !upgrade || !efficiency) {
      await showPopup("error", t("saw.required"));
      return;
    }

    if (total !== 1) {
      await showPopup("error", t("saw.sumError", { total }));
      return;
    }

    const token = localStorage.getItem("token");

    const weightData = {
      performance: p,
      price_score: pr,
      upgrade_score: u,
      efficiency: e,
    };

    const stopLoading = startLoading();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/saw/filter",
        { weights: weightData, gameIds: cart.map((item) => Number(item.id)) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("saw_results", JSON.stringify(res.data));

      if (res.data.results.length === 0) {
        await Swal.fire({
          icon: "info",
          title: t("result.noMatch"),
          text: t("result.noMatchDetails"),
          confirmButtonText: t("alert.ok"),
          confirmButtonColor: "#b5f36d",
        });
        navigate("/SAWResult");
        return;
      }

      await showPopup("success", t("saw.calculated"));
      navigate("/SAWResult");

    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        await showPopup("error", t("saw.expired"));
        navigate("/login");
      } else {
        await showPopup("error", t("saw.error"));
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="saw-container">

      <div className="saw-box">
        <button
          className="saw-back-button"
          onClick={() => {
            const stopLoading = startLoading();
            setTimeout(() => {
              navigate("/home", { state: { cart } });
              stopLoading();
            }, 350);
          }}
        >
          <span aria-hidden="true">←</span> {t("saw.back")}
        </button>
        <span className="saw-eyebrow">{t("saw.kicker")}</span>
        <h2>{t("saw.title")}</h2>
        <p className="saw-description">{t("saw.description")}</p>

        <section className="saw-selection-summary" aria-live="polite">
          <strong>{t("saw.selectedPrograms")}</strong>
          <p>{selectedPrograms.length ? selectedPrograms.join(", ") : t("recommend.noGames")}</p>
          <small>{t("saw.minimumRule")}</small>
        </section>

        <label className="weight-field">
          <span>{t("saw.performance")}</span>
          <select onChange={(e) => setPerformance(e.target.value)}>
            <option value="">{t("saw.choose")}</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
          </select>
        </label>

        <label className="weight-field">
          <span>{t("saw.price")}</span>
          <select onChange={(e) => setPrice(e.target.value)}>
            <option value="">{t("saw.choose")}</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
          </select>
        </label>

        <label className="weight-field">
          <span>{t("saw.upgrade")}</span>
          <select onChange={(e) => setUpgrade(e.target.value)}>
            <option value="">{t("saw.choose")}</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
          </select>
        </label>

        <label className="weight-field">
          <span>{t("saw.efficiency")}</span>
          <select onChange={(e) => setEfficiency(e.target.value)}>
            <option value="">{t("saw.choose")}</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
          </select>
        </label>

        <p className={`weight-total ${total === 1 ? "is-valid" : "is-invalid"}`}>
          {t("saw.total")} : {total}
        </p>

        <button
          type="button"
          data-no-loading
          onClick={handleNext}
        >
          {t("saw.next")}
        </button>
      </div>
    </div>
  );
}

export default SAW;
