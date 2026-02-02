import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./SAW.css";

function SAW() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [performance, setPerformance] = useState("");
  const [price, setPrice] = useState("");
  const [upgrade, setUpgrade] = useState("");
  const [efficiency, setEfficiency] = useState("");

  const handleNext = async () => {

    if (!performance || !price || !upgrade || !efficiency) {
      alert("เลือก weight ให้ครบ");
      return;
    }

    const weightData = {
      performance:Number(performance),
      price:Number(price),
      upgrade:Number(upgrade),
      efficiency:Number(efficiency)
    };

    try {

      const res = await axios.post("http://localhost:5000/api/saw/filter",{
        cart,
        weights: weightData
      });

      localStorage.setItem("saw_results",JSON.stringify(res.data));

      navigate("/sawresult");

    } catch(err){
      console.log(err);
      alert("error");
    }
  };

  return (
    <div className="saw-container">
      <div className="saw-box">

        <h2>SAW</h2>

        {["performance","price","upgrade","efficiency"].map((k,i)=>(
          <select key={i} onChange={(e)=>{
            if(k==="performance")setPerformance(e.target.value);
            if(k==="price")setPrice(e.target.value);
            if(k==="upgrade")setUpgrade(e.target.value);
            if(k==="efficiency")setEfficiency(e.target.value);
          }}>
            <option value="">เลือก {k}</option>
            <option value="0.1">0.1</option>
            <option value="0.2">0.2</option>
            <option value="0.3">0.3</option>
            <option value="0.4">0.4</option>
          </select>
        ))}

        <button onClick={handleNext}>Next</button>

      </div>
    </div>
  );
}

export default SAW;
