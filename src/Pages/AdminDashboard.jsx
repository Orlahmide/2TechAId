import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AdminSidebar from '../Components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import Marquise from '../Components/Marquise';
import AdminHeader from '../Components/AdminHeader';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ticketStats, setTicketStats] = useState({
    totalNumber: 0,
    activelNumber: 0,
    notActiveNumber: 0,
    completedNumber: 0
  });

  const [latestTickets, setLatestTickets] = useState([]);
  const [filter, setFilter] = useState('none');
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch ticket stats when filter or selectedDate changes
// Fetch ticket stats when filter or selectedDate changes
useEffect(() => {
  if (filter === 'set' && (!selectedDate || selectedDate === '')) {
    return; // Prevent API call if filter is "set" but no date is provided
  }

  fetchLatestTickets();
  fetchTicketStats();
}, [filter, selectedDate]);



  // Fetch ticket stats from the API
  const fetchTicketStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      let url = `http://techaid-001-site1.ptempurl.com/api/ticket/Ticket/count_all?filter=${filter}`;

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
      setTicketStats(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load ticket stats');
    }
  };

  // Fetch the latest tickets
  const fetchLatestTickets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch('http://techaid-001-site1.ptempurl.com/api/ticket/Ticket/filter_for_admin?status=NOT_ACTIVE&filter=none', {
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

  return (
    <div className="flex h-screen bg-gray-100 text-base">
      <Toaster />
      <AdminSidebar />

      <div className="flex-1 p-6 overflow-y-auto h-screen relative px-16">
        <AdminHeader user={user} />

        <div className="grid w-full mt-8 gap-9 grid-cols-4 xl:grid-cols-4 custom:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          {[
            { label: 'Total Tickets', value: ticketStats.totalNumber, status: '' },
            { label: 'Active Tickets', value: ticketStats.activelNumber, status: 'ACTIVE' },
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
                navigate(`/admintrackandview?${queryParams.toString()}`);
              }}
            >
              <span className="text-lg font-semibold">{label}</span>
              <span className="text-4xl font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Latest Tickets Section */}
        <div className="mt-14">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Recent Tickets</h2>
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
              <p className="text-gray-500 text-3xl">No recent unassigned tickets available.</p>
            )}
          </div>
        </div>


        {/* Marquee stays at the bottom */}
        <div className="absolute bottom-10 left-0 w-full">
          <Marquise />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
