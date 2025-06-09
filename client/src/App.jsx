import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login';
import BrokerDashboard from './pages/broker/BrokerDashboard';
import AgentDashboard from './pages/agent/AgentDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import MessagesPage from './pages/messages';
import BrokerAgentsPage from './pages/broker/BrokerAgentsPage';
import BrokerListingsPage from './pages/broker/BrokerListingsPage';
import BrokerSellers from './pages/broker/BrokerSellers';
import BrokerBuyers from './pages/broker/BrokerBuyers';
import SellerListing from './pages/seller/SellerListing';
import BuyerListing from './pages/buyer/BuyerListing';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/broker" element={<BrokerDashboard />}>
            <Route index element={<Navigate to="listings" replace />} />
            <Route path="messages" element={<MessagesPage userType="BROKER" />} />
            <Route path="agents" element={<BrokerAgentsPage />} />
            <Route path="listings" element={<BrokerListingsPage />} />
            <Route path="sellers" element={<BrokerSellers />} />
            <Route path="buyers" element={<BrokerBuyers />} />
            <Route path="sellers/:sellerId/:listingId/*" element={<SellerListing />} />
            <Route path="buyers/:buyerId/:listingId/*" element={<BuyerListing />} />
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
          <Route path="*" element={<Navigate to="/broker/listings" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
