import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import TicketList from '../Components/TicketList';
import StatsBox from '../Components/StatsBox';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <StatsBox />
        <TicketList />
        <div className={styles.footer}>
          <Link to="/create-ticket" className={styles.createTicketButton}>
            Create Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;