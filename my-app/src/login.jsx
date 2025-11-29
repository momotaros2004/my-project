import React, { useState } from "react";
import "./login.css"; // ใช้ CSS ที่คุณให้มา

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", username, password);
  };

  return (
    <div className="login-page">
      
      {/* Glow Effect */}
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      {/* Login Box */}
      <div className="login-container">
        <h2 className="login-title">Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
