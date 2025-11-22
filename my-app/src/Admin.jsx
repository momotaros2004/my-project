import { useState } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [selectedTable, setSelectedTable] = useState(""); 
  const [form, setForm] = useState({});

  // ฟิลด์ของ comset
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

  // ฟิลด์ของ products
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
    if (!selectedTable) return alert("กรุณาเลือกตารางก่อน");

    try {
      const url =
        selectedTable === "comset"
          ? "http://localhost:5000/comset/add"
          : "http://localhost:5000/products/add";

      await axios.post(url, form);
      alert("เพิ่มข้อมูลสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin – เพิ่มข้อมูล</h1>

      {/* ปุ่มเลือกตาราง */}
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

      {/* ฟอร์ม */}
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
                  defaultValue=""
                >
                  <option value="" disabled>
                    เลือกประเภทสินค้า
                  </option>
                  <option value="cpu">CPU</option>
                  <option value="gpu">GPU</option>
                  <option value="ram">RAM</option>
                  <option value="ssd">SSD</option>
                  <option value="hdd">HDD</option>
                  <option value="case">เคส</option>
                  <option value="psu">PSU</option>
                </select>
              );
            }

            return (
              <input
                key={field}
                name={field}
                placeholder={field.toUpperCase()}
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
