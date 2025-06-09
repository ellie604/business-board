import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login';
import BrokerDashboard from './pages/BrokerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import MessagesPage from './pages/messages';
import BrokerAgentsPage from './pages/BrokerAgentsPage';
import BrokerListingsPage from './pages/BrokerListingsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/broker" element={<BrokerDashboard />}>
            <Route path="messages" element={<MessagesPage userType="BROKER" />} />
            <Route path="agents" element={<BrokerAgentsPage />} />
            <Route path="listings" element={<BrokerListingsPage />} />
          </Route>
          <Route path="/agent" element={<AgentDashboard />}>
            <Route path="messages" element={<MessagesPage userType="AGENT" />} />
          </Route>
          <Route path="/seller" element={<SellerDashboard />}>
            <Route path="messages" element={<MessagesPage userType="SELLER" />} />
          </Route>
          <Route path="/buyer" element={<BuyerDashboard />}>
            <Route path="messages" element={<MessagesPage userType="BUYER" />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="text-center p-8 text-red-500">404 Not Found</div>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
