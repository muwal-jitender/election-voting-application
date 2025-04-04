import React, { createContext, useContext, useEffect, useState } from "react";
import { getTheme, setTheme } from "utils/theme.utils";

// 🎯 Define the shape of the ThemeContext
type ThemeContextType = {
  name: "dark" | "light";
  toggleTheme: () => void;
};

// 🌐 Create the ThemeContext with default values
const ThemeContext = createContext<ThemeContextType>({
  name: "light", // default theme
  toggleTheme: () => {}, // placeholder
});

// 🌙 ThemeProvider wraps the app and provides theme state
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 🧠 Load the theme from localStorage or default
  const [theme, setDarkTheme] = useState(getTheme());

  // 🔁 Toggles and persists the theme
  const themeHandler = () => {
    setTheme(setDarkTheme); // handles both state update and persistence
  };

  // 🖌 Apply the current theme to the <body> element on every change
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ name: theme, toggleTheme: themeHandler }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🪝 Custom hook for using the theme context in any component
export const useTheme = () => useContext(ThemeContext);
