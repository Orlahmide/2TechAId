import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RxDashboard } from 'react-icons/rx';
import { RiFocus2Line } from 'react-icons/ri';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    const userRole = localStorage.getItem('userRole');
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

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5215/api/Employees/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Logout failed');

      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-60 h-screen bg-blue-900 text-white flex flex-col p-4 shadow-lg">
  <br /> <br /> 
  <div className="flex justify-center mb-6">
    <img src={logo} alt="Optimus TechAid Logo" className="w-24 h-auto" />
  </div>
  <br /> <br />
  <nav className="flex flex-col space-y-2 mb-4">
    <button
      onClick={handleDashboardClick}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
    >
      <RxDashboard className="text-xl" />
      <span>Dashboard</span>
    </button>
    <br />
    <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-600 transition">
      <FaUser className="text-xl" />
      <span>Profile</span>
    </Link>
    <br />
    <Link to="/track-tickets" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-600 transition">
      <RiFocus2Line className="text-xl" />
      <span>Track & View Tickets</span>
    </Link>
  </nav>
  {/* Added margin above the logout button to push it lower but not to the bottom */}
  <div className="mt-96">
    <button
      onClick={handleLogout}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-green-400 hover:bg-gray-700 transition"
    >
      <FaSignOutAlt className="text-xl" />
      <span>Logout</span>
    </button>
  </div>
</div>

  );
  
};

export default Sidebar;
