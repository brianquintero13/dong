'use client';
import React, { createContext, useContext, useState } from 'react';

// Create a context to hold our theme state
const ThemeContext = createContext<{
    isRetroTheme: boolean;
    setIsRetroTheme: (val: boolean) => void;
}>({
    isRetroTheme: false, // Default to Accessible View
    setIsRetroTheme: () => {},
});

// Create a provider to wrap around our app
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isRetroTheme, setIsRetroTheme] = useState(false);

    return (
        <ThemeContext.Provider value={{ isRetroTheme, setIsRetroTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Create a custom hook so any file can instantly access the theme
export const useTheme = () => useContext(ThemeContext);