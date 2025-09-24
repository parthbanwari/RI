import { useState, useEffect, useCallback } from "react";
import { saveTheme, getTheme } from "../utils/storage";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => getTheme() || "light");

  const applyTheme = useCallback((newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!getTheme()) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [applyTheme, theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };
};
