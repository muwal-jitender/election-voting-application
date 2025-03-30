import React, { createContext, useContext, useEffect, useState } from "react";
import { getTheme, setTheme } from "utils/theme.utils";

type ThemeContextType = {
  name: "dark" | "light";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  name: "light",
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setDarkTheme] = useState(getTheme());
  const themeHandler = () => {
    setTheme(setDarkTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ name: theme, toggleTheme: themeHandler }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
