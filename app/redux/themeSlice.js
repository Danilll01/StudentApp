import { createSlice } from '@reduxjs/toolkit'
import { Appearance } from 'react-native';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: Appearance.getColorScheme(),
  },
  reducers: {
    toggleTheme(state) {
        state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    },
  },
})

export const { toggleTheme } = themeSlice.actions;

export const getCurrentTheme = state => state.persistedReducer.theme.currentTheme;

export default themeSlice.reducer;