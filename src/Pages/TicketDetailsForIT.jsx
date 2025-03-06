import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';

const TicketDetailsForIT = () => {
  const { ticketId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole');

      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const baseURL =
        userRole === 'BANK_STAFF'
          ? `http://localhost:5215/api/ticket/Ticket/get_ticket_by_id?id=${ticketId}`
          : `http://localhost:5215/api/ticket/Ticket/get_ticket_by_id_it?id=${ticketId}`;

      const response = await fetch(baseURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch ticket details');

      const data = await response.json();
      setTicket(data);
      setStatus(data.status);
      if (data.status === 'COMPLETED') setComment(data.comment || 'No resolution comment provided.');
    } catch (error) {
      toast.error(error.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const assignTicket = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:5215/api/ticket/Ticket/assign?ticketId=${ticketId}`, // Ticket ID as a query param
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to assign ticket');

      toast.success('Ticket assigned successfully');
      fetchTicketDetails(); // Refresh data
    } catch (error) {
      toast.error(error.message || 'Error assigning ticket');
    }
  };


  const resolveTicket = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:5215/api/ticket/Ticket/mark_as_completed?ticId=${ticketId}&comment=${comment}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to resolve ticket');

      toast.success('Ticket resolved successfully');
      fetchTicketDetails(); // Refresh data
    } catch (error) {
      toast.error(error.message || 'Error resolving ticket');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-lg">
      <Toaster />
      <Sidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto">
        <Header user={user} />

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 mt-10 min-h-[100px]">
          {loading ? (
            <div className="flex justify-center items-center h-60 text-gray-600 text-lg font-medium">
              Loading ticket details...
            </div>
          ) : ticket ? (
            <>
              {/* Top Section */}
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className='flex gap-4'>
                  <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-semibold">
                    ID: {ticket.ticketId}
                  </span>
                  <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-semibold">
                    Date created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Assign Button */}
                {status === 'NOT_ACTIVE' && (
                  <button
                    onClick={assignTicket}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                  >
                    Assign Ticket
                  </button>
                )}
              </div>

              {/* Ticket Info */}
              <div className="border p-5 rounded-lg bg-gray-50 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Subject: {ticket.subject}</h2>
                <p className="mt-3 text-gray-700 h-20">{ticket.description}</p>
              </div>

              {/* Comment Section */}
              {status !== 'NOT_ACTIVE' && (
                <div className="border p-5 rounded-lg bg-gray-50 shadow-sm mt-5 ">
                  <h3 className="text-lg font-semibold text-gray-800">Comment:</h3>
                  {status === 'COMPLETED' ? (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700 h-20">
                      {comment}
                    </p>
                  ) : (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-36"
                      placeholder="Write a comment..."
                    />
                  )}
                </div>
              )}

              {/* Ticket Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                  <span className="text-gray-800 font-medium">Name: {ticket.firstName} {ticket.lastName}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                  <span className="text-gray-800 font-medium">Department: {ticket.department}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                  <span className="text-gray-800 font-medium">Priority: {ticket.priority}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                  <span className="text-gray-800 font-medium">Type: {ticket.category}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                  <span className="text-gray-800 font-medium">Contact: {ticket.phoneNumber}</span>
                </div>
                {/* Status Box Fix */}
                <div className={`p-4 rounded-lg shadow-md text-white font-medium
    ${status === 'NOT_ACTIVE' ? 'bg-gray-500' :
                    status === 'ACTIVE' ? 'bg-yellow-500' :
                      'bg-green-500'}`}
                >
                  Status: {status.replace('_', ' ')}
                </div>
              </div>


              {/* Status Update Dropdown */}


              {/* Resolve Button - Hidden when status is COMPLETED */}
              {status === 'ACTIVE' && (
                <button
                  onClick={resolveTicket}
                  className="mt-10 w-44 bg-blue-900 text-white px-2 py-2 rounded-lg shadow hover:bg-blue-600"
                >
                  Resolve Ticket
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-gray-600 text-lg font-medium">
              Ticket details not found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsForIT;
