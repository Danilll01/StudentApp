import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import themeReducer from './themeSlice';
import recipesReducer from './recipesSlice';

const persistConfig = {
	key: "root",
	version: 1,
	storage: AsyncStorage,
    whitelist: ['theme', 'recipes']
}
const rootReducer = combineReducers({
	theme: themeReducer,
    recipes: recipesReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const Store = configureStore({
    reducer: {
        persistedReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
}, composeWithDevTools);  

export default Store;