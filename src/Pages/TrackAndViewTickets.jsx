import React, { useState, useEffect } from 'react';
import styles from './TrackAndViewTickets.module.css';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';

const TrackAndViewTickets = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [tickets, setTickets] = useState({
    unassigned: [
      { id: 2345678, description: 'Printer not working', status: 'unassigned', type: 'Hardware', date: '12/02/2025' },
      { id: 7994532, description: 'Process Maker not working', status: 'unassigned', type: 'Software', date: '13/02/2025' },
      { id: 5555610, description: 'Laptop screen is broken', status: 'unassigned', type: 'Hardware', date: '14/02/2025' },
    ],
    assigned: [
      { id: 1234567, description: 'Email not syncing', status: 'assigned', type: 'Software', date: '15/02/2025' },
    ],
    resolved: [
      { id: 9876543, description: 'Network connection issue', status: 'resolved', type: 'Network', date: '10/02/2025' },
    ],
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets((prevTickets) => {
        const newTickets = { ...prevTickets };

        // Randomly add a new unassigned ticket
        if (Math.random() > 0.5) {
          const newTicket = {
            id: Math.floor(Math.random() * 10000000),
            description: 'New issue reported',
            status: 'unassigned',
            type: Math.random() > 0.5 ? 'Hardware' : 'Software',
            date: new Date().toLocaleDateString(),
          };
          newTickets.unassigned.push(newTicket);
        }

        // Randomly move a ticket from unassigned to assigned
        if (newTickets.unassigned.length > 0 && Math.random() > 0.5) {
          const movedTicket = newTickets.unassigned.shift();
          movedTicket.status = 'assigned';
          newTickets.assigned.push(movedTicket);
        }

        // Randomly move a ticket from assigned to resolved
        if (newTickets.assigned.length > 0 && Math.random() > 0.5) {
          const movedTicket = newTickets.assigned.shift();
          movedTicket.status = 'resolved';
          newTickets.resolved.push(movedTicket);
        }

        return newTickets;
      });
    }, 300000); // Update every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar/>
      <div className={styles.mainContent}>
        <Header/>
        <div className={styles.statusBoxes}>
          <div
            className={`${styles.statusBox} ${selectedStatus === 'unassigned' ? styles.active : ''}`}
            onClick={() => handleStatusClick('unassigned')}
          >
            <span className={styles.statusCount}>{tickets.unassigned.length}</span>
            <span className={styles.statusLabel}>Unassigned</span>
          </div>
          <div
            className={`${styles.statusBox} ${selectedStatus === 'assigned' ? styles.active : ''}`}
            onClick={() => handleStatusClick('assigned')}
          >
            <span className={styles.statusCount}>{tickets.assigned.length}</span>
            <span className={styles.statusLabel}>Assigned</span>
          </div>
          <div
            className={`${styles.statusBox} ${selectedStatus === 'resolved' ? styles.active : ''}`}
            onClick={() => handleStatusClick('resolved')}
          >
            <span className={styles.statusCount}>{tickets.resolved.length}</span>
            <span className={styles.statusLabel}>Resolved</span>
          </div>
        </div>
        <div className={styles.ticketDetails}>
          {selectedStatus ? (
            tickets[selectedStatus].map((ticket) => (
              <div key={ticket.id} className={styles.ticketBox}>
                <p><strong>ID: {ticket.id}</strong></p>
                <p>Description: {ticket.description}</p>
                <div className={styles.styledBox}>
                    <p>Status: {ticket.status}</p>
                </div>
                <div className={styles.styledBox}>
                    <p>Type: {ticket.type}</p>
                </div>
                <div className={styles.styledBox}>
                    <p>Date: {ticket.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noTickets}>No tickets available yet, check back later.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackAndViewTickets;