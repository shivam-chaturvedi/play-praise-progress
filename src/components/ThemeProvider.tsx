import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type CustomTheme = "default" | "ocean" | "sunset" | "forest";

interface ThemeProviderContextType {
  theme: Theme;
  customTheme: CustomTheme;
  setTheme: (theme: Theme) => void;
  setCustomTheme: (theme: CustomTheme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultCustomTheme = "default",
  storageKey = "ui-theme",
  customStorageKey = "ui-custom-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultCustomTheme?: CustomTheme;
  storageKey?: string;
  customStorageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [customTheme, setCustomTheme] = useState<CustomTheme>(
    () => (localStorage.getItem(customStorageKey) as CustomTheme) || defaultCustomTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply custom theme
    root.classList.remove("theme-ocean", "theme-sunset", "theme-forest");
    if (customTheme !== "default") {
      root.classList.add(`theme-${customTheme}`);
    }
  }, [theme, customTheme]);

  const value = {
    theme,
    customTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setCustomTheme: (theme: CustomTheme) => {
      localStorage.setItem(customStorageKey, theme);
      setCustomTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};