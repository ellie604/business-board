import React from 'react';
import { Navigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import BrokerDashboard from './pages/BrokerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
// ... 其他导入

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/broker" element={<BrokerDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App; 