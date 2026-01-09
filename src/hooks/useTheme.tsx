import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "planner-theme";

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Initialize from localStorage or system preference
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
      let initial: Theme = "light";

      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }

      setThemeState(initial);
      applyThemeClass(initial);
      window.localStorage.setItem(STORAGE_KEY, initial);
    } catch {
      // If anything goes wrong, just fall back to light without crashing
      setThemeState("light");
      applyThemeClass("light");
    }
  }, []);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    applyThemeClass(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
