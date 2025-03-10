import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../Components/Sidebar';
import { AuthContext } from '../Context/AuthContext';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Marquise from '../Components/Marquise';

const IT_PERSONNEL = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ticketStats, setTicketStats] = useState({
    totalNumber: 0,
    activeNumber: 0,
    notActiveNumber: 0,
    completedNumber: 0
  });

  const [latestTickets, setLatestTickets] = useState([]);
  const [filter, setFilter] = useState('none');
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchTicketData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

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
      setTicketStats(prevStats => ({
        ...prevStats,
        totalNumber: data.totalNumber,
        activeNumber: data.activelNumber, // Fixed typo
        completedNumber: data.completedNumber,
      }));

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
      setTicketStats(prevStats => ({
        ...prevStats,
        notActiveNumber: notActiveData.notActiveNumber || 0,
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to load ticket stats');
    }
  };

  const fetchLatestTickets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch('http://localhost:5215/api/ticket/Ticket/filter?filter=none&status=ACTIVE', {
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
      const sortedTickets = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
      setLatestTickets(sortedTickets);
    } catch (error) {
      toast.error(error.message || 'Failed to load latest tickets');
    }
  };

  useEffect(() => {
    fetchLatestTickets();
    fetchTicketData();
  }, [filter, selectedDate]);

  return (
    <div className="flex h-screen bg-gray-100 text-base">
      <Toaster />
      <Sidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto min-h-screen relative">
        <Header user={user} />

        {/* Filter Section */}
        <div className="flex items-center gap-4 p-2 rounded-lg border-gray-200 mt-4">
          <label className="text-gray-700 font-medium text-xl">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-fit px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
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
              className="w-[140px] px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
              placeholderText="Select a date"
            />
          )}
        </div>

        <div className="grid w-full mt-8 gap-9 grid-cols-4 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          {[
            { label: 'Total Tickets', value: ticketStats.totalNumber, status: '' },
            { label: 'Active Tickets', value: ticketStats.activeNumber, status: 'ACTIVE' },
            { label: 'Not Active Tickets', value: ticketStats.notActiveNumber, status: 'NOT_ACTIVE' },
            { label: 'Completed Tickets', value: ticketStats.completedNumber, status: 'COMPLETED' }
          ].map(({ label, value, status }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center min-w-[250px] max-w-[350px] h-[133px] rounded-lg shadow-lg text-center gap-2 cursor-pointer transition duration-300 transform hover:scale-105 bg-gray-200 text-gray-700 hover:ring-2 hover:ring-blue-400"
              onClick={() => {
                const queryParams = new URLSearchParams();
                queryParams.set('filter', 'none');
                if (status) {
                  queryParams.set('status', status);
                }
                navigate(`/track-tickets-it?${queryParams.toString()}`);
              }}
            >
              <span className="text-lg font-semibold">{label}</span>
              <span className="text-4xl font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div className="mt-14">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Recent Assigned Tickets</h2>
          <div className={latestTickets.length > 0 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex items-center justify-center h-80 w-full'}>
            {latestTickets.length > 0 ? (
              latestTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-300 flex flex-col gap-3 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50"
                  onClick={() => navigate(`/get_ticket_by_id_it/${ticket.ticketId}`)}
                >
                  <div className="flex justify-end">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        ticket.status === "ACTIVE"
                          ? "bg-yellow-100 text-yellow-600"
                          : ticket.status === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {ticket.status === "ACTIVE"
                        ? "Pending"
                        : ticket.status === "NOT_ACTIVE"
                        ? "Unassigned"
                        : ticket.status === "COMPLETED"
                        ? "Completed"
                        : ticket.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{ticket.subject}</h3>
                  <hr className="border-gray-300" />
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <p>
                      <span className="font-semibold">Ticket ID:</span> {ticket.ticketId}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Priority:</span> {ticket.priority}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span> {ticket.category}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-3xl">No recent ssigned tickets available.</p>
            )}
          </div>
        </div>

        {/* Marquise */}
        <div className="absolute bottom-0 left-0 w-full">
          <Marquise />
        </div>
      </div>
    </div>
  );
};

export default IT_PERSONNEL;
