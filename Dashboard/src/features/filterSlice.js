// // src/features/filterSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   globalSearch: "",
//   author: "",
//   dateRange: {
//     startDate: "",
//     endDate: "",
//   },
//   type: "",
// };

// const filterSlice = createSlice({
//   name: "filters",
//   initialState,
//   reducers: {
//     // Set global search term
//     setGlobalSearch(state, action) {
//       state.globalSearch = action.payload;
//     },
//     // Set selected author
//     setAuthor(state, action) {
//       state.author = action.payload;
//     },
//     // Set date range (start and end dates)
//     setDateRange(state, action) {
//       state.dateRange = { ...state.dateRange, ...action.payload };
//     },
//     // Set type of content (article, blog, tutorial)
//     setType(state, action) {
//       state.type = action.payload;
//     },
//   },
// });

// export const { setGlobalSearch, setAuthor, setDateRange, setType } = filterSlice.actions;
// export default filterSlice.reducer;
