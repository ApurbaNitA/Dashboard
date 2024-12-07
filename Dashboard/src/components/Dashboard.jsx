import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNews } from "../features/newsSlice";
import { setArticles, updatePayoutRate } from "../features/articleSlice";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import SearchFilter from "./SearchFilter";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { unparse } from "papaparse";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state) => state.news);
  const articleData = useSelector((state) => state.articles.articles);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    author: "",
    startDate: "",
    endDate: "",
    type: "",
    keyword: "",
  });
  const [isAdmin, setIsAdmin] = useState(false); // New state to track if the user is an admin

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Fetch news
    dispatch(fetchNews());
  }, [dispatch]);

  useEffect(() => {
    // Check user role after login
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === "admin"); // Set isAdmin if role is admin
        }
      }
    };
    fetchUserRole();
  }, [auth, db]);

  useEffect(() => {
    if (status === 'succeeded') {
      const filteredArticles = articles.filter(
        (article) => article.title !== "[Removed]"
      );

      const storedData = JSON.parse(localStorage.getItem("articleData")) || {};
      const initializedData = filteredArticles.map((article) => ({
        ...article,
        payoutRate: storedData[article.url]?.payoutRate || 10,
      }));

      dispatch(setArticles(initializedData));
      setFilteredData(initializedData);
    }
  }, [articles, status, dispatch]);

  const handlePayoutRateChange = (e, url) => {
    if (!isAdmin) return; // Prevent modification if not admin

    const updatedRate = parseFloat(e.target.value) || 0;

    dispatch(updatePayoutRate({ url, payoutRate: updatedRate }));

    const updatedData = articleData.map((article) =>
      article.url === url ? { ...article, payoutRate: updatedRate } : article
    );

    const dataToStore = updatedData.reduce((acc, article) => {
      acc[article.url] = { payoutRate: article.payoutRate };
      return acc;
    }, {});
    localStorage.setItem("articleData", JSON.stringify(dataToStore));
  };

  const applyFilters = () => {
    let filtered = articleData;

    if (filters.keyword) {
      filtered = filtered.filter((article) =>
        Object.values(article)
          .join(" ")
          .toLowerCase()
          .includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.author) {
      filtered = filtered.filter((article) =>
        article.author?.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter((article) => {
        const publishedDate = new Date(article.publishedAt);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        return (
          (!startDate || publishedDate >= startDate) &&
          (!endDate || publishedDate <= endDate)
        );
      });
    }

    if (filters.type) {
      filtered = filtered.filter((article) =>
        article.type?.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, articleData]);

  const totalPayout = filteredData.reduce(
    (acc, article) => acc + article.payoutRate,
    0
  );

  const articleCountByAuthor = filteredData.reduce((acc, article) => {
    const author = article.author || "Unknown";
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(articleCountByAuthor),
    datasets: [
      {
        label: "Articles by Author",
        data: Object.values(articleCountByAuthor),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const uniqueAuthors = Array.from(
    new Set(articleData.map((article) => article.author || "Unknown"))
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Author", "Article Title", "Payout Rate", "Calculated Payout"];
    const tableRows = [];

    filteredData.forEach((article) => {
      const rowData = [
        article.author || "Unknown",
        article.title,
        article.payoutRate.toFixed(2),
        `$${article.payoutRate.toFixed(2)}`,
      ];
      tableRows.push(rowData);
    });

    doc.text("Payout Report", 14, 20);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    const totalPayoutText = `Total Payout: $${totalPayout.toFixed(2)}`;
    doc.text(totalPayoutText, 14, doc.autoTable.previous.finalY + 10);

    doc.save("Payout_Report.pdf");
  };

  const exportToCSV = () => {
    const csvData = filteredData.map((article) => ({
      Author: article.author || "Unknown",
      "Article Title": article.title,
      "Payout Rate": article.payoutRate.toFixed(2),
      "Calculated Payout": `$${article.payoutRate.toFixed(2)}`,
    }));

    const csvString = unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Payout_Report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToGoogleSheets = async () => {
    const sheetData = filteredData.map((article) => [
      article.author || "Unknown",
      article.title,
      article.payoutRate.toFixed(2),
      `$${article.payoutRate.toFixed(2)}`,
    ]);
  
    const headers = ["Author", "Article Title", "Payout Rate", "Calculated Payout"];
    const body = {
      values: [headers, ...sheetData],
    };
  
    const apiKey = "AIzaSyAtNkfzZUwjO1utW0L2twT7zY_N-8T7DfI"; // Replace with your API key
    const spreadsheetId = "1ScLBg-8lIgWl-7Xex66gY3MwN2wpKIQlL8wRBb7b0pY"; // Replace with your spreadsheet ID
    const range = "Sheet1!A1"; // Replace with your desired range
  
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
  
      if (response.ok) {
        alert("Data exported to Google Sheets successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error exporting to Google Sheets:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  if (status === 'loading') {
    return <div className="text-center text-blue-500">Loading...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="text-center text-red-500">
        Failed to fetch news: {error || "An unknown error occurred"}
      </div>
    );
  }
  return (
    <div className="p-4">
      <div className="mb-4 my-4">
        <h2 className="text-2xl font-bold">Total Articles: {filteredData.length}</h2>
      </div>

      <SearchFilter filters={filters} setFilters={setFilters} uniqueAuthors={uniqueAuthors} />

      <div className="flex flex-col lg:flex-row gap-4 my-4">
        <div className="lg:w-1/2 bg-white shadow p-4 rounded">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Payout Details</h2>
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Export to PDF
              </button>
              <button
                onClick={exportToCSV}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Export to CSV
              </button>
              <button
                onClick={exportToGoogleSheets}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Export to Google Sheets
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded">
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border">Author</th>
                  <th className="px-4 py-2 border">Article Title</th>
                  <th className="px-4 py-2 border">Payout Rate</th>
                  <th className="px-4 py-2 border">Calculated Payout</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((article) => (
                  <tr key={article.url}>
                    <td className="px-4 py-2 border">{article.author || "Unknown"}</td>
                    <td className="px-4 py-2 border truncate">{article.title}</td>
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        value={article.payoutRate}
                        onChange={(e) => handlePayoutRateChange(e, article.url)}
                        className="border p-1 w-full"
                        min="0"
                        disabled={!isAdmin} // Disable input if not admin
                      />
                    </td>
                    <td className="px-4 py-2 border">${article.payoutRate.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right font-bold">
            Total Payout: ${totalPayout.toFixed(2)}
          </div>
        </div>

        <div className="lg:w-1/2 bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Articles by Author</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;