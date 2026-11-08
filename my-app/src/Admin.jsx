import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admin.css";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";

const makeComsetForm = () => ({
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
});

const makeProductForm = () => ({ name: "", type: "", detail: "", stock: "", price: "" });

const comsetFields = [
  { key: "name" },
  { key: "cpu", type: "select", options: ["Intel i3-12100", "Intel i5-12400", "Intel i7-13700", "Ryzen 3 4100", "Ryzen 5 5600", "Ryzen 7 7700X"] },
  { key: "gpu", type: "select", options: ["GTX 1650", "RTX 3060", "RTX 4070", "RTX 4080"] },
  { key: "ram", type: "select", options: ["8 GB", "16 GB", "32 GB"] },
  { key: "storage", type: "select", options: ["SSD 512GB", "SSD 1TB", "SSD 2TB"] },
  { key: "price", type: "number", min: "0", step: "0.01" },
  { key: "tier", type: "select", options: ["Low", "Medium", "High"] },
  { key: "performance", type: "number", min: "0", max: "100", step: "0.01" },
  { key: "price_score", type: "number", min: "0", max: "100", step: "0.01" },
  { key: "upgrade_score", type: "number", min: "0", max: "100", step: "0.01" },
  { key: "efficiency", type: "number", min: "0", max: "100", step: "0.01" },
];

const productFields = [
  { key: "name" },
  { key: "type", type: "select" },
  { key: "detail", type: "textarea", required: false },
  { key: "stock", type: "number", min: "0", step: "1" },
  { key: "price", type: "number", min: "0", step: "0.01" },
];

function Admin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { startLoading } = useLoading();
  const [selectedTable, setSelectedTable] = useState("comset");
  const [form, setForm] = useState(makeComsetForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setForm(table === "comset" ? makeComsetForm() : makeProductForm());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const token = localStorage.getItem("token");
    if (!token) {
      await Swal.fire({ icon: "error", title: t("admin.notLoggedIn"), text: t("admin.loginFirst") });
      return;
    }

    setIsSubmitting(true);
    const stopLoading = startLoading();
    const numericFields = selectedTable === "comset"
      ? ["price", "performance", "price_score", "upgrade_score", "efficiency"]
      : ["stock", "price"];
    const payload = { ...form };
    numericFields.forEach((field) => { payload[field] = Number(payload[field]); });

    try {
      const endpoint = selectedTable === "comset" ? "comset" : "products";
      await axios.post(`http://localhost:5000/api/${endpoint}/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        icon: "success",
        title: t("admin.success"),
        text: t("admin.added"),
        confirmButtonText: t("alert.ok"),
        confirmButtonColor: "#b5f36d",
      });
      setForm(selectedTable === "comset" ? makeComsetForm() : makeProductForm());
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        await Swal.fire({ icon: "warning", title: t("admin.sessionExpired"), text: t("admin.loginAgain") });
        navigate("/login", { replace: true });
      } else if (error.response?.status === 403) {
        await Swal.fire({ icon: "error", title: t("admin.forbidden") });
        navigate("/beforehome", { replace: true });
      } else {
        await Swal.fire({
          icon: "error",
          title: t("admin.error"),
          text: error.response?.data?.error || t("admin.addFailed"),
        });
      }
    } finally {
      stopLoading();
      setIsSubmitting(false);
    }
  };

  const fields = selectedTable === "comset" ? comsetFields : productFields;

  return (
    <main className="admin-container admin-page">
      <header className="admin-heading">
        <div>
          <span className="admin-eyebrow">PIM TO BUY COM · ADMIN</span>
          <h1>{t("admin.addTitle")}</h1>
          <p>{t("admin.workspaceDescription")}</p>
        </div>
        <button className="admin-back-button" type="button" onClick={() => navigate("/beforehome")}>
          <span aria-hidden="true">←</span>{t("home.back")}
        </button>
      </header>

      <nav className="admin-nav" aria-label={t("admin.workspace") }>
        <button
          className="admin-nav-link is-active"
          type="button"
          aria-current="page"
        >
          <span aria-hidden="true">＋</span>{t("admin.addData")}
        </button>
        <button className="admin-nav-link" type="button" onClick={() => navigate("/admin/table")}>
          <span aria-hidden="true">▤</span>{t("admin.manageBuilds")}
        </button>
      </nav>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="admin-section-kicker">{t("admin.workspace")}</span>
            <h2>{t("admin.adding", { table: selectedTable === "comset" ? t("admin.comset") : t("admin.products") })}</h2>
          </div>
          <span className="admin-step-badge">01</span>
        </div>

        <div className="admin-type-switch" role="tablist" aria-label={t("admin.tables")}>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTable === "comset"}
            className={selectedTable === "comset" ? "is-active" : ""}
            onClick={() => handleSelectTable("comset")}
          >
            <span aria-hidden="true">▣</span>{t("admin.addPc")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTable === "products"}
            className={selectedTable === "products" ? "is-active" : ""}
            onClick={() => handleSelectTable("products")}
          >
            <span aria-hidden="true">◇</span>{t("admin.addProduct")}
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {fields.map((field) => {
              const id = `admin-${selectedTable}-${field.key}`;
              const label = t(`admin.field.${field.key}`);
              const commonProps = {
                id,
                name: field.key,
                value: form[field.key],
                onChange: handleChange,
                required: field.required !== false,
                "aria-label": label,
              };

              return (
                <label className={`admin-field${field.type === "textarea" ? " admin-field-wide" : ""}`} htmlFor={id} key={field.key}>
                  <span>{label}{field.required === false && <em>{t("admin.optional")}</em>}</span>
                  {field.type === "select" ? (
                    <select {...commonProps}>
                      <option value="">{field.options ? t("admin.chooseOption") : t("admin.productType")}</option>
                      {(field.options || ["cpu", "gpu", "ram", "ssd", "hdd", "case", "psu"]).map((option) => (
                        <option value={option} key={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea {...commonProps} rows="3" />
                  ) : (
                    <input
                      {...commonProps}
                      type={field.type || "text"}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      autoComplete="off"
                    />
                  )}
                </label>
              );
            })}
          </div>

          <div className="admin-form-footer">
            <p>{selectedTable === "comset" ? t("admin.scoreHint") : t("admin.requiredHint")}</p>
            <button className="admin-submit-button" type="submit" disabled={isSubmitting}>
              <span aria-hidden="true">＋</span>{isSubmitting ? t("admin.saving") : t("admin.submit")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Admin;
