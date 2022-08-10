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
        state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
    },
    updateRecipe(state, action) {
        const recipeIndex = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
        state.recipes[recipeIndex] = action.payload;
    }
  },
})

export const { addRecipe, removeRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;