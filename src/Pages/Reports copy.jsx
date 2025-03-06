import React, { useState, useEffect, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AdminSidebar from "../Components/AdminSidebar";
import Header from "../Components/Header";
import { AuthContext } from "../Context/AuthContext";


const Report = () => {
  const [filter, setFilter] = useState("none");
  const [data, setData] = useState([]);
  const token = localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5215/api/ticket/Ticket/analytics?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (filter === "week") {
        setData(result.weeklyCounts || []);
      } else if (filter === "month") {
        const weeks = result.weeklyCounts || [];
        const formattedWeeks = weeks.slice(0, 4).map((week, index) => ({
          weekNumber: index + 1,
          totalTickets: week.totalTickets,
          activeTickets: week.activeTickets,
          notActiveTickets: week.notActiveTickets,
          completedTickets: week.completedTickets,
        }));
        setData(formattedWeeks);
      } else {
        setData([
          {
            category: filter.toUpperCase(),
            totalTickets: result.totalNumber,
            activeTickets: result.activeNumber,
            notActiveTickets: result.notActiveNumber,
            completedTickets: result.completedNumber,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  return (

    <div className="flex h-screen bg-gray-100 text-base">
    <AdminSidebar />

    <div className="flex-1 p-6 overflow-y-auto">
      <Header user={user} />
    <div className="p-6 bg-white shadow-md rounded-2xl mt-16">
      <h2 className="text-2xl font-semibold mb-4">Ticket Analytics</h2>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border rounded-md"
      >
        <option value="none">All Time</option>
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={filter === "week" || filter === "month" ? "weekNumber" : "category"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalTickets" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="activeTickets" stroke="#82ca9d" strokeWidth={2} />
          <Line type="monotone" dataKey="notActiveTickets" stroke="#ffc658" strokeWidth={2} />
          <Line type="monotone" dataKey="completedTickets" stroke="#ff7300" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </div>
    </div>
  );
};

export default Report;
