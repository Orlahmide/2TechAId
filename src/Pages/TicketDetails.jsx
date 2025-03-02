import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:5215/api/ticket/Ticket/get_ticket_by_id?id=${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }

      const data = await response.json();
      setTicket(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      
      <Toaster />
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header user={user} />

        {/* Content Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 mt-10 min-h-[500px]">
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-60 text-gray-600 text-lg font-medium">
              Loading ticket details...
            </div>
          ) : ticket ? (
            <>
              {/* Ticket ID and Date Created */}
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-semibold">
                  ID: {ticket.ticketId}
                </span>
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-semibold">
                  Date created: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Subject and Description */}
              <div className="border p-5 rounded-lg bg-gray-50 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Subject: {ticket.subject}</h2>
                <p className="mt-3 text-gray-700">{ticket.description}</p>
              </div>

              {/* Comment Section */}
              <div className="border p-5 rounded-lg bg-gray-50 shadow-sm mt-5">
                <h3 className="text-lg font-semibold text-gray-800">Comment:</h3>
                <p className="text-gray-700">{ticket.comment || 'No comments yet.'}</p>
              </div>

              {/* Ticket Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-6">
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                  Name: {ticket.firstName} {ticket.lastName}
                </span>
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                  Department: {ticket.department}
                </span>
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                  Priority: {ticket.priority}
                </span>
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                  Type: {ticket.category}
                </span>
                <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                  Contact: {ticket.phoneNumber}
                </span>
              </div>

              {/* Resolved Details */}
              {ticket.status === "ACTIVE" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
                  <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                    Date resolved: {ticket.dateResolved ? new Date(ticket.dateResolved).toLocaleDateString() : "N/A"}
                  </span>
                  <span className="bg-yellow-200 px-4 py-2 rounded-lg text-yellow-800 font-medium w-fit">
                    Assigned to: {ticket.iT_Personel_FirstName} {ticket.iT_Personel_LastName}
                  </span>
                </div>
              )}

              {ticket.status === "COMPLETED" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
                  <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 font-medium w-fit">
                    Date resolved: {ticket.dateResolved ? new Date(ticket.dateResolved).toLocaleDateString() : "N/A"}
                  </span>
                  <span className="bg-green-200 px-4 py-2 rounded-lg text-green-800 font-medium w-fit">
                    Resolved by: {ticket.iT_Personel_FirstName} {ticket.iT_Personel_LastName}
                  </span>
                </div>
              )}

              {/* Back Button */}
            
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

export default TicketDetails;
