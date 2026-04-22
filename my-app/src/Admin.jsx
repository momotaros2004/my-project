import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admin.css";

function Admin() {
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
      Swal.fire("กรุณาเลือกตารางก่อน");
      return;
    }

    // 🔐 check token
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "ไม่ได้เข้าสู่ระบบ",
        text: "กรุณา login ก่อนใช้งาน",
      });
      return;
    }

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
        title: "สำเร็จ",
        text: "เพิ่มข้อมูลเรียบร้อย",
      });

      setForm(selectedTable === "comset" ? comsetFields : productFields);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Session หมดอายุ",
          text: "กรุณา login ใหม่",
        });
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเพิ่มข้อมูลได้",
        });
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin – เพิ่มข้อมูล</h1>

      <div className="table-select">
        <button
          className={selectedTable === "comset" ? "active" : ""}
          onClick={() => handleSelectTable("comset")}
        >
          เพิ่มข้อมูล Comset
        </button>

        <button
          className={selectedTable === "products" ? "active" : ""}
          onClick={() => handleSelectTable("products")}
        >
          เพิ่มข้อมูล Products
        </button>
      </div>

      {selectedTable && (
        <div className="form-container">
          <h2>กำลังเพิ่มข้อมูลใน: {selectedTable}</h2>

          {Object.keys(form).map((field) => {
            if (selectedTable === "products" && field === "type") {
              return (
                <select
                  key={field}
                  name={field}
                  onChange={handleChange}
                  value={form[field]}
                >
                  <option value="">เลือกประเภทสินค้า</option>
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
                placeholder={field}
                value={form[field]}
                onChange={handleChange}
              />
            );
          })}

          <button className="submit-btn" onClick={handleSubmit}>
            เพิ่มข้อมูล
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;