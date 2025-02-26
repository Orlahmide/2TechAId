import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios
import styles from './StatsBox.module.css';

const StatsBox = () => {
  const [allTickets, setAllTickets] = useState(null);
  const [completedTickets, setCompletedTickets] = useState(null);
  const [activeTickets, setActiveTickets] = useState(null);

  useEffect(() => {
    // Fetch all ticket count using axios
    axios.get('http://localhost:5215/api/ticket/Ticket/get_all_ticket_count')
      .then((response) => {
        setAllTickets(Number(response.data)); // Assuming the response is just a number
      })
      .catch((error) => {
        console.error('Error fetching all ticket count:', error);
      });

    // Fetch completed ticket count using axios
    axios.get('http://localhost:5215/api/ticket/Ticket/get_completed_ticket_count')
      .then((response) => {
        setCompletedTickets(Number(response.data)); // Assuming the response is just a number
      })
      .catch((error) => {
        console.error('Error fetching completed ticket count:', error);
      });

    // Fetch active ticket count using axios
    axios.get('http://localhost:5215/api/ticket/Ticket/get_active_ticket_count')
      .then((response) => {
        setActiveTickets(Number(response.data)); // Assuming the response is just a number
      })
      .catch((error) => {
        console.error('Error fetching active ticket count:', error);
      });
  }, []);

  // Render loading if data is not yet fetched
  if (allTickets === null || completedTickets === null || activeTickets === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.statsBox}>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>{allTickets}</span>
        <span className={styles.statLabel}>All Tickets</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>{completedTickets}</span>
        <span className={styles.statLabel}>Resolved</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>{activeTickets}</span>
        <span className={styles.statLabel}>Unresolved</span>
      </div>
    </div>
  );
};

export default StatsBox;
