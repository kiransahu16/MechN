import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import SearchMechanic from './pages/User/SearchMechanic';
import MechanicRegister from './pages/Mechanic/MechanicRegister';
import MechanicProfile from './pages/Mechanic/MechanicProfile';
import MechanicDashboard from './pages/Mechanic/MechanicDashboard';
import SOSEmergency from './pages/User/SOSEmergency';
import WriteReview from './pages/User/WriteReview';
import DIYFixes from './pages/User/DIYFixes';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AboutUs from './pages/Common/AboutUs';
import ContactUs from './pages/Common/ContactUs';
import NotFound from './pages/Common/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/search" element={<SearchMechanic />} />
        <Route path="/mechanic/register" element={<MechanicRegister />} />
        <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
        <Route path="/mechanic/:id" element={<MechanicProfile />} />
        <Route path="/mechanic/:id/review" element={<WriteReview />} />
        <Route path="/sos" element={<SOSEmergency />} />
        <Route path="/diy" element={<DIYFixes />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;