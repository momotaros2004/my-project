import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminTable.css";

function AdminTable() {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  const loadData = async () => {
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
          title: "Session หมดอายุ",
          text: "กรุณา login ใหม่",
        });

        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลไม่สำเร็จ",
        });
      }
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("ต้องการลบสินค้านี้จริงไหม?")) return;

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
        title: "ลบสำเร็จ",
      });

      loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ลบไม่สำเร็จ",
      });
    }
  };

  const updateItem = async (id) => {
    const newPrice = prompt("ใส่ราคาใหม่:");

    if (!newPrice) return;

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
        title: "อัปเดตสำเร็จ",
      });

      loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "อัปเดตไม่สำเร็จ",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="table-container">
      <h1>Admin – จัดการข้อมูล Comset</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>CPU</th>
            <th>GPU</th>
            <th>RAM</th>
            <th>Storage</th>
            <th>Price</th>
            <th>Tier</th>
            <th>Performance</th>
            <th>Price Score</th>
            <th>Upgrade</th>
            <th>Efficiency</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
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
                  แก้ไข
                </button>

                <button className="delete" onClick={() => deleteItem(item.id)}>
                  ลบ
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