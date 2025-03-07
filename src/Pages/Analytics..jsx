import React, { useState, useEffect, useContext } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { Rectangle } from "recharts";
import { MdArrowDropDown } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import Header from "../Components/Header";
import { AuthContext } from "../Context/AuthContext";
import AdminSidebar from "../Components/AdminSidebar";

const API_URL = "http://localhost:5215/api/ticket/Ticket/analytics";

const Analytics = () => {
    const { user } = useContext(AuthContext);

    // State for filters
    const [filter, setFilter] = useState("week");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [department, setDepartment] = useState("");

    // State for analytics data
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const COLORS = ["#0B1D69", "#22c55e"];

    // Function to construct dynamic API URL based on filters
    const constructApiUrl = () => {
        let url = `${API_URL}?filter=${filter}`;
        if (status) url += `&status=${status}`;
        if (priority) url += `&priority=${priority}`;
        if (category) url += `&category=${category}`;
        if (department) url += `&department=${department}`;
        return url;
    };

    // Fetch analytics data
    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const response = await fetch(constructApiUrl());
                const data = await response.json();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [filter, status, priority, category, department]);

    // Prepare pie chart data
    const pieData = analyticsData.length
        ? [
            { name: "Assigned", value: analyticsData.reduce((sum, item) => sum + item.activeTickets, 0) },
            { name: "Not Assigned", value: analyticsData.reduce((sum, item) => sum + item.notActiveTickets, 0) },
        ]
        : [];

    const resolutionData = analyticsData.length
        ? [
            { name: "Resolved", value: analyticsData.reduce((sum, item) => sum + item.completedTickets, 0) },
            { name: "Unresolved", value: analyticsData.reduce((sum, item) => sum + (item.totalTickets - item.completedTickets), 0) },
        ]
        : [];

    // Prepare bar chart data for weekly view
    const barData =
        filter === "week"
            ? analyticsData
                .filter((day) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day.day))
                .map((day) => ({
                    day: day.day,
                    tickets: day.totalTickets,
                }))
            : analyticsData.map((week) => ({
                day: `Week ${week.weekNumber}`,
                tickets: week.totalTickets,
            }));

    // Calculate total tickets for summary card
    const totalTickets = analyticsData.reduce((sum, item) => sum + item.totalTickets, 0);

    // Dropdown options
    const dropdownOptions = [
        { label: "Filter", state: filter, setState: setFilter, options: ["day", "week", "month"] },
        { label: "Status", state: status, setState: setStatus, options: ["", "ACTIVE", "NOT_ACTIVE"] },
        { label: "Priority", state: priority, setState: setPriority, options: ["", "HIGH", "MEDIUM", "LOW"] },
        { label: "Category", state: category, setState: setCategory, options: ["", "HARDWARE", "SOFTWARE", "NETWORK", "TRANSACTION"] },
        { label: "Department", state: department, setState: setDepartment, options: ["", "SALES", "OPERATION", "TREASURY", "HR", "CUSTOMER_SERVICE"] },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 rounded-lg shadow-none border border-transparent text-sm hover:bg-green-400">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index}>
                            {entry.name}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
    
    


    return (
        <div className="flex h-screen bg-gray-100 text-base">
            <AdminSidebar />
            <div className="flex-1 p-6 px-16 overflow-y-auto min-h-screen relative">
                <Header user={user} />

                {/* Dropdown Filters */}
                <div className="flex items-center justify-between px-8 mt-4">
                    <div className="flex gap-6">
                        {dropdownOptions.map((dropdown, index) => (
                            <div key={index} className="bg-white px-5 py-2 rounded-lg shadow-md w-44 ">
                                <label className="text-gray-500 text-xs">{dropdown.label}</label>
                                <div className="relative">
                                    <select
                                        value={dropdown.state}
                                        onChange={(e) => dropdown.setState(e.target.value)}
                                        className="appearance-none w-full bg-white text-gray-900 text-sm py-2 pr-10 rounded-md focus:outline-none p-4"
                                    >
                                        {dropdown.options.map((option, idx) => (
                                            <option key={idx} value={option}>
                                                {option || "All"}
                                            </option>
                                        ))}
                                    </select>
                                    <MdArrowDropDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-4xl text-gray-700 cursor-pointer">
                        <AiOutlineDownload />
                    </div>
                </div>

                {/* Charts Section */}
                <div className="flex flex-col items-center gap-8 p-6">
                    {loading ? (
                        <p>Loading analytics data...</p>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row justify-center gap-8 w-full">
                                {/* Pie Charts */}
                                {[pieData, resolutionData].map((data, index) => (
                                    <div key={index} className="bg-white p-4 rounded-xl shadow-md w-full md:w-1/2">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                                                    {data.map((entry, idx) => (
                                                        <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend iconType="rect" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ))}
                            </div>

                            {/* Bar Chart & Summary Card */}
                            <div className="flex flex-col md:flex-row w-full gap-8">
                                {/* Bar Chart */}
                                <div className="bg-white w-full md:w-3/4 p-4 rounded-xl shadow-md">
                                    <h3 className="text-lg font-semibold mb-4">Total Tickets (Weekly View)</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="tickets" fill="#0B1D69" barSize={40} shape={<Rectangle radius={[20, 20, 0, 0]} />} />
                                        </BarChart>
                                    </ResponsiveContainer>

                                </div>

                                {/* Total Tickets Summary */}
                                <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/4 flex items-center justify-center text-2xl font-bold text-blue-900">
                                    Total Tickets: {totalTickets}
                                </div>


                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
