import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminTable.css";

function AdminTable() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const res = await axios.get("http://localhost:5000/comset");
    setData(res.data);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("ต้องการลบสินค้านี้จริงไหม?")) return;

    await axios.delete(`http://localhost:5000/comset/delete/${id}`);
    loadData();
  };

  const updateItem = async (id) => {
    const newPrice = prompt("ใส่ราคาใหม่:");

    if (newPrice === null) return;

    await axios.put(`http://localhost:5000/comset/update/${id}`, {
      price: newPrice,
    });

    loadData();
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
