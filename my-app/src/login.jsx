import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Login failed"}`);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      navigate("/beforehome");
    } catch (err) {
      setMessage("⚠️ Cannot connect to server");
    }
  };

  return (
    <div className="login-container">
      <form className="login" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

  

     
      
    </div>
  );
}

export default Login;
