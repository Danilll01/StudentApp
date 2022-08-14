import { createSlice } from '@reduxjs/toolkit'
import { Appearance } from 'react-native';

import Tags from '../constants/Tags';
import Units from '../constants/Units.js';

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [
      {
          id: 0,
          title: "Lättlagad lax i ugn",
          cookTime: 40,
          image: "image",
          tags: [Tags.FISH], //"meat", "chicken"
          servings: 2,
          ingredients: [
              {
                  amount: 400,
                  unit: Units.G,
                  name: "Laxfile"
              },
              {
                  amount: 1/2,
                  unit: Units.ST,
                  name: "Citron"
              },
              {
                  amount: 2,
                  unit: Units.DL,
                  name: "Creme fraiche"
              },
              {
                  amount: 300,
                  unit: Units.G,
                  name: "Potatis"
              },
              {
                  amount: 1,
                  unit: Units.ST,
                  name: "Dillvippa"
              },
              {
                  amount: null,
                  unit: "",
                  name: "Salt och peppar"
              }
          ],
          instructions: [
              "Sätt ugnen på 200 grader",
              "Blanda creme fraiche, citron, salt och peppar",
              "Bred på blandningen på laxen",
              "Lägg på dillvippan på laxen",
              "Sätt in laxen i ca 25 minuter i ugnen",
              "Skala och koka potatisen",
          ],
      },
      {
          id: 1,
          title: "Lättlagad torsk i ugn",
          cookTime: 30,
          image: "image",
          tags: [Tags.FISH], //"meat", "chicken"
          servings: 2,
          ingredients: [
              {
                  amount: 400,
                  unit: "g",
                  name: "Laxfile"
              },
              {
                  amount: 1,
                  unit: "st",
                  name: "Citron"
              }
          ],
          instructions: [
              "Sätt ugnen på 200 grader",
              "Bred på creme fraiche på torsken",
              "Pressa ut citronen över torsken",
              "Lägg på dillvippan på torsken",
              "Sätt in torsken i ca 25 minuter i ugnen",
              "Skala och koka potatisen",
          ],
      }
  ]
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
        let newState = {
            ...state,
            recipes: [
                ...state.recipes.slice(0, recipeIndex),
                action.payload,
                ...state.recipes.slice(recipeIndex + 1)
            ]
        }
        return newState;
    }
  },
})

export const { addRecipe, removeRecipe, updateRecipe } = recipesSlice.actions;

export const getRecipes = state => state.persistedReducer.recipes.recipes;

export default recipesSlice.reducer;