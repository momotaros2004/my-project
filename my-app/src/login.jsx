import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
=======
  const [message, setMessage] = useState("");
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/beforehome");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอก username และ password",
      });
      return;
    }

=======
    setMessage("");
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
<<<<<<< HEAD
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: data.error || "Username หรือ Password ไม่ถูกต้อง",
        });
=======
        setMessage(`❌ ${data.error || "Login failed"}`);
        setLoading(false);
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

<<<<<<< HEAD
      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: `ยินดีต้อนรับ ${data.user.username}`,
        timer: 1500,
        showConfirmButton: false,
        backdrop: true,
      });

      navigate("/beforehome");
=======
      navigate("/beforehome", { replace: true });
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login" onSubmit={handleSubmit}>
<<<<<<< HEAD
        <h2>Welcome Back 👋</h2>
=======
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
=======
          disabled={loading}
          required
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
=======
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

>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
      </form>
    </div>
  );
}

export default Login;