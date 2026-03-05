import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SearchMechanic from './pages/User/SearchMechanic';
import MechanicRegister from './pages/Mechanic/MechanicRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchMechanic />} />
        <Route path="/mechanic/register" element={<MechanicRegister />} />
      </Routes>
    </Router>
  );
}

export default App;