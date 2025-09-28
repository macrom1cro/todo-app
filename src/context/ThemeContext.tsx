import React, { createContext, useState, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../theme/themes";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  currentTheme: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: currentTheme.primary,
      },
      secondary: {
        main: currentTheme.secondary,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <StyledThemeProvider theme={currentTheme}>
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
