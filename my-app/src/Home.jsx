import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bounceCart, setBounceCart] = useState(false);
  const [search, setSearch] = useState("");

  // 🔥 loading state (เพิ่มใหม่)
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ⏳ Skeleton timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });

    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 2000);
  };

  const items = [
    { id: 1, title: "Valorant", img: "https://picsum.photos/300?1" },
    { id: 2, title: "Call of Duty", img: "https://picsum.photos/300?2" },
    { id: 3, title: "Dead by Daylight", img: "https://picsum.photos/300?3" },
    { id: 4, title: "CSGO", img: "https://picsum.photos/300?4" },
    { id: 5, title: "GTA V", img: "https://picsum.photos/300?5" },
    { id: 6, title: "Minecraft", img: "https://picsum.photos/300?6" },
    { id: 7, title: "Photoshop", img: "https://picsum.photos/300?7" },
    { id: 8, title: "Premiere Pro", img: "https://picsum.photos/300?8" },
    { id: 9, title: "VS Code", img: "https://picsum.photos/300?9" },
    { id: 10, title: "Figma", img: "https://picsum.photos/300?10" },
    { id: 11, title: "Blender", img: "https://picsum.photos/300?11" },
    { id: 12, title: "Unity Engine", img: "https://picsum.photos/300?12" },
    { id: 13, title: "Unreal Engine", img: "https://picsum.photos/300?13" },
    { id: 14, title: "Spotify", img: "https://picsum.photos/300?14" },
    { id: 15, title: "Discord", img: "https://picsum.photos/300?15" },
  ];

  const filteredItems = items.filter((i) =>
    i.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  const addToCart = (item) => {
    if (cart.some((c) => c.id === item.id)) return;

    setCart([...cart, item]);

    setBounceCart(false);
    setTimeout(() => setBounceCart(true), 10);
    setTimeout(() => setBounceCart(false), 400);
  };

  const handleConfirm = () => {
    if (cart.length === 0) {
      showPopup("error", "⚠️ กรุณาเลือกสินค้า");
      return;
    }

    showPopup("success", "✔ ไปหน้าถัดไป...");

    setTimeout(() => {
      navigate("/SAW", { state: { cart } });
    }, 800);
  };

  return (
    <div className="home-container">

      <h1>PIM TO BUY COM</h1>

      {/* SEARCH */}
      <div className="search-box">
        <input
          placeholder="ค้นหาเกม / แอพ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* POPUP */}
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      {/* LIST */}
      <section className="category-section">
        <h2>Games & Apps</h2>

        <div className="games-list">
          {/* 🔥 SKELETON LOADING */}
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="no-result">ไม่พบรายการ</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="game-card">
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>

                <button
                  className="add-button"
                  onClick={() => addToCart(item)}
                  disabled={cart.some((c) => c.id === item.id)}
                >
                  {cart.some((c) => c.id === item.id)
                    ? "Added ✓"
                    : "Add +"}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CART ICON */}
      <div
        className={`cart-icon ${bounceCart ? "bounce" : ""}`}
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        🛒
        {cart.length > 0 && (
          <span className="cart-count">{cart.length}</span>
        )}
      </div>

      {/* CART POPUP */}
      {isCartOpen && (
        <div className="cart-popup">
          <h3>Your Cart</h3>

          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-li">
                {item.title}
                <button
                  className="delete-btn"
                  onClick={() =>
                    setCart(cart.filter((c) => c.id !== item.id))
                  }
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <button className="confirm-button" onClick={handleConfirm}>
            Confirm Purchase
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;