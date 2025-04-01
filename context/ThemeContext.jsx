import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

const ThemeContext = createContext();

// Expanded font selections for each platform
const FONTS = {
    ios: [
        'normal',  // Added normal option
        'American Typewriter',
        'Avenir',
        'Baskerville',
        'Bodoni 72',
        'Bradley Hand',
        'Chalkboard SE',
        'Cochin',
        'Copperplate',
        'Courier New',
        'Didot',
        'Futura',
        'Georgia',
        'Gill Sans',
        'Helvetica',
        'Helvetica Neue',
        'Hoefler Text',
        'Marker Felt',
        'Menlo',
        'Noteworthy',
        'Optima',
        'Palatino',
        'Papyrus',
        'Party LET',
        'San Francisco',
        'Snell Roundhand',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana'
    ],
    android: [
        'normal',
        'notoserif',
        'sans-serif',
        'sans-serif-light',
        'sans-serif-thin',
        'sans-serif-condensed',
        'sans-serif-medium',
        'serif',
        'Roboto',
        'monospace',
        'serif-monospace',
        'casual',
        'cursive',
        'sans-serif-smallcaps',
        'sans-serif-condensed-light',
        'sans-serif-black',
        'serif-monospace',
        'sans-serif-condensed-medium'
    ]
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedFont, setSelectedFont] = useState('normal');  // Changed default to 'normal' for both platforms

    const theme = {
        isDarkMode,
        setIsDarkMode,
        selectedFont,
        setSelectedFont,
        availableFonts: FONTS[Platform.OS],
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





