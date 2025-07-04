import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.theme.theme) || 'light';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    AsyncStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    AsyncStorage.getItem('theme').then((value) => {
      if (value) dispatch(setTheme(value));
    });
  }, [dispatch]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};