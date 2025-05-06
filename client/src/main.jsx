import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Login.tsx'

import BrokerDashboard from './pages/BrokerDashboard.jsx'
import AgentDashboard from './pages/AgentDashboard.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/broker" element={<BrokerDashboard />} />
        <Route path="/dashboard/agent" element={<AgentDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard />} />
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        <Route path="*" element={<div className="text-center p-8 text-red-500">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
