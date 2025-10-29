import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";
import { ThemeContext } from "../../context/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    console.error("ThemeToggle must be used within a ThemeProvider");
    return null;
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}>
      <IconButton onClick={toggleTheme} color='inherit'>
        {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Box>
  );
};
