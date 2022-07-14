import { configureStore } from '@reduxjs/toolkit';
import theme from './themeSlice';

const Store = configureStore({
    reducer: {
        theme
    },
});  

export default Store;