import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recommend.css";

function Recommend() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };

  if (cart.length === 0) {
    return (
      <div className="recommend-container">
        <h2>No games selected</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // หา specs ที่แรงสุด (สมมติแรงกว่าคือราคาแพงกว่า)
  const maxSpec = cart.reduce(
    (acc, game) => (game.specs.price > acc.price ? game.specs : acc),
    { cpu: "", gpu: "", ram: "", price: 0 }
  );

  // รวมราคาเกมในตะกร้า
  const totalGamePrice = cart.reduce((sum, game) => sum + game.specs.price, 0);

  return (
    <div className="recommend-container">
      <h1>Recommended PC Specs</h1>
      <p>Based on your selected games:</p>
      <ul>
        {cart.map((game) => (
          <li key={game.id}>{game.title}</li>
        ))}
      </ul>

      <div className="pc-specs">
        <h2>Recommended PC</h2>
        <p><strong>CPU:</strong> {maxSpec.cpu}</p>
        <p><strong>GPU:</strong> {maxSpec.gpu}</p>
        <p><strong>RAM:</strong> {maxSpec.ram}</p>
        <p><strong>Estimated PC Price:</strong> {maxSpec.price.toLocaleString()} THB</p>
      </div>

      <h3>Total Price of Selected Games: {totalGamePrice.toLocaleString()} THB</h3>

      <button onClick={() => navigate("/home")}>Back to Home</button>

    </div>
  );
}

export default Recommend;
