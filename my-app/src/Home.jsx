import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const games = [
    {
      id: 1,
      title: "Valorant",
      img: "/valorant.png",
      category: "play",
      specs: { cpu: "Intel i3-4150", gpu: "NVIDIA GeForce GT 730", ram: "4 GB", price: 8000 },
    },
    {
      id: 2,
      title: "Call of duty",
      img: "/call of duty.png",
      category: "play",
      specs: { cpu: "Intel i5-7400", gpu: "NVIDIA GTX 1050", ram: "8 GB", price: 12000 },
    },
    {
      id: 3,
      title: "Dead by daylight",
      img: "/dead by daylight.png",
      category: "play",
      specs: { cpu: "Intel i7-7700", gpu: "NVIDIA GTX 1060", ram: "16 GB", price: 18000 },
    },
    {
      id: 4,
      title: "csgo",
      img: "/csgo.png",
      category: "work",
      specs: { cpu: "Intel i3-6100", gpu: "Intel HD Graphics 530", ram: "4 GB", price: 7000 },
    },
    {
      id: 5,
      title: "Delta force",
      img: "/delta force.jpeg",
      category: "work",
      specs: { cpu: "Intel i5-6500", gpu: "Intel HD Graphics 530", ram: "8 GB", price: 10000 },
    },
    {
      id: 6,
      title: "Design Tool",
      img: "https://via.placeholder.com/200x120?text=Design+Tool",
      category: "work",
      specs: { cpu: "Intel i7-7700", gpu: "NVIDIA GTX 1050", ram: "16 GB", price: 16000 },
    },
    {
      id: 7,
      title: "Chess Master",
      img: "https://via.placeholder.com/200x120?text=Chess+Master",
      category: "play",
      specs: { cpu: "Intel i3-4150", gpu: "Intel HD Graphics 4400", ram: "4 GB", price: 6000 },
    },
    {
      id: 8,
      title: "Photo Editor",
      img: "https://via.placeholder.com/200x120?text=Photo+Editor",
      category: "work",
      specs: { cpu: "Intel i5-7500", gpu: "NVIDIA GTX 1050 Ti", ram: "8 GB", price: 14000 },
    },
    {
      id: 9,
      title: "Space Shooter",
      img: "https://via.placeholder.com/200x120?text=Space+Shooter",
      category: "play",
      specs: { cpu: "Intel i7-8700", gpu: "NVIDIA GTX 1070", ram: "16 GB", price: 22000 },
    },
    {
      id: 10,
      title: "Note Keeper",
      img: "https://via.placeholder.com/200x120?text=Note+Keeper",
      category: "work",
      specs: { cpu: "Intel i3-7100", gpu: "Intel HD Graphics 630", ram: "4 GB", price: 7500 },
    },
  ];

  const addToCart = (game) => {
    if (!cart.find((item) => item.id === game.id)) {
      setCart([...cart, game]);
    }
  };

  const confirmCart = () => {
    navigate("/recommend", { state: { cart } });
  };

  const playGames = games.filter((game) => game.category === "play");
  const workGames = games.filter((game) => game.category === "work");

  return (
    <div className="home-container">
      <h1>PIM TO BUY COM</h1>
      <p>Select games to add to your cart.</p>

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

      <div className="cart-section">
        <h2>Your Cart ({cart.length} games)</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
        {cart.length > 0 && (
          <button className="confirm-button" onClick={confirmCart}>
            Confirm Purchase
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
