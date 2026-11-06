import { useLanguage } from "./LanguageContext";
import { useLoading } from "./LoadingContext";

function LoadingOverlay() {
  const { isLoading } = useLoading();
  const { t } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className="loading-backdrop" role="alert" aria-live="polite" aria-busy="true">
      <div className="loading-popup">
        <div className="loading-popup-heading">
          <span className="loading-spinner" aria-hidden="true" />
          <div>
            <strong>{t("loading.title")}</strong>
            <span>{t("loading.description")}</span>
          </div>
        </div>
        <div className="loading-skeleton" aria-hidden="true">
          <span className="loading-skeleton-line loading-skeleton-line-wide" />
          <span className="loading-skeleton-line" />
          <span className="loading-skeleton-line loading-skeleton-line-short" />
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;
