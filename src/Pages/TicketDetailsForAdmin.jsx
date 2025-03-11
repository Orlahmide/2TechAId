import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import toast, { Toaster } from 'react-hot-toast';
import * as Dialog from "@radix-ui/react-dialog";
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';

const TicketDetailsForAdmin = () => {
  const { ticketId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedEmployee, setAssignedEmployee] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assigning, setAssigning] = useState(false);

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
          ? `https://techaid-001-site1.ptempurl.com/api/ticket/Ticket/get_ticket_by_id?id=${ticketId}`
          : `https://techaid-001-site1.ptempurl.com/api/ticket/Ticket/get_ticket_by_id_it?id=${ticketId}`;

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

  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://techaid-001-site1.ptempurl.com/api/Employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      const itPersonnel = data.filter(emp => emp.role === 'IT_PERSONNEL');
      setEmployees(itPersonnel);
    } catch (error) {
      toast.error(error.message || 'Error fetching employees');
    }
  };

  const assignTicket = async (employeeId, employeeName) => {
    try {
      setAssigning(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `https://techaid-001-site1.ptempurl.com/api/ticket/Ticket/assign?ticketId=${ticketId}&id=${employeeId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to assign ticket');

      setAssignedEmployee(employeeName);
      setShowAssignModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(error.message || 'Error assigning ticket');
    } finally {
      setAssigning(false);
    }

  };


  return (
    <div className="flex h-screen bg-gray-100 text-base">
      <Toaster />
      <AdminSidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto">
        <AdminHeader user={user} />
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 mt-10 min-h-[100px]">
          {loading ? (
            <div className="flex justify-center items-center h-60 text-gray-600 text-lg font-medium">
              Loading ticket details...
            </div>
          ) : ticket ? (
            <>
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className='flex gap-4'>
                  <span className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-semibold">
                    ID: {ticket.ticketId}
                  </span>
                </div>
                {(status === 'NOT_ACTIVE' || status === 'ACTIVE') && (
                  <button
                    onClick={() => {
                      fetchEmployees();
                      setShowAssignModal(true);
                    }}
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
              <div className="border p-6 rounded-xl bg-gray-50 shadow-md mt-6 h-36">
                <h3 className="text-xl font-semibold text-gray-800">Comment:</h3>
                <p className="text-gray-600">{ticket.comment || 'No comments yet.'}</p>
              </div>
              <Dialog.Root open={assigning}>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <img src="/loading.gif" alt="Loading" className="w-16 h-16" />
                    <p className="mt-4 text-lg font-medium text-gray-700">Assigning ticket...</p>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

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
            </>
          ) : (
            <div className="text-center text-gray-600 text-lg font-medium">
              Ticket details not found.
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      <Dialog.Root open={showAssignModal} onOpenChange={setShowAssignModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[40vw] max-w-lg h-[80vh] max-h-[700px] overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold mb-4 text-center">
              Select An IT Personnel
            </Dialog.Title>
            <ul className="space-y-3">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <li
                    key={emp.id}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out text-black"
                    onClick={() => assignTicket(emp.id, `${emp.first_name} ${emp.last_name}`)}
                  >
                    <p className="text-lg font-semibold">{emp.first_name} {emp.last_name}</p>
                    <p className="text-sm text-gray-600">{emp.email} | {emp.phone_number}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No IT personnel found.</p>
              )}
            </ul>
            <div className="flex justify-center mt-6">
              <Dialog.Close className="bg-blue-900 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                Cancel
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>




      {/* Success Modal */}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <Dialog.Title className="text-xl font-bold">Assignment Successful</Dialog.Title>
            <p className="mt-4 text-lg">Ticket {ticketId} has been assigned to {assignedEmployee}.</p>
            <button
              className="mt-6 bg-blue-900 text-white px-6 py-3 rounded text-lg font-medium"
              onClick={() => navigate("/AdminDashboard")}
            >
              Close
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default TicketDetailsForAdmin;
