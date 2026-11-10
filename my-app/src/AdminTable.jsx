import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admin.css";
import "./AdminTable.css";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";

const parsePrice = (value) => {
  const normalized = String(value ?? "").replace(/[\s,]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

function AdminTable() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { startLoading } = useLoading();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const token = localStorage.getItem("token");

  const handleApiError = useCallback(async (error, fallbackMessage) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      await Swal.fire({ icon: "warning", title: t("admin.sessionExpired"), text: t("admin.loginAgain") });
      navigate("/login", { replace: true });
      return;
    }

    if (error.response?.status === 403) {
      await Swal.fire({ icon: "error", title: t("admin.forbidden") });
      navigate("/beforehome", { replace: true });
      return;
    }

    await Swal.fire({
      icon: "error",
      title: fallbackMessage,
      text: error.response?.data?.error || t("admin.tryAgain"),
      confirmButtonText: t("alert.ok"),
      confirmButtonColor: "#b5f36d",
    });
  }, [navigate, t]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const stopLoading = startLoading();
    try {
      const response = await axios.get("/api/comset", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      await handleApiError(error, t("admin.loadFailed"));
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [handleApiError, startLoading, t, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) => [item.name, item.cpu, item.gpu, item.ram, item.storage, item.tier]
      .some((value) => String(value ?? "").toLowerCase().includes(query)));
  }, [data, search]);
  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const visibleData = filteredData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const openEditForm = (item) => {
    setEditForm({ ...item, price: parsePrice(item.price) ?? "" });
  };

  const updateItem = async (event) => {
    event.preventDefault();
    if (!editForm || isSavingEdit) return;

    setIsSavingEdit(true);
    const stopLoading = startLoading();
    try {
      const payload = {
        name: editForm.name.trim(),
        cpu: editForm.cpu.trim(),
        gpu: editForm.gpu.trim(),
        ram: editForm.ram.trim(),
        storage: editForm.storage.trim(),
        price: Number(editForm.price),
        tier: editForm.tier.trim(),
        performance: Number(editForm.performance),
        price_score: Number(editForm.price_score),
        upgrade_score: Number(editForm.upgrade_score),
        efficiency: Number(editForm.efficiency),
      };
      await axios.put(`/api/comset/update/${editForm.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((current) => current.map((item) => item.id === editForm.id ? { ...item, ...payload } : item));
      setEditForm(null);
      await Swal.fire({ icon: "success", title: t("admin.updated"), confirmButtonColor: "#b5f36d" });
    } catch (error) {
      await handleApiError(error, t("admin.updateFailed"));
    } finally {
      stopLoading();
      setIsSavingEdit(false);
    }
  };

  const editFields = [
    { key: "name", type: "text" },
    { key: "cpu", type: "text" },
    { key: "gpu", type: "text" },
    { key: "ram", type: "text" },
    { key: "storage", type: "text" },
    { key: "price", type: "number", min: "0", step: "0.01" },
    { key: "tier", type: "text" },
    { key: "performance", type: "number", min: "0", max: "100", step: "0.01" },
    { key: "price_score", type: "number", min: "0", max: "100", step: "0.01" },
    { key: "upgrade_score", type: "number", min: "0", max: "100", step: "0.01" },
    { key: "efficiency", type: "number", min: "0", max: "100", step: "0.01" },
  ];

  const deleteItem = async (item) => {
    const result = await Swal.fire({
      icon: "warning",
      title: t("admin.confirmDelete"),
      text: item.name,
      showCancelButton: true,
      confirmButtonText: t("admin.delete"),
      cancelButtonText: t("alert.cancel"),
      confirmButtonColor: "#d9534f",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    const stopLoading = startLoading();
    try {
      await axios.delete(`/api/comset/delete/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((current) => current.filter((row) => row.id !== item.id));
      await Swal.fire({ icon: "success", title: t("admin.deleted"), confirmButtonColor: "#b5f36d" });
    } catch (error) {
      await handleApiError(error, t("admin.deleteFailed"));
    } finally {
      stopLoading();
    }
  };

  return (
    <main className="admin-container admin-page admin-table-page">
      <header className="admin-heading">
        <div>
          <span className="admin-eyebrow">PIM TO BUY COM · ADMIN</span>
          <h1>{t("admin.tableTitle")}</h1>
          <p>{t("admin.manageDescription")}</p>
        </div>
        <button className="admin-back-button" type="button" onClick={() => navigate("/beforehome")}>
          <span aria-hidden="true">←</span>{t("home.back")}
        </button>
      </header>

      <nav className="admin-nav" aria-label={t("admin.workspace")}>
        <button className="admin-nav-link" type="button" onClick={() => navigate("/admin")}>
          <span aria-hidden="true">＋</span>{t("admin.addData")}
        </button>
        <button className="admin-nav-link is-active" type="button" aria-current="page">
          <span aria-hidden="true">▤</span>{t("admin.manageBuilds")}
        </button>
      </nav>

      <section className="admin-panel admin-table-panel">
        <div className="admin-table-toolbar">
          <div>
            <span className="admin-section-kicker">{t("admin.comset")}</span>
            <h2>{t("admin.tableTitle")}</h2>
            <p>{t("admin.rowCount", { count: data.length })}</p>
          </div>
          <div className="admin-table-tools">
            <label className="admin-search-field">
              <span className="sr-only">{t("admin.search")}</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
              <input
                type="search"
                aria-label={t("admin.search")}
                placeholder={t("admin.search")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="admin-page-size">
              <span>{t("admin.show")}</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                aria-label={t("admin.rowsPerPage")}
              >
                {[10, 25, 50, 100].map((size) => <option value={size} key={size}>{size}</option>)}
              </select>
            </label>
            <button className="admin-refresh-button" type="button" onClick={loadData} disabled={loading}>
              <span aria-hidden="true">↻</span>{t("admin.refresh")}
            </button>
          </div>
        </div>

        <div
          className="admin-table-scroll"
          onWheel={(event) => {
            if (event.shiftKey && event.deltaY !== 0) {
              event.currentTarget.scrollLeft += event.deltaY;
              event.preventDefault();
            }
          }}
        >
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("table.name")}</th>
                <th>CPU</th>
                <th>GPU</th>
                <th>RAM</th>
                <th>{t("table.storage")}</th>
                <th>{t("table.price")}</th>
                <th>{t("table.tier")}</th>
                <th>{t("table.performance")}</th>
                <th>{t("table.priceScore")}</th>
                <th>{t("table.upgrade")}</th>
                <th>{t("table.efficiency")}</th>
                <th>{t("admin.action")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="admin-table-message" colSpan="13">{t("loading.title")}…</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td className="admin-table-message" colSpan="13">{data.length ? t("admin.noResults") : t("admin.emptyBuilds")}</td></tr>
              ) : visibleData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="admin-build-name">{item.name}</td>
                  <td>{item.cpu}</td>
                  <td>{item.gpu}</td>
                  <td>{item.ram}</td>
                  <td>{item.storage}</td>
                  <td className="admin-price-cell">
                    {parsePrice(item.price) === null
                      ? "—"
                      : `${parsePrice(item.price).toLocaleString()} ${t("currency.thb")}`}
                  </td>
                  <td>{item.tier}</td>
                  <td>{item.performance}</td>
                  <td>{item.price_score}</td>
                  <td>{item.upgrade_score}</td>
                  <td>{item.efficiency}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-edit-button" type="button" onClick={() => openEditForm(item)}>{t("admin.editBuild")}</button>
                      <button className="admin-delete-button" type="button" onClick={() => deleteItem(item)}>{t("admin.delete")}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <p className="admin-range-label">
            {t("admin.showingRange", {
              from: filteredData.length ? (safeCurrentPage - 1) * pageSize + 1 : 0,
              to: Math.min(safeCurrentPage * pageSize, filteredData.length),
              count: filteredData.length,
            })}
          </p>
          <div className="admin-pagination" aria-label={t("admin.pagination")}>
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage <= 1}>
              {t("admin.previous")}
            </button>
            <span>{t("admin.pageOf", { page: safeCurrentPage, pages: pageCount })}</span>
            <button type="button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={safeCurrentPage >= pageCount}>
              {t("admin.next")}
            </button>
          </div>
        </div>
        <p className="admin-scroll-hint"><span aria-hidden="true">↔</span>{t("admin.scrollHint")}</p>
      </section>
      {editForm && (
        <div
          className="admin-edit-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSavingEdit) setEditForm(null);
          }}
        >
          <form className="admin-edit-dialog" onSubmit={updateItem} role="dialog" aria-modal="true" aria-labelledby="admin-edit-title">
            <div className="admin-edit-heading">
              <div>
                <span className="admin-section-kicker">{t("admin.comset")}</span>
                <h2 id="admin-edit-title">{t("admin.editBuild")}</h2>
              </div>
              <button className="admin-edit-close" type="button" aria-label={t("alert.cancel")} onClick={() => setEditForm(null)} disabled={isSavingEdit}>×</button>
            </div>
            <div className="admin-edit-grid">
              {editFields.map((field) => {
                const id = `admin-edit-${field.key}`;
                const label = t(`admin.field.${field.key}`);
                return (
                  <label className="admin-edit-field" htmlFor={id} key={field.key}>
                    <span>{label}</span>
                    <input
                      id={id}
                      name={field.key}
                      type={field.type}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={editForm[field.key] ?? ""}
                      onChange={(event) => setEditForm((current) => ({ ...current, [field.key]: event.target.value }))}
                      required
                    />
                  </label>
                );
              })}
            </div>
            <div className="admin-edit-actions">
              <button className="admin-edit-cancel" type="button" onClick={() => setEditForm(null)} disabled={isSavingEdit}>{t("alert.cancel")}</button>
              <button className="admin-edit-save" type="submit" disabled={isSavingEdit}>{isSavingEdit ? t("admin.saving") : t("admin.saveChanges")}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default AdminTable;
