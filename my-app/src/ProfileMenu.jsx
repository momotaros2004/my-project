import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLanguage } from "./LanguageContext";

function ProfileMenu({ isAdmin = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const username = localStorage.getItem("username") || "User";
  const initial = username.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: t("logout.title"),
      text: t("logout.confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("profile.logout"),
      cancelButtonText: t("logout.cancel"),
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    await Swal.fire({
      icon: "success",
      title: t("logout.done"),
      timer: 1000,
      showConfirmButton: false,
    });
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-menu-root" ref={menuRef}>
      <button
        className="profile-trigger"
        type="button"
        aria-label={t("profile.open", { user: username })}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="profile-avatar" aria-hidden="true">{initial}</span>
        <span className="profile-trigger-name">{username}</span>
        <svg className={`profile-chevron ${isOpen ? "is-open" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      {isOpen && (
        <div className="profile-dropdown" role="menu">
          <span className="profile-dropdown-label">{t("profile.signedIn")}</span>
          <strong className="profile-dropdown-user">{username}</strong>
          {isAdmin && (
            <>
              <div className="profile-dropdown-divider" />
              <button
                className="profile-admin-link"
                type="button"
                role="menuitem"
                onClick={() => { setIsOpen(false); navigate("/admin"); }}
              >
                <span aria-hidden="true">⚙</span>{t("profile.adminPanel")}
              </button>
              <button
                className="profile-admin-link"
                type="button"
                role="menuitem"
                onClick={() => { setIsOpen(false); navigate("/admin/table"); }}
              >
                <span aria-hidden="true">▤</span>{t("profile.adminTable")}
              </button>
            </>
          )}
          <div className="profile-dropdown-divider" />
          <button className="profile-logout" type="button" role="menuitem" onClick={handleLogout}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 3.5H4.75A1.75 1.75 0 0 0 3 5.25v9.5c0 .97.78 1.75 1.75 1.75H8M11.5 6l4 4-4 4M15.5 10H7" />
            </svg>
            {t("profile.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
