import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";
import Swal from "sweetalert2";

function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { startLoading } = useLoading();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bounceCart, setBounceCart] = useState(false);
  const [search, setSearch] = useState("");

  // 🔥 loading state (เพิ่มใหม่)
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ⏳ Skeleton timer
  useEffect(() => {
    const stopLoading = startLoading();
    const timer = setTimeout(() => {
      setLoading(false);
      stopLoading();
    }, 1500);

    return () => {
      clearTimeout(timer);
      stopLoading();
    };
  }, [startLoading]);

  const showPopup = (type, message) => Swal.fire({
    icon: type,
    title: type === "error" ? t("login.error.title") : t("recommend.success"),
    text: message,
    confirmButtonText: t("alert.ok"),
    confirmButtonColor: "#b5f36d",
    timer: type === "success" ? 850 : undefined,
    showConfirmButton: type !== "success",
    timerProgressBar: type === "success",
  });

  const items = [
    { id: 1, title: "Valorant", img: "/valorant.png" },
    { id: 2, title: "Call of Duty", img: "/call%20of%20duty.png" },
    { id: 3, title: "Dead by Daylight", img: "/dead%20by%20daylight.png" },
    { id: 4, title: "CSGO", img: "/csgo.png" },
    { id: 5, title: "GTA V", mark: "V" },
    { id: 6, title: "Minecraft", mark: "M" },
    { id: 7, title: "Photoshop", mark: "Ps" },
    { id: 8, title: "Premiere Pro", mark: "Pr" },
    { id: 9, title: "VS Code", mark: "‹/›" },
    { id: 10, title: "Figma", mark: "F" },
    { id: 11, title: "Blender", mark: "B" },
    { id: 12, title: "Unity Engine", mark: "U" },
    { id: 13, title: "Unreal Engine", mark: "U" },
    { id: 14, title: "Spotify", mark: "≋" },
    { id: 15, title: "Discord", mark: "◡" },
  ];

  const itemRequirements = {
    1: { cpu: "Intel Core i3-540 / AMD Athlon 200GE", gpu: "Intel HD 4000 / Radeon R5 200", ram: "4 GB", storage: "ประมาณ 30 GB", os: "Windows 10/11 64-bit" },
    2: { cpu: "Intel Core i5-6600 / Ryzen 5 1400", gpu: "GTX 960 / Radeon RX 470 / Intel Arc A580", ram: "8 GB", storage: "SSD, ประมาณ 128 GB", os: "Windows 10 64-bit" },
    3: { cpu: "Intel Core i3-4170 / AMD FX-8120", gpu: "GeForce GTX 460 1 GB / Radeon HD 6850 1 GB", ram: "8 GB", storage: "50 GB", os: "Windows 10 64-bit" },
    4: { cpu: "Intel Core i5-750 หรือ CPU 4 threads", gpu: "DirectX 11, VRAM อย่างน้อย 1 GB", ram: "8 GB", storage: "85 GB", os: "Windows 10" },
    5: { cpu: "Intel Core i7-4770 / AMD FX-9590", gpu: "GTX 1630 4 GB / Radeon RX 6400 4 GB", ram: "8 GB", storage: "SSD 105 GB", os: "Windows 10 64-bit" },
    6: { cpu: "4-core เช่น Intel Core i3-10100 / Ryzen 3 3100", gpu: "GTX 950 / Radeon RX 460 หรือเทียบเท่า", ram: "8 GB (การ์ดจอแยก) / 12 GB (ออนบอร์ด)", storage: "พื้นที่ว่างสำหรับเกมและโลกที่บันทึก", os: "Windows 10 64-bit หรือใหม่กว่า" },
    7: { cpu: "CPU หลายคอร์ รองรับ AVX2", gpu: "DirectX 12, VRAM อย่างน้อย 1.5 GB", ram: "8 GB", storage: "พื้นที่ว่าง 10 GB, แนะนำ SSD", os: "Windows 10/11 64-bit" },
    8: { cpu: "Intel Gen 6+ / Ryzen 1000+ รองรับ AVX2", gpu: "VRAM อย่างน้อย 2 GB", ram: "8 GB (ขั้นต่ำสำหรับงาน HD)", storage: "พื้นที่ว่าง 8 GB และควรมี SSD สำหรับไฟล์งาน", os: "Windows 10 64-bit" },
    9: { cpu: "โปรเซสเซอร์ 1.6 GHz ขึ้นไป", gpu: "การ์ดจอที่รองรับ DirectX 10", ram: "1 GB", storage: "พื้นที่ว่างประมาณ 500 MB", os: "Windows 10/11 64-bit" },
    10: { cpu: "CPU แบบหลายคอร์รุ่นใหม่", gpu: "GPU ที่รองรับการเร่งผลผ่านเบราว์เซอร์", ram: "แนะนำ 8 GB ขึ้นไป", storage: "พื้นที่ว่างสำหรับแอปและไฟล์งาน", os: "Windows 10/11 และเบราว์เซอร์รุ่นใหม่" },
    11: { cpu: "CPU 4 คอร์ขึ้นไป", gpu: "VRAM อย่างน้อย 2 GB", ram: "8 GB", storage: "พื้นที่ว่างประมาณ 2 GB, แนะนำ SSD", os: "Windows 10/11 64-bit" },
    12: { cpu: "CPU 4 คอร์ขึ้นไป", gpu: "การ์ดจอรองรับ DirectX 10 หรือใหม่กว่า", ram: "8 GB แนะนำขึ้นไป", storage: "พื้นที่ว่าง 10 GB ขึ้นไปตามโมดูลที่ติดตั้ง", os: "Windows 10 64-bit" },
    13: { cpu: "Intel/AMD 4 คอร์ 2.5 GHz ขึ้นไป", gpu: "การ์ดจอ DirectX 12, VRAM 8 GB แนะนำ", ram: "32 GB แนะนำ", storage: "แนะนำ SSD และพื้นที่ว่างตามโปรเจกต์", os: "Windows 10/11 64-bit" },
    14: { cpu: "โปรเซสเซอร์ 2 คอร์รุ่นใหม่", gpu: "การ์ดจอออนบอร์ดใช้งานได้", ram: "4 GB แนะนำ", storage: "พื้นที่ว่างประมาณ 1 GB", os: "Windows 10/11 และอินเทอร์เน็ต" },
    15: { cpu: "โปรเซสเซอร์ 2 คอร์ 1.5 GHz ขึ้นไป", gpu: "การ์ดจอรองรับการเร่งผลผ่านแอป", ram: "4 GB แนะนำ", storage: "พื้นที่ว่างประมาณ 500 MB", os: "Windows 10/11 64-bit" },
  };

  const showItemSpecs = (item) => {
    const requirements = itemRequirements[item.id];
    const fields = [
      [t("pc.cpu"), requirements.cpu],
      [t("pc.gpu"), requirements.gpu],
      [t("pc.ram"), requirements.ram],
      [t("pc.storage"), requirements.storage],
      [language === "th" ? "ระบบปฏิบัติการ" : "Operating system", requirements.os],
    ];
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);

    Swal.fire({
      title: item.id === 2 ? "Call of Duty: Black Ops 6" : item.id === 4 ? "Counter-Strike 2 (CSGO)" : item.id === 5 ? "GTA V Enhanced" : item.title,
      html: `<div class="game-spec-popup">
        <p class="game-spec-heading">${language === "th" ? "สเปกขั้นต่ำโดยประมาณ" : "Approximate minimum requirements"}</p>
        <div class="game-spec-grid">${fields.map(([label, value]) => `
          <div class="game-spec-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
        `).join("")}</div>
        <p class="game-spec-note">${language === "th" ? "ข้อกำหนดอาจเปลี่ยนตามเวอร์ชันเกม โปรแกรม และคุณภาพกราฟิกที่เลือก" : "Requirements can vary by version and graphics settings."}</p>
      </div>`,
      confirmButtonText: t("alert.ok"),
      confirmButtonColor: "#b5f36d",
      showCloseButton: true,
    });
  };

  const cartOrder = new Map(cart.map((item, index) => [item.id, index]));
  const filteredItems = items
    .filter((item) => item.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      const aOrder = cartOrder.has(a.id) ? cartOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
      const bOrder = cartOrder.has(b.id) ? cartOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });

  const addToCart = (item) => {
    if (cart.some((c) => c.id === item.id)) return;

    setCart([...cart, item]);

    setBounceCart(false);
    setTimeout(() => setBounceCart(true), 10);
    setTimeout(() => setBounceCart(false), 400);
  };

  const handleConfirm = async () => {
    if (cart.length === 0) {
      await showPopup("error", t("home.needItem"));
      return;
    }

    setIsCartOpen(false);
    const stopLoading = startLoading();
    try {
      await showPopup("success", t("home.continue"));
      navigate("/SAW", { state: { cart } });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="home-container">

      <button className="home-back-button" onClick={() => navigate("/beforehome")}>
        <span aria-hidden="true">←</span> {t("home.back")}
      </button>

      <header className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">{t("home.kicker")}</span>
          <h1>PIM TO BUY COM</h1>
          <p>{t("home.subtitle")}</p>
        </div>
        <label className="search-box">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.2 4.2" />
          </svg>
          <input
            placeholder={t("home.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </header>

      {/* LIST */}
      <section className="category-section">
        <div className="home-section-heading">
          <div>
            <span>{t("home.collection")}</span>
            <h2>{t("home.category")}</h2>
          </div>
          <span className="home-item-count">{t("home.count", { count: filteredItems.length })}</span>
        </div>

        <div className="games-list">
          {/* 🔥 SKELETON LOADING */}
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="no-result">{t("home.empty")}</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="game-card">
                <button
                  className="game-details-trigger"
                  type="button"
                  onClick={() => showItemSpecs(item)}
                  aria-label={`${item.title}: ${language === "th" ? "ดูสเปกขั้นต่ำ" : "view minimum requirements"}`}
                >
                {item.img ? (
                  <img src={item.img} alt="" />
                ) : (
                  <div className={`game-art game-art-${item.id}`} aria-hidden="true">
                    <span>{item.mark}</span>
                  </div>
                )}
                <h3>{item.title}</h3>
                <span className="game-details-hint">{language === "th" ? "ดูสเปกที่ต้องการ" : "View requirements"}</span>
                </button>

                <button
                  className="add-button"
                  onClick={() => addToCart(item)}
                  disabled={cart.some((c) => c.id === item.id)}
                >
                  {cart.some((c) => c.id === item.id)
                    ? t("home.added")
                    : t("home.add")}
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
          <div className="cart-popup-header">
            <div>
              <span className="cart-popup-eyebrow">{t("home.cartLabel")}</span>
              <h3>{t("home.cart")}</h3>
            </div>
            <span className="cart-popup-count">{cart.length}</span>
          </div>

          {cart.length === 0 ? (
            <p className="cart-empty">{t("home.cartEmpty")}</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="cart-li">
                  <span className="cart-item-name">{item.title}</span>
                  <button
                    className="delete-btn"
                    aria-label={t("home.remove", { item: item.title })}
                    title={t("home.remove", { item: item.title })}
                    onClick={() =>
                      setCart(cart.filter((c) => c.id !== item.id))
                    }
                  >
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m5 5 10 10M15 5 5 15" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button className="confirm-button" onClick={handleConfirm}>
            {t("home.confirm")}
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3.5 10h12m-5-5 5 5-5 5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
