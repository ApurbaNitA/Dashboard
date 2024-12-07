import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/newsSlice';
// import searchReducer from './features/searchSlice';
// import filterReducer from './features/filterSlice';
import articleReducer from "./features/articleSlice";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    news: newsReducer,
    articles: articleReducer,
    auth: authReducer,
    // search: searchReducer,
    // filter: filterReducer,
  },
});

export default store;
