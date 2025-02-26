import React from 'react';
import styles from './TicketList.module.css';

// const tickets = [
//   { id: 1, description: 'Login issue', status: 'Open', type: 'Bug', priority: 'High' },
//   { id: 2, description: 'Password reset', status: 'Resolved', type: 'Feature', priority: 'Medium' },
//   { id: 3, description: 'UI alignment', status: 'Open', type: 'Bug', priority: 'Low' },
// ];

const TicketList = () => {
  // return (
  //   <div className={styles.ticketList}>
  //     <h2>All Tickets</h2>
  //     <div className={styles.table}>
  //       <div className={styles.tableHeader}>
  //         <span>ID</span>
  //         <span>Description</span>
  //         <span>Status</span>
  //         <span>Type</span>
  //         <span>Priority</span>
  //       </div>
  //       {tickets.map((ticket) => (
  //         <div key={ticket.id} className={styles.tableRow}>
  //           <span>{ticket.id}</span>
  //           <span>{ticket.description}</span>
  //           <span>{ticket.status}</span>
  //           <span>{ticket.type}</span>
  //           <span>{ticket.priority}</span>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default TicketList;