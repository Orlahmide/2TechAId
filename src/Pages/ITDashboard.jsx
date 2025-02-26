import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../Components/Sidebar';
import { AuthContext } from '../Context/AuthContext';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const IT_PERSONNEL = () => {
  const { user } = useContext(AuthContext);

  const [ticketStats, setTicketStats] = useState({
    totalNumber: 0,
    activelNumber: 0,
    notActiveNumber: 0,
    completedNumber: 0
  });

  const [filter, setFilter] = useState('none');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (filter !== 'set' || (filter === 'set' && selectedDate)) {
      fetchTicketStats();
    }
    fetchNotActiveTickets(); // Fetch notActiveNumber separately
  }, [filter, selectedDate]);

  const fetchTicketStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      let url = `http://localhost:5215/api/ticket/Ticket/count_all_by_id?filter=${filter}`;

      if (filter === 'set' && selectedDate) {
        const formattedDate = selectedDate.getFullYear() + '-' +
          String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(selectedDate.getDate()).padStart(2, '0');
        url += `&date=${formattedDate}`;
      }

      console.log("Fetching from URL:", url); // Debugging

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ticket stats');
      }

      const data = await response.json();
      setTicketStats(prevStats => ({
        ...prevStats,
        totalNumber: data.totalNumber,
        activelNumber: data.activelNumber,
        completedNumber: data.completedNumber
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to load ticket stats');
    }
  };

  const fetchNotActiveTickets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:5215/api/ticket/Ticket/get_notactive_ticket_count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch not active ticket count');
      }

      const textData = await response.text(); // Read response as text
      const notActiveCount = parseInt(textData, 10); // Convert to number

      setTicketStats(prevStats => ({
        ...prevStats,
        notActiveNumber: isNaN(notActiveCount) ? 0 : notActiveCount // Ensure a valid number
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to load not active tickets');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster />
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Header user={user} />

        {/* Filter Section */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 mt-4">
          <label className="text-gray-700 font-medium">Filter by:</label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="none">None</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="set">Set Date</option>
          </select>

          {filter === 'set' && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholderText="Select a date"
            />
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-lg shadow-lg text-center">
            <span className="text-lg font-semibold text-gray-700">Total Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.totalNumber}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-green-200 p-6 rounded-lg shadow-lg text-center">
            <span className="text-lg font-semibold text-gray-700">Active Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.activelNumber}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-yellow-100 p-6 rounded-lg shadow-lg text-center">
            <span className="text-lg font-semibold text-gray-700">Not Active Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.notActiveNumber}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-blue-200 p-6 rounded-lg shadow-lg text-center">
            <span className="text-lg font-semibold text-gray-700">Completed Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.completedNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IT_PERSONNEL;
