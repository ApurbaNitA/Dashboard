import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/newsSlice';
import articleReducer from "./features/articleSlice";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    news: newsReducer,
    articles: articleReducer,
    auth: authReducer,
  },
});

export default store;
