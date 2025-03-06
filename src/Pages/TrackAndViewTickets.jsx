import React, { useState, useEffect, useContext } from 'react';

import { AuthContext } from '../Context/AuthContext';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const TrackAndViewTickets = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ticketStats, setTicketStats] = useState({
    totalNumber: 0,
    activelNumber: 0,
    notActiveNumber: 0,
    completedNumber: 0
  });

  const [latestTickets, setLatestTickets] = useState([]);
  const [filter, setFilter] = useState(searchParams.get('filter') || 'none');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') ? new Date(searchParams.get('date')) : null);
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');

  useEffect(() => {
    fetchTicketStats();
    fetchLatestTickets();
  }, [filter, selectedDate, selectedStatus]);

  const updateURLParams = (newFilter, newDate, newStatus) => {
    const params = new URLSearchParams();
    params.set('filter', newFilter);
    if (newFilter === 'set' && newDate) {
      params.set('date', newDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
    }
    if (newStatus) {
      params.set('status', newStatus);
    }
    setSearchParams(params);
  };

  const fetchTicketStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      let url = `http://localhost:5215/api/ticket/Ticket/count_all_by_id?filter=${filter}`;
      if (filter === 'set' && selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
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

  const fetchLatestTickets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      let url = `http://localhost:5215/api/ticket/Ticket/filter?filter=${filter}`;
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }
      if (filter === 'set' && selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
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
        throw new Error('Failed to fetch latest tickets');
      }

      const data = await response.json();
      const sortedTickets = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLatestTickets(sortedTickets); // ✅ Removed `.slice(0, 6)` to return all results
    } catch (error) {
      toast.error(error.message || 'Failed to load latest tickets');
    }
  };


  return (
    <div className="flex h-screen bg-gray-100 text-base">
      <Toaster />
      <Sidebar/>
      <div className="flex-1 p-6 px-16 overflow-y-auto scrollbar-thin scrollbar-thumb-hidden  scrollbar-track-hidden">

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


        {/* Status Boxes */}
        <div className="grid w-full mt-8 gap-9 grid-cols-4 xl:grid-cols-4 custom:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          {[
            { label: 'Total Tickets', value: ticketStats.totalNumber, status: '' },
            { label: 'Active Tickets', value: ticketStats.activelNumber, status: 'ACTIVE' },
            { label: 'Not Active Tickets', value: ticketStats.notActiveNumber, status: 'NOT_ACTIVE' },
            { label: 'Completed Tickets', value: ticketStats.completedNumber, status: 'COMPLETED' }
          ].map(({ label, value, status }) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center min-w-[200px] max-w-[350px] h-[133px] rounded-lg shadow-lg text-center gap-2 cursor-pointer transition duration-300 transform hover:scale-105 
        ${selectedStatus === status
                  ? 'bg-blue-900 text-white shadow-xl ring-2 ring-blue-500' // Active: Blue background, white text, ring
                  : 'bg-gray-200 text-gray-700' // Default: Gray background, dark text
                }
        hover:ring-2 hover:ring-blue-400`}
              onClick={() => {
                const newStatus = status === selectedStatus ? '' : status;
                setSelectedStatus(newStatus);
                updateURLParams(filter, selectedDate, newStatus);
              }}
            >
              <span className="text-lg font-semibold">{label}</span>
              <span className="text-4xl font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Ticket List */}
        <div className="  mt-10 h-3/5 overflow-y-auto border-t border-gray-200 rounded-lg p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {latestTickets.length > 0 ? (
            latestTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-3 bg-white rounded-xl shadow-md p-4 mb-4 transition duration-300 transform hover:scale-102 hover:shadow-lg hover:ring-2 hover:ring-blue-300 cursor-pointer"
                onClick={() => navigate(`/get_ticket_by_id/${ticket.ticketId}`)}
              >
                <div className="flex justify-between items-center ">
                  <p className="text-lg font-semibold text-gray-900">{`ID: ${ticket.ticketId}`}</p>
                  <span className={`w-24 text-center px-2 py-1 text-sm font-medium rounded-full ${ticket.status === 'ACTIVE' ? 'bg-yellow-200 text-blue-800' : ticket.status === 'COMPLETED' ? 'bg-green-200 text-green-800' : 'bg-red-400 text-gray-800'}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-base text-gray-600">
                  <div className=" flex justify-start text-base text-start  text-gray-600 gap-60 w-2/4">
                    <div className="flex items-center gap-2 w-1/5 overflow-hidden">
                      <span>{ticket.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{ticket.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-3xl mt-40">No tickets available.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TrackAndViewTickets;
