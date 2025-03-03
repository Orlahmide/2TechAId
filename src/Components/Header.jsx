import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = () => {
      const mockNotifications = [
        { id: 1, message: 'Your ticket #123 has been resolved.', timestamp: '2 mins ago' },
        { id: 2, message: 'New ticket #124 has been submitted.', timestamp: '10 mins ago' },
        { id: 3, message: 'Reminder: Ticket #122 is due tomorrow.', timestamp: '1 hour ago' },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://localhost:5215/api/Employees/get_employee_id', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'GU';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/get_ticket_by_id/${searchQuery.trim()}`);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-[#5252F1] bg-slate-100 z-50">

      <form onSubmit={handleSearch} className="flex items-center bg-white px-2 py-1 rounded-md">
        <FaSearch className="text-[#007bff] mr-2" />
        <input
          type="text"
          placeholder="Search Ticket ID"
          className="bg-transparent outline-none text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="flex items-center gap-12 relative">
        <div className="relative cursor-pointer text-[#007bff] text-lg" onClick={toggleNotifications}>
          <FaBell />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
          )}
        </div>

        {showNotifications && (
          <div className="absolute top-12 right-5 bg-white border border-gray-300 rounded-md shadow-md w-80 max-h-96 overflow-y-auto z-50">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-gray-200 last:border-none">
                <p className="text-md font-medium text-gray-800">{notification.message}</p>
                <span className="text-sm text-gray-600">{notification.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold bg-blue-900">
            {getInitials(userData?.first_name, userData?.last_name)}
          </div>
          <span className="text-sm font-bold text-gray-800">{userData ? `${userData.first_name} ${userData.last_name}` : 'Guest User'}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
