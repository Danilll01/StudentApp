import { createSlice } from '@reduxjs/toolkit'
import { Appearance } from 'react-native';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkmode: Appearance.getColorScheme() === 'dark',
  },
  reducers: {
    toggleTheme(state) {
        state.isDarkmode = !state.isDarkmode;
    },
  },
})

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;