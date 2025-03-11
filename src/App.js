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

  import CreateAccountITPersonnel from "./Pages/CreateUserAccount/CreateAccountITPersonnel";
  import CreateAccountAdmin from "./Pages/CreateUserAccount/CreateAccountAdmin";
  import TicketDetailsForIT from "./Pages/TicketDetailsForIT";
  import TrackAndViewTicketsIT from "./Pages/TrackAndViewTicketsIT";
  import Report from "./Pages/Reports copy";
  import AdminProfile from "./Pages/AdminProfile";
  import AdminTrackAndView from "./Pages/AdminTrackAndView";
  import AccessLog from "./Pages/AccessLog";
  import KnowledgeBase from "./Pages/KnowledgeBase";
  import Analytics from "./Pages/Analytics.";
  import TicketDetailsForAdmin from "./Pages/TicketDetailsForAdmin";
import NotificationsPage from "./aisha/Notification";
import AttendancePage from "./aisha/Attendancepage";
import PayrollPage from "./aisha/Payroll";





  function App() {
    useAuth();
    const userRole = localStorage.getItem('userRole');
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
              <Route path="/admintrackandview" element={<AdminTrackAndView/>} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/get_ticket_by_id/:ticketId" element={<TicketDetails />} />
              {/* Conditionally render based on role */}
            {userRole === "IT_PERSONNEL" && (
              <Route path="/get_ticket_by_id_it/:ticketId" element={<TicketDetailsForIT />} />
            )}
            {userRole === "ADMIN" && (
              <Route path="/get_ticket_by_id_it/:ticketId" element={<TicketDetailsForAdmin />} />
            )}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/adminprofile" element={<AdminProfile />} />
              <Route path="/accesslog" element={<AccessLog />} />
              <Route path="/knowledge" element={<KnowledgeBase/>} />
              <Route path="/report" element={<Analytics/>} />
              
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    );
  }

  export default App;
