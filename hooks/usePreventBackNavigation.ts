// hooks/usePreventBackNavigation.ts
import { useEffect } from "react";

export function usePreventBackNavigation() {
  useEffect(() => {
    const handlePopState = () => {
      // Force the user to stay on the same page
      history.go(1);
    };

    // Push a new state so the back button has something to "go back" to
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
}
