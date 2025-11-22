import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // SAW Popup state
    // SAW Popup State
  const [isSAWOpen, setIsSAWOpen] = useState(false);
const [performance, setPerformance] = useState("");
const [price, setPrice] = useState("");
const [upgrade, setUpgrade] = useState("");
const [efficiency, setEfficiency] = useState("");



  // เปิด popup SAW
  const openSAW = () => {
    setIsSAWOpen(true);
    setIsCartOpen(false);
  };

  // ไปหน้า Recommend2
  const goNext = () => {
    navigate("/recommend2");
  };

  const games = [
    { id: 1, title: "Valorant", img: "/valorant.png", category: "play", specs: { cpu: "Intel i3-4150", gpu: "NVIDIA GeForce GT 730", ram: "4 GB", price: 8000 }},
    { id: 2, title: "Call of duty", img: "/call of duty.png", category: "play", specs: { cpu: "Intel i5-7400", gpu: "NVIDIA GTX 1050", ram: "8 GB", price: 12000 }},
    { id: 3, title: "Dead by daylight", img: "/dead by daylight.png", category: "play", specs: { cpu: "Intel i7-7700", gpu: "NVIDIA GTX 1060", ram: "16 GB", price: 18000 }},
    { id: 4, title: "csgo", img: "/csgo.png", category: "work", specs: { cpu: "Intel i3-6100", gpu: "Intel HD Graphics 530", ram: "4 GB", price: 7000 }},
    { id: 5, title: "Delta force", img: "/delta force.jpeg", category: "work", specs: { cpu: "Intel i5-6500", gpu: "Intel HD Graphics 530", ram: "8 GB", price: 10000 }},
    { id: 6, title: "Game", img: "https://via.placeholder.com/200x120?text=Design+Tool", category: "work", specs: { cpu: "Intel i7-7700", gpu: "NVIDIA GTX 1050", ram: "16 GB", price: 16000 }},
    { id: 7, title: "Game", img: "https://via.placeholder.com/200x120?text=Chess+Master", category: "play", specs: { cpu: "Intel i3-4150", gpu: "Intel HD Graphics 4400", ram: "4 GB", price: 6000 }},
    { id: 8, title: "Photo Editor", img: "https://via.placeholder.com/200x120?text=Photo+Editor", category: "work", specs: { cpu: "Intel i5-7500", gpu: "NVIDIA GTX 1050 Ti", ram: "8 GB", price: 14000 }},
    { id: 9, title: "Space Shooter", img: "https://via.placeholder.com/200x120?text=Space+Shooter", category: "play", specs: { cpu: "Intel i7-8700", gpu: "NVIDIA GTX 1070", ram: "16 GB", price: 22000 }},
    { id: 10, title: "Note Keeper", img: "https://via.placeholder.com/200x120?text=Note+Keeper", category: "work", specs: { cpu: "Intel i3-7100", gpu: "Intel HD Graphics 630", ram: "4 GB", price: 7500 }},
  ];

  const addToCart = (game) => {
    if (!cart.find((item) => item.id === game.id)) {
      setCart([...cart, game]);
    }
  };

  const toggleCartPopup = () => {
    setIsCartOpen(!isCartOpen);
  };

  const playGames = games.filter((game) => game.category === "play");
  const workGames = games.filter((game) => game.category === "work");

  return (
    <div className="home-container">
      <h1>PIM TO BUY COM</h1>
      <p>Select games to add to your cart.</p>

      {/* เล่นเกม */}
      <section className="category-section">
        <h2>เล่นเกม</h2>
        <div className="games-list">
          {playGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.img} alt={game.title} className="game-image" />
              <h3>{game.title}</h3>

              <button
                className="add-button"
                onClick={() => addToCart(game)}
                disabled={cart.find((item) => item.id === game.id)}
              >
                {cart.find((item) => item.id === game.id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ทำงาน */}
      <section className="category-section">
        <h2>ทำงาน</h2>
        <div className="games-list">
          {workGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.img} alt={game.title} className="game-image" />
              <h3>{game.title}</h3>

              <button
                className="add-button"
                onClick={() => addToCart(game)}
                disabled={cart.find((item) => item.id === game.id)}
              >
                {cart.find((item) => item.id === game.id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ไอคอนตะกร้าลอย */}
      <div className="cart-icon" onClick={toggleCartPopup}>
        🛒
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {/* Cart Popup */}
      {isCartOpen && (
        <div className="cart-popup">
          <h3>Your Cart ({cart.length} games)</h3>

          <ul>
            {cart.length === 0 ? (
              <li style={{ background: "none", color: "#aaa", textAlign: "center" }}>
                Your cart is empty
              </li>
            ) : (
              cart.map((item) => (
                <li key={item.id} className="cart-li">
                  <span>{item.title}</span>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      setCart(cart.filter((g) => g.id !== item.id))
                    }
                  >
                    ❌
                  </button>
                </li>
              ))
            )}
          </ul>

          {cart.length > 0 && (
            <button className="confirm-button" onClick={openSAW}>
              Confirm Purchase
            </button>
          )}
        </div>
      )}

{/* SAW Popup */}
{isSAWOpen && (
  <div className="saw-overlay">
    <div className="saw-popup">

      <button className="saw-close" onClick={() => setIsSAWOpen(false)}>
        ✕
      </button>

      <h2>SAW</h2>
      <p>
        โปรดใส่ค่าน้ำหนักที่สะท้อนความสำคัญในการเลือกคอมพิวเตอร์ของคุณ
      </p>

      <div className="saw-item">
        <label>Performance (ประสิทธิภาพ)</label>
        <select
          value={performance}
          onChange={(e) => setPerformance(e.target.value)}
        >
          <option value="">-- เลือกค่า --</option>
          <option value="0.25">0.25</option>
          <option value="0.5">0.5</option>
          <option value="0.4">0.4</option>
          <option value="0.3">0.3</option>
          <option value="0.6">0.6</option>
          <option value="0.7">0.7</option>
        </select>
      </div>

      <div className="saw-item">
        <label>Price (ราคา)</label>
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">-- เลือกค่า --</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>
      </div>

      <div className="saw-item">
        <label>Upgrade (อัปเกรดได้)</label>
        <select
          value={upgrade}
          onChange={(e) => setUpgrade(e.target.value)}
        >
          <option value="">-- เลือกค่า --</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>
      </div>

      <div className="saw-item">
        <label>Efficiency (การใช้งานยาวนาน)</label>
        <select
          value={efficiency}
          onChange={(e) => setEfficiency(e.target.value)}
        >
          <option value="">-- เลือกค่า --</option>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>
      </div>

      {/* ปุ่ม Next → Recommend2 */}
      <button className="saw-next" onClick={goNext}>
        Next
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default Home;
