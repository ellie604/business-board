import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import BrokerDashboard from './pages/BrokerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/broker" element={<BrokerDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="text-center p-8 text-red-500">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
