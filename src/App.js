import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateAccount from './Pages/CreateAccount';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Dashboard from './Pages/Dasboard';
import { AuthProvider } from './Context/AuthContext';
import StaffDashboard from './Pages/StaffDashboard';
import ITDashboard from './Pages/ITDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import TrackAndViewTickets from './Pages/TrackAndViewTickets';
import useAuth from './Context/TokenRefreshLogic';

function App() {
  useAuth();
  return (
    <AuthProvider>
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staffDashboard" element={<StaffDashboard/>} />
        <Route path="/iTDashboard" element={<ITDashboard/>} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />
        {/* <Route path="/lodge-complaint" element={<LodgeComplaint />} /> */}
        <Route path="/track-tickets" element={<TrackAndViewTickets/>} />
        {/* <Route path="/reports" element={<Reports />} /> */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;