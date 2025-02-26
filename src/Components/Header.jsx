import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock real-time notifications
  useEffect(() => {
    const fetchNotifications = () => {
      // Simulate real-time notifications
      const mockNotifications = [
        { id: 1, message: 'Your ticket #123 has been resolved.', timestamp: '2 mins ago' },
        { id: 2, message: 'New ticket #124 has been submitted.', timestamp: '10 mins ago' },
        { id: 3, message: 'Reminder: Ticket #122 is due tomorrow.', timestamp: '1 hour ago' },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to get initials from the user's name
  const getInitials = (name) => {
    if (!name) return 'GU'; // Default initials if name is not provided
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className={styles.header}>
      <div className={styles.searchBox}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search Ticket ID" className={styles.searchInput} />
      </div>
      <div className={styles.rightSection}>
        <div className={styles.notificationIcon} onClick={toggleNotifications}>
          <FaBell />
          {notifications.length > 0 && (
            <span className={styles.notificationBadge}>{notifications.length}</span>
          )}
        </div>
        {showNotifications && (
          <div className={styles.notificationDropdown}>
            {notifications.map((notification) => (
              <div key={notification.id} className={styles.notificationItem}>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <span className={styles.notificationTimestamp}>{notification.timestamp}</span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.userInfo}>
        <div className={styles.userInitials}>
          {getInitials(user?.profile?.name)}
          </div>
          <span className={styles.userName}>{user?.profile?.name || 'Guest User'}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;