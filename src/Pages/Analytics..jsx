import React, { useState, useEffect, useContext, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AdminDashboard from "./AdminDashboard";
import AdminHeader from "../Components/AdminHeader";

const getTodayDateWAT = () => {
    const now = new Date();
    // Convert to WAT (UTC+1) correctly
    const options = { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(now);
    return formattedDate; // YYYY-MM-DD
};

const API_URL = "https://techaid-001-site1.ptempurl.com/api/ticket/Ticket/analytics";

const Analytics = () => {
    const { user } = useContext(AuthContext);

    // State for filters
    const [filter, setFilter] = useState("Week");
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
        if (filter === "Day") {
            const todayWAT = getTodayDateWAT(); // Use adjusted date
            url += `&date=${todayWAT}`;
        }
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
    const barData = filter === "Day"
    ? analyticsData.length > 0
        ? [{
            day: analyticsData[0].day, // Ensure correct day label
            tickets: analyticsData[0].totalTickets
        }]
        : []
    : filter === "Week"
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
        { label: "Filter", state: filter, setState: setFilter, options: ["Day", "Week", "Month"] },
        { label: "Status", state: status, setState: setStatus, options: ["", "ACTIVE", "NOT_ACTIVE"] },
        { label: "Priority", state: priority, setState: setPriority, options: ["", "HIGH", "MEDIUM", "LOW"] },
        { label: "Category", state: category, setState: setCategory, options: ["", "HARDWARE", "SOFTWARE", "NETWORK", "TRANSACTION"] },
        { label: "Department", state: department, setState: setDepartment, options: ["", "SALES", "OPERATION", "TREASURY", "HR", "CUSTOMER_SERVICE"] },
    ];

    const contentRef = useRef(null);
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-md border border-gray-300 text-sm">
                    <p className="font-semibold text-blue-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-gray-700">
                            {entry.name}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const downloadPDF = () => {
        if (!contentRef.current) {
            console.error("Reference to element is null");
            return;
        }
    
        requestAnimationFrame(() => {
            html2canvas(contentRef.current, {
                scale: window.devicePixelRatio * 2, // Improve image quality
                useCORS: true, // Allow cross-origin images
                backgroundColor: "#fff",
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
    
                const imgWidth = 210; // A4 width in mm
                const imgHeight = 180;
    
                if (imgHeight > 297) { // A4 page height is 297mm
                    let position = 10;
                    let pageHeight = 120;
                    let remainingHeight = imgHeight;
    
                    while (remainingHeight > 0) {
                        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                        remainingHeight -= pageHeight;
                        position -= 297;
                        if (remainingHeight > 0) {
                            pdf.addPage();
                        }
                    }
                } else {
                    pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
                }
    
                pdf.save("analytics_report.pdf");
            });
        });
    };
    


    return (
        <div className="flex h-screen bg-gray-100 text-base">
            <AdminSidebar />
            <div className="flex-1 p-6 px-16 overflow-y-auto min-h-screen relative" ref={contentRef}>
                <AdminHeader user={user} />

                {/* Dropdown Filters */}
                <div className="flex items-center justify-between px-8 mt-4 ">
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

                    {/* Dropdown Filters */}
                    <div className="flex items-center justify-between px-8 mt-4">
                        <div className="flex gap-6">{/* Filter dropdowns remain unchanged */}</div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            onClick={downloadPDF}
                        >
                            Download Report
                        </button>
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
                                            <Tooltip content={<CustomTooltip />} />
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
