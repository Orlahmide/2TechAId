import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import AdminSidebar from '../Components/AdminSidebar';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { user } = useContext(AuthContext); // Assuming role is part of this user object
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole'); // Get role from local storage
  
      if (!token) {
        toast.error('User not authenticated');
        return;
      }
  
      // Determine the correct API URL based on role
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
  
      if (response.status === 204) {
        setTicket(null);
        toast('No ticket found');
        return;
      }
  
      if (response.status === 404) {
        throw new Error('Ticket not found');
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
    <div className="flex h-screen bg-gray-100 text-lg">
      <Toaster />
      
      {/* Conditionally render the sidebar based on user's role */}
      {user?.role === 'ADMIN' || localStorage.getItem('userRole') === 'ADMIN' ? (
        <AdminSidebar />
      ) : (
        <Sidebar />
      )}

<div className="flex-1 p-6 px-16 overflow-y-auto">
        <Header user={user} />

        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-300 mt-8">
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-60 text-gray-600 text-lg font-medium">
              <span className="spinner-border animate-spin"></span> Loading ticket details...
            </div>
          ) : ticket ? (
            <>
              {/* Ticket ID and Date Created */}
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="flex gap-6">
                  <span className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                    ID: {ticket.ticketId}
                  </span>
                  <span className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                    Date Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Subject and Description */}
              <div className="border p-6 rounded-xl bg-white shadow-md h-36">
                <h2 className="text-xl font-bold text-gray-800">Subject: {ticket.subject}</h2>
                <p className="mt-4 text-gray-600 text-lg">{ticket.description}</p>
              </div>

              {/* Comment Section */}
              <div className="border p-6 rounded-xl bg-gray-50 shadow-md mt-6 h-36">
                <h3 className="text-xl font-semibold text-gray-800">Comment:</h3>
                <p className="text-gray-600">{ticket.comment || 'No comments yet.'}</p>
              </div>

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
                <div className="bg-blue-50 p-4 rounded-lg shadow-md overflow-hidden">
                  <span className="text-gray-800 font-medium">Phone Number: {ticket.phoneNumber}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-m overflow-hidden">
                  <span className="text-gray-800 font-medium">Email: {ticket.email}</span>
                </div>
              </div>

              {/* Resolved Details */}
              {ticket.status === 'ACTIVE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                     <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-800 font-medium">
                      Assigned to: {ticket.iT_Personel_FirstName} {ticket.iT_Personel_LastName}
                    </span>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-800 font-medium">
                      Email: {ticket.iT_Personel_Email}
                    </span>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-800 font-medium">
                      Date Assigned: {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                
               
                </div>
              )}

              {ticket.status === 'COMPLETED' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                   <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-800 font-medium">
                      Resolved by: {ticket.iT_Personel_FirstName} {ticket.iT_Personel_LastName}
                    </span>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-800 font-medium">
                      Email: {ticket.iT_Personel_Email}
                    </span>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-800 font-medium">
                      Date Resolved: {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                 
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-600 text-lg font-medium">
              Ticket details not found!.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
