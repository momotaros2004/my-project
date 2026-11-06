import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home2.css";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";
import Swal from "sweetalert2";

function Home2() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { startLoading } = useLoading();

  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 protect page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!cpu || !gpu || !ram || !storage) {
      Swal.fire({ icon: "warning", title: t("login.required.title"), text: t("pc.required"), confirmButtonText: t("alert.ok") });
      return;
    }

    const token = localStorage.getItem("token");

    setLoading(true);
    const stopLoading = startLoading();

    try {
      const res = await fetch("http://localhost:5000/api/check-com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔐 ADD
        },
        body: JSON.stringify({ cpu, gpu, ram, storage }),
      });

      const data = await res.json();

      if (data.found) {
        navigate("/recommend2", {
          state: {
            success: true,
            com: data.data,
          },
        });
      } else {
        await Swal.fire({ icon: "info", title: t("recommend.none"), text: t("pc.notFound"), confirmButtonText: t("alert.ok") });
      }
    } catch (err) {
      await Swal.fire({ icon: "error", title: t("login.error.title"), text: t("login.error.text"), confirmButtonText: t("alert.ok") });
    } finally {
      stopLoading();
      setLoading(false);
    }
  };

  return (
    <div className="pc-container">
      <div className="pc-card">
        <button className="pc-back-button" onClick={() => navigate("/beforehome")}>
          <span aria-hidden="true">←</span> {t("pc.back")}
        </button>
        <h1 className="title">{t("pc.title")}</h1>

        <select value={cpu} onChange={(e) => setCpu(e.target.value)}>
          <option value="">{t("pc.choose", { field: t("pc.cpu") })}</option>
          <option value="Intel i3-12100">Intel i3-12100</option>
          <option value="Intel i5-12400">Intel i5-12400</option>
          <option value="Ryzen 5 5600">Ryzen 5 5600</option>
        </select>

        <select value={gpu} onChange={(e) => setGpu(e.target.value)}>
          <option value="">{t("pc.choose", { field: t("pc.gpu") })}</option>
          <option value="GTX 1650">GTX 1650</option>
          <option value="RTX 3060">RTX 3060</option>
          <option value="RTX 4070">RTX 4070</option>
        </select>

        <select value={ram} onChange={(e) => setRam(e.target.value)}>
          <option value="">{t("pc.choose", { field: t("pc.ram") })}</option>
          <option value="8 GB">8 GB</option>
          <option value="16 GB">16 GB</option>
          <option value="32 GB">32 GB</option>
        </select>

        <select value={storage} onChange={(e) => setStorage(e.target.value)}>
          <option value="">{t("pc.choose", { field: t("pc.storage") })}</option>
          <option value="SSD 512GB">SSD 512GB</option>
          <option value="SSD 1TB">SSD 1TB</option>
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? t("pc.loading") : t("pc.submit")}
        </button>
      </div>
    </div>
  );
}

export default Home2;
