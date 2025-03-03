import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../Components/Sidebar';
import { AuthContext } from '../Context/AuthContext';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const IT_PERSONNEL = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ticketStats, setTicketStats] = useState({
    totalNumber: 0,
    activelNumber: 0,
    notActiveNumber: 0, // Initially, the count will be set to 0 and will be updated later
    completedNumber: 0
  });

  const [latestTickets, setLatestTickets] = useState([]);
  const [filter, setFilter] = useState('none');
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch all ticket stats and 'notActiveNumber' separately
  const fetchTicketData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      // Fetch the stats for total, active, and completed tickets
      let url = `http://localhost:5215/api/ticket/Ticket/count_all_by_id?filter=${filter}`;
      if (filter === 'set' && selectedDate) {
        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        url += `&date=${formattedDate}`;
      }

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
      // Update ticketStats with total, active, and completed numbers
      setTicketStats(prevStats => ({
        ...prevStats,
        totalNumber: data.totalNumber,
        activelNumber: data.activelNumber,
        completedNumber: data.completedNumber,
      }));

      // Fetch 'notActiveNumber' from the new endpoint separately
      const notActiveResponse = await fetch(`http://localhost:5215/api/ticket/Ticket/count_all?filter=${filter}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!notActiveResponse.ok) {
        throw new Error('Failed to fetch NOT_ACTIVE ticket count');
      }

      const notActiveData = await notActiveResponse.json();
      // Now update 'notActiveNumber'
      setTicketStats(prevStats => ({
        ...prevStats,
        notActiveNumber: notActiveData.notActiveNumber || 0,  // Use '0' if data is missing
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to load ticket stats');
    }
  };

  useEffect(() => {
    fetchLatestTickets();
    fetchTicketData(); // Fetch all ticket stats in one go
  }, [filter, selectedDate]); // Fetch stats when filter or selectedDate changes

  const fetchLatestTickets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch('http://localhost:5215/api/ticket/Ticket/filter_for_admin?status=NOT_ACTIVE&filter=none', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch latest tickets');
      }

      const data = await response.json();
      const sortedTickets = data.sort((a, b) => new Date(b.updateddAt) - new Date(a.updateddAt)).slice(0, 6);
      setLatestTickets(sortedTickets);
    } catch (error) {
      toast.error(error.message || 'Failed to load latest tickets');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster />
      <Sidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto">
        <Header user={user} />

        {/* Filter Section */}
        <div className="flex items-center gap-4 p-2 rounded-lg border-gray-200 mt-4">
          <label className="text-gray-700 font-medium">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-fit px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              className="w-[140px] px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholderText="Select a date"
            />
          )}
        </div>

        {/* Stats Display */}
        <div className="grid w-full mt-8 gap-9 grid-cols-4 xl:grid-cols-4 custom:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          <div className="flex flex-col items-center justify-center bg-gray-200 min-w-[200px] max-w-[350px] h-[133px] rounded-lg shadow-lg text-center gap-2">
            <span className="text-lg font-semibold text-gray-700">Total Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.totalNumber}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-200 min-w-[200px] max-w-[350px] h-[133px] rounded-lg shadow-lg text-center gap-2">
            <span className="text-lg font-semibold text-gray-700">Active Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.activelNumber}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-200 min-w-[200px] max-w-[350px] h-[133px] rounded-lg shadow-lg text-center gap-2">
            <span className="text-lg font-semibold text-gray-700">Not Active Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.notActiveNumber}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-200 min-w-[200px] max-w-[350px] h-[133px] rounded-lg shadow-lg text-center gap-2">
            <span className="text-lg font-semibold text-gray-700">Completed Tickets</span>
            <span className="text-4xl font-bold text-gray-900">{ticketStats.completedNumber}</span>
          </div>
        </div>

        {/* Latest Tickets Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Recent unassigned tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {latestTickets.length > 0 ? (
              latestTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-300 flex flex-col gap-3 cursor-pointer 
                     transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl 
                     hover:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50"
                  onClick={() => navigate(`/get_ticket_by_id_it/${ticket.ticketId}`)}
                >
                  <div className="flex justify-end">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${ticket.status === 'ACTIVE'
                        ? 'bg-yellow-100 text-yellow-600'
                        : ticket.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {ticket.status === 'ACTIVE'
                        ? 'Pending'
                        : ticket.status === 'NOT_ACTIVE'
                          ? 'Unassigned'
                          : ticket.status === 'COMPLETED'
                            ? 'Completed'
                            : ticket.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{ticket.subject}</h3>
                  <hr className="border-gray-300" />
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <p><span className="font-semibold">Ticket ID:</span> {ticket.ticketId}</p>
                    <p><span className="font-semibold">Date:</span> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Priority:</span> {ticket.priority}</p>
                    <p><span className="font-semibold">Type:</span> {ticket.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent tickets available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IT_PERSONNEL;
