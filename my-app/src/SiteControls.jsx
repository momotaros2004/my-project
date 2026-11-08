import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";
import { isAdminUser } from "./auth";

function SiteControls() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { startLoading } = useLoading();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const isAdmin = isAuthenticated && isAdminUser();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current === "/home" && location.pathname !== "/home") {
      localStorage.removeItem("cart");
    }
    previousPath.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const showButtonLoading = (event) => {
      const clickedElement = event.target instanceof Element ? event.target : null;
      const action = clickedElement?.closest("button:not(:disabled), .before-box");

      if (!clickedElement?.closest("#root") || !action || action.closest(".site-controls") || action.hasAttribute("data-no-loading")) return;

      const stopLoading = startLoading();
      window.setTimeout(stopLoading, 450);
    };

    document.addEventListener("click", showButtonLoading, true);
    return () => document.removeEventListener("click", showButtonLoading, true);
  }, [startLoading]);

  return (
    <div className="site-controls">
      <button
        className="language-toggle"
        type="button"
        aria-label={t("language.switch")}
        title={t("language.switch")}
        onClick={toggleLanguage}
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.25" />
          <path d="M2.9 10h14.2M10 2.75c1.7 1.85 2.55 4.27 2.55 7.25s-.85 5.4-2.55 7.25C8.3 15.4 7.45 12.98 7.45 10S8.3 4.6 10 2.75Z" />
        </svg>
        <span>{language === "th" ? "EN" : "ไทย"}</span>
      </button>
      {isAuthenticated && <ProfileMenu key={location.pathname} isAdmin={isAdmin} />}
    </div>
  );
}

export default SiteControls;
