import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Storage keys
const THEME_STORAGE_KEY = '@theme_settings';

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
        'sans-serif-condensed-medium'
    ]
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedFont, setSelectedFont] = useState('normal');

    // Load saved settings when the app starts
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSettings = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedSettings) {
                    const { isDarkMode: savedDarkMode, selectedFont: savedFont } = JSON.parse(savedSettings);
                    setIsDarkMode(savedDarkMode);
                    setSelectedFont(savedFont);
                }
            } catch (error) {
                console.error('Error loading theme settings:', error);
            }
        };
        loadSettings();
    }, []);

    // Save settings whenever they change
    const updateDarkMode = async (value) => {
        setIsDarkMode(value);
        try {
            const currentSettings = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            const settings = currentSettings ? JSON.parse(currentSettings) : {};
            settings.isDarkMode = value;
            await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving dark mode setting:', error);
        }
    };

    const updateSelectedFont = async (font) => {
        setSelectedFont(font);
        try {
            const currentSettings = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            const settings = currentSettings ? JSON.parse(currentSettings) : {};
            settings.selectedFont = font;
            await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving font setting:', error);
        }
    };

    const theme = {
        isDarkMode,
        setIsDarkMode: updateDarkMode,
        selectedFont,
        setSelectedFont: updateSelectedFont,
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





