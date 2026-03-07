import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SearchMechanic from './pages/User/SearchMechanic';
import MechanicRegister from './pages/Mechanic/MechanicRegister';
import MechanicProfile from './pages/Mechanic/MechanicProfile';
import SOSEmergency from './pages/User/SOSEmergency';
import WriteReview from './pages/User/WriteReview';
import DIYFixes from './pages/User/DIYFixes';
import UserDashboard from './pages/User/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchMechanic />} />
        <Route path="/mechanic/register" element={<MechanicRegister />} />
        <Route path="/mechanic/:id" element={<MechanicProfile />} />
        <Route path="/mechanic/:id/review" element={<WriteReview />} />
        <Route path="/sos" element={<SOSEmergency />} />
        <Route path="/diy" element={<DIYFixes />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;