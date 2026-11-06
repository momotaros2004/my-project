import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admin.css";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";

function Admin() {
  const { t } = useLanguage();
  const { startLoading } = useLoading();
  const [selectedTable, setSelectedTable] = useState("");
  const [form, setForm] = useState({});

  const comsetFields = {
    name: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    price: "",
    tier: "",
    performance: "",
    price_score: "",
    upgrade_score: "",
    efficiency: "",
  };

  const productFields = {
    name: "",
    type: "",
    detail: "",
    stock: "",
    price: "",
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setForm(table === "comset" ? comsetFields : productFields);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedTable) {
      Swal.fire(t("admin.tables"));
      return;
    }

    // 🔐 check token
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: t("admin.notLoggedIn"),
        text: t("admin.loginFirst"),
      });
      return;
    }

    const stopLoading = startLoading();
    try {
      const url =
        selectedTable === "comset"
          ? "http://localhost:5000/api/comset/add"
          : "http://localhost:5000/api/products/add";

      const res = await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: t("admin.success"),
        text: t("admin.added"),
      });

      setForm(selectedTable === "comset" ? comsetFields : productFields);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: t("admin.sessionExpired"),
          text: t("admin.loginAgain"),
        });
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        Swal.fire({
          icon: "error",
          title: t("admin.error"),
          text: t("admin.addFailed"),
        });
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="admin-container">
      <h1>{t("admin.addTitle")}</h1>

      <div className="table-select">
        <button
          className={selectedTable === "comset" ? "active" : ""}
          onClick={() => handleSelectTable("comset")}
        >
          {t("admin.add")} {t("admin.comset")}
        </button>

        <button
          className={selectedTable === "products" ? "active" : ""}
          onClick={() => handleSelectTable("products")}
        >
          {t("admin.add")} {t("admin.products")}
        </button>
      </div>

      {selectedTable && (
        <div className="form-container">
          <h2>{t("admin.adding", { table: selectedTable === "comset" ? t("admin.comset") : t("admin.products") })}</h2>

          {Object.keys(form).map((field) => {
            if (selectedTable === "products" && field === "type") {
              return (
                <select
                  key={field}
                  name={field}
                  onChange={handleChange}
                  value={form[field]}
                >
                  <option value="">{t("admin.productType")}</option>
                  <option value="cpu">CPU</option>
                  <option value="gpu">GPU</option>
                  <option value="ram">RAM</option>
                  <option value="ssd">SSD</option>
                  <option value="hdd">HDD</option>
                  <option value="case">Case</option>
                  <option value="psu">PSU</option>
                </select>
              );
            }

            return (
              <input
                key={field}
                name={field}
                placeholder={t(`admin.field.${field}`)}
                value={form[field]}
                onChange={handleChange}
              />
            );
          })}

          <button className="submit-btn" onClick={handleSubmit}>
            {t("admin.add")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;
