// import { createSlice } from '@reduxjs/toolkit';

// const payoutSlice = createSlice({
//   name: 'payout',
//   initialState: { rates: {}, totalPayout: 0 },
//   reducers: {
//     setRate(state, action) {
//       state.rates[action.payload.author] = action.payload.rate;
//     },
//     calculateTotal(state, action) {
//       state.totalPayout = action.payload.reduce((total, article) => {
//         const rate = state.rates[article.author] || 0;
//         return total + rate;
//       }, 0);
//     },
//   },
// });

// export const { setRate, calculateTotal } = payoutSlice.actions;
// export default payoutSlice.reducer;
