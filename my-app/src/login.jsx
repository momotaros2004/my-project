import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/beforehome");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Login failed"}`);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      navigate("/beforehome", { replace: true });

    } catch (err) {
      setMessage("⚠️ Cannot connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Login"}
        </button>

        {/* Cyber Loader */}
        {loading && (
          <div className="cyber-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        {message && <p style={{ color: "red" }}>{message}</p>}

      </form>
    </div>
  );
}

export default Login;
