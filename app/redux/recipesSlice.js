import { createSlice } from '@reduxjs/toolkit'
import { Appearance } from 'react-native';

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    
  },
  reducers: {
    addRecipe(state, action) {
        state.recipes.push(action.payload);
    },
    removeRecipe(state, action) {
        state.recipes.splice(action.payload, 1);
    }

  },
})

export const { addRecipe, removeRecipe } = recipesSlice.actions;

export default themeSlice.reducer;