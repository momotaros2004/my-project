import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminTable.css";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";

function AdminTable() {
  const { t } = useLanguage();
  const { startLoading } = useLoading();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    setLoading(true);
    const stopLoading = startLoading();
    try {
      const res = await axios.get("http://localhost:5000/api/comset", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
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
          title: t("admin.loadFailed"),
        });
      }
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const deleteItem = async (id) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: t("admin.confirmDelete"),
      showCancelButton: true,
      confirmButtonText: t("alert.confirm"),
      cancelButtonText: t("alert.cancel"),
      confirmButtonColor: "#b5f36d",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;

    const stopLoading = startLoading();
    try {
      await axios.delete(
        `http://localhost:5000/api/comset/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: t("admin.deleted"),
      });

      await loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("admin.deleteFailed"),
      });
    } finally {
      stopLoading();
    }
  };

  const updateItem = async (id) => {
    const { value: newPrice, isConfirmed } = await Swal.fire({
      title: t("admin.newPrice"),
      input: "number",
      inputAttributes: { min: 0, step: "any" },
      showCancelButton: true,
      confirmButtonText: t("alert.confirm"),
      cancelButtonText: t("alert.cancel"),
      confirmButtonColor: "#b5f36d",
      reverseButtons: true,
    });

    if (!isConfirmed || newPrice === "" || newPrice === undefined) return;

    const stopLoading = startLoading();
    try {
      await axios.put(
        `http://localhost:5000/api/comset/update/${id}`,
        { price: newPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: t("admin.updated"),
      });

      await loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("admin.updateFailed"),
      });
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="table-container">
      <h1>{t("admin.tableTitle")}</h1>

      <table>
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
          {loading
            ? Array.from({ length: 5 }, (_, row) => (
                <tr className="table-skeleton-row" key={`loading-${row}`}>
                  <td colSpan="13"><span className="table-skeleton-line" /></td>
                </tr>
              ))
            : data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.cpu}</td>
              <td>{item.gpu}</td>
              <td>{item.ram}</td>
              <td>{item.storage}</td>
              <td>{item.price}</td>
              <td>{item.tier}</td>
              <td>{item.performance}</td>
              <td>{item.price_score}</td>
              <td>{item.upgrade_score}</td>
              <td>{item.efficiency}</td>

              <td>
                <button className="edit" onClick={() => updateItem(item.id)}>
                  {t("admin.edit")}
                </button>

                <button className="delete" onClick={() => deleteItem(item.id)}>
                  {t("admin.delete")}
                </button>
              </td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
