import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";
import "./login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { startLoading } = useLoading();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/beforehome");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: t("login.required.title"),
        text: t("login.required.text"),
      });
      return;
    }

    setLoading(true);
    const stopLoading = startLoading();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: t("login.failed.title"),
          text: data.error || t("login.failed.text"),
        });

        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      stopLoading();

      await Swal.fire({
        icon: "success",
        title: t("login.success.title"),
        text: t("login.success.text", { user: data.user.username }),
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/beforehome");

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("login.error.title"),
        text: t("login.error.text"),
      });
    } finally {
      stopLoading();
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login" onSubmit={handleSubmit}>

        <h2>✨ {t("login.title")}</h2>

        <input
          type="text"
          placeholder={t("login.username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder={t("login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? t("login.loading") : t("login.submit")}
        </button>

      </form>
    </div>
  );
}

export default Login;
