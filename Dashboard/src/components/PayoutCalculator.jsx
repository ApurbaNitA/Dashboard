// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setRate, calculateTotal } from '../features/payoutSlice';

// const PayoutCalculator = () => {
//   const articles = useSelector((state) => state.news.articles);
//   const rates = useSelector((state) => state.payout.rates);
//   const totalPayout = useSelector((state) => state.payout.totalPayout);
//   const dispatch = useDispatch();

//   const [editing, setEditing] = useState({});

//   const handleRateChange = (author, rate) => {
//     dispatch(setRate({ author, rate: parseFloat(rate) || 0 }));
//     dispatch(calculateTotal(articles));
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Payout Calculator</h2>
//       <table className="table-auto w-full border">
//         <thead>
//           <tr>
//             <th>Author</th>
//             <th>Articles</th>
//             <th>Payout Rate</th>
//           </tr>
//         </thead>
//         <tbody>
//           {articles.map((article) => (
//             <tr key={article.url}>
//               <td>{article.author}</td>
//               <td>{articles.filter((a) => a.author === article.author).length}</td>
//               <td>
//                 {editing[article.author] ? (
//                   <input
//                     type="number"
//                     value={rates[article.author] || ''}
//                     onChange={(e) => handleRateChange(article.author, e.target.value)}
//                     onBlur={() => setEditing({ ...editing, [article.author]: false })}
//                   />
//                 ) : (
//                   <span onClick={() => setEditing({ ...editing, [article.author]: true })}>
//                     {rates[article.author] || 'Click to Edit'}
//                   </span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h3 className="text-lg font-bold mt-4">Total Payout: ${totalPayout.toFixed(2)}</h3>
//     </div>
//   );
// };

// export default PayoutCalculator;
