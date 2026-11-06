import { createContext, useCallback, useContext, useRef, useState } from "react";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const activeIds = useRef(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    const id = Symbol("loading-task");
    const startedAt = Date.now();
    activeIds.current.set(id, startedAt);
    setIsLoading(true);
    let stopRequested = false;

    return () => {
      if (stopRequested) return;
      stopRequested = true;

      const elapsed = Date.now() - startedAt;
      const minimumDisplayTime = 450;
      window.setTimeout(() => {
        if (!activeIds.current.delete(id)) return;
        if (activeIds.current.size === 0) setIsLoading(false);
      }, Math.max(0, minimumDisplayTime - elapsed));
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used inside LoadingProvider");
  return context;
}
