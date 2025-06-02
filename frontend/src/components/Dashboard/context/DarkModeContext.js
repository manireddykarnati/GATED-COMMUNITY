import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    shape: {
      borderRadius: 12,
    },
  }), [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};
