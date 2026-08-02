import React, { createContext, useState } from "react";

export const ThemeContext = createContext({
  theme: "dark-theme",
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, protoSetTheme] = useState("dark-theme");
  const setTheme = (newTheme) => {
    protoSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
