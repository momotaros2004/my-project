import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recommend.css";
import { useLanguage } from "./LanguageContext";

function Recommend() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { cart } = location.state || { cart: [] };

  // 🔐 กันไม่ login เข้าหน้า
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (!cart || cart.length === 0) {
    return (
      <div className="recommend-container">
        <h2>{t("recommend.noGames")}</h2>
        <button onClick={() => navigate("/home")}>{t("recommend.home")}</button>
      </div>
    );
  }

  // 🔥 fix type safety
  const maxSpec = cart.reduce(
    (acc, game) => {
      const price = Number(game?.specs?.price || 0);

      return price > acc.price
        ? { ...game.specs, price }
        : acc;
    },
    { cpu: "", gpu: "", ram: "", price: 0 }
  );

  const totalGamePrice = cart.reduce(
    (sum, game) => sum + Number(game?.specs?.price || 0),
    0
  );

  return (
    <div className="recommend-container">
      <h1>{t("recommend.title")}</h1>

      <p>{t("recommend.based")}</p>

      <ul>
        {cart.map((game) => (
          <li key={game.id}>{game.title}</li>
        ))}
      </ul>

      <div className="pc-specs">
        <h2>{t("recommend.pc")}</h2>

        <p><strong>{t("pc.cpu")}:</strong> {maxSpec.cpu}</p>
        <p><strong>{t("pc.gpu")}:</strong> {maxSpec.gpu}</p>
        <p><strong>{t("pc.ram")}:</strong> {maxSpec.ram}</p>

        <p>
          <strong>{t("recommend.estimatedPrice")}:</strong>{" "}
          {Number(maxSpec.price).toLocaleString()} {t("currency.thb")}
        </p>
      </div>

      <h3>
        {t("recommend.totalGames")}:{" "}
        {totalGamePrice.toLocaleString()} {t("currency.thb")}
      </h3>

      <button onClick={() => navigate("/home")}>{t("recommend.home")}</button>
    </div>
  );
}

export default Recommend;
