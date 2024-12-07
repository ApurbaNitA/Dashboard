// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchNews } from '../features/newsSlice';
// import { Bar } from 'react-chartjs-2';
// import { ClipLoader } from 'react-spinners';

// const NewsAnalytics = () => {
//   const dispatch = useDispatch();
//   const articles = useSelector((state) => state.news.articles);
//   const status = useSelector((state) => state.news.status);
  
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchNews()).finally(() => setLoading(false));
//     }
//   }, [dispatch, status]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ClipLoader size={50} />
//       </div>
//     );
//   }

//   if (status === 'failed') {
//     return <div>Error fetching news data</div>;
//   }

//   const authorCounts = articles.reduce((acc, article) => {
//     acc[article.author] = (acc[article.author] || 0) + 1;
//     return acc;
//   }, {});

//   const data = {
//     labels: Object.keys(authorCounts),
//     datasets: [
//       {
//         label: 'Articles by Author',
//         data: Object.values(authorCounts),
//         backgroundColor: 'rgba(54, 162, 235, 0.6)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">News Analytics</h2>
//       <Bar data={data} />
//     </div>
//   );
// };

// export default NewsAnalytics;
