import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaChartLine, FaPeopleArrows } from 'react-icons/fa';
import { RxDashboard } from 'react-icons/rx';
import { RiFocus2Line } from 'react-icons/ri';
import logo from '../assets/logo.png';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  // Function to handle the "Dashboard" click based on user role
  const handleDashboardClick = () => {
    const userRole = localStorage.getItem('userRole') || 'GUEST'; // default to 'GUEST'
    if (!userRole) {
      alert('User role not found! Redirecting to home.');
      navigate('/');
      return;
    }

    switch (userRole.toUpperCase()) {
      case 'IT_PERSONNEL':
        navigate('/iTDashboard');
        break;
      case 'BANK_STAFF':
        navigate('/staffDashboard');
        break;
      case 'ADMIN':
        navigate('/AdminDashboard');
        break;
      default:
        navigate('/');
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('No access token found. Redirecting to login.');
      navigate('/logi');
      return;
    }

    try {
      const response = await fetch('https://techaid-001-site1.ptempurl.com/api/Employees/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Logout failed');

      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get the current user role from localStorage
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="w-[260px] h-screen bg-blue-900 text-white flex flex-col p-4 shadow-lg">
      <div className="flex ml-8 justify-left mb-6 mt-6">
        <img src={logo} alt="Optimus TechAid Logo" className="w-24 h-auto mt-10" />
      </div>
   
      <nav className="flex flex-col space-y-2 mb-4 gap-8">
        <button
          onClick={handleDashboardClick}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            location.pathname.includes('Dashboard') ? 'bg-green-500' : 'hover:bg-green-700'
          }`}
        >
          <RxDashboard className="text-xl" />
          <span>Dashboard</span>
        </button>

        <Link
          to="/adminprofile"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/adminprofile' ? 'bg-green-500' : 'hover:bg-green-700'
          }`}
        >
          <FaUser className="text-xl" />
          <span>Profile</span>
        </Link>

        <Link
        to="/admintrackandview"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
          location.pathname === '/admintracandview' ? 'bg-green-500' : 'hover:bg-green-700'
        }`}
      >
        <RiFocus2Line className="text-xl" />
        <span>Track & View Tickets</span>
      </Link>
        
        <Link
        to="/report"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
          location.pathname === '/report' ? 'bg-green-500' : 'hover:bg-green-700'
        }`}
      >
        <FaChartLine className="text-xl" />
        <span>Reporting and Analytics</span>
      </Link>

      <Link
        to="/accesslog"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
          location.pathname === '/accesslog' ? 'bg-green-500' : 'hover:bg-green-700'
        }`}
      >
        <FaPeopleArrows className="text-xl" />
        <span>Access Log</span>
      </Link>

      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-green-400 hover:bg-gray-700 transition mb-10"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
