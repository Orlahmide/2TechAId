import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./Pages/CreateUserAccount/CreateAccount";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dasboard";
import { AuthProvider } from "./Context/AuthContext";
import StaffDashboard from "./Pages/StaffDashboard";
import ITDashboard from "./Pages/ITDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import TrackAndViewTickets from "./Pages/TrackAndViewTickets";
import useAuth from "./Context/TokenRefreshLogic";
import CreateTicket from "./Pages/CreateTicket";
import TicketDetails from "./Pages/TicketDetails";
import ProfilePage from "./Pages/ProfilePage";
import PrivateRoute from "./Context/PrivateRoute";
import "@fontsource/roboto"; // Defaults to 400 weight
import CreateAccountITPersonnel from "./Pages/CreateUserAccount/CreateAccountITPersonnel";
import CreateAccountAdmin from "./Pages/CreateUserAccount/CreateAccountAdmin";
import TicketDetailsForIT from "./Pages/TicketDetailsForIT";
import TrackAndViewTicketsIT from "./Pages/TrackAndViewTicketsIT";



function App() {
  useAuth();
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/create-account_it" element={<CreateAccountITPersonnel/>} />
          <Route path="/create-account_admin" element={<CreateAccountAdmin/>} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staffDashboard" element={<StaffDashboard />} />
            <Route path="/iTDashboard" element={<ITDashboard />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/track-tickets" element={<TrackAndViewTickets />} />
            <Route path="/track-tickets-it" element={<TrackAndViewTicketsIT />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/get_ticket_by_id/:ticketId" element={<TicketDetails />} />
            <Route path="/get_ticket_by_id_it/:ticketId" element={<TicketDetailsForIT/>} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
