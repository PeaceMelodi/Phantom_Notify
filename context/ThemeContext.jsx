import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = {
        isDarkMode,
        setIsDarkMode,
        colors: {
            background: isDarkMode ? '#1A1A1A' : '#F5DFBB',
            text: isDarkMode ? '#FFFFFF' : '#2A0800',
            card: isDarkMode ? '#2A2A2A' : '#FFFFFF',
            accent: '#FC5007',
            border: isDarkMode ? '#333333' : '#FC5007',
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);