import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Login from './Login';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import MessagesPage from './pages/messages';

// Broker pages
import BrokerDashboard from './pages/broker/BrokerDashboard';
import BrokerListingsPage from './pages/broker/BrokerListingsPage';
import BrokerSellers from './pages/broker/BrokerSellers';
import BrokerBuyers from './pages/broker/BrokerBuyers';
import BrokerAgentsPage from './pages/broker/BrokerAgentsPage';

// Agent pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentListingsPage from './pages/agent/AgentListingsPage';
import AgentSellersPage from './pages/agent/AgentSellersPage';
import AgentBuyersPage from './pages/agent/AgentBuyersPage';

// Seller step pages (11 steps)
import SellerMessages from './pages/seller/SellerMessages';
import SellerListingAgreement from './pages/seller/SellerListingAgreement';
import SellerQuestionnaire from './pages/seller/SellerQuestionnaire';
import SellerUploadDocs from './pages/seller/SellerUploadDocs';
import SellerBuyerActivity from './pages/seller/SellerBuyerActivity';
import SellerPurchaseAgreement from './pages/seller/SellerPurchaseAgreement';
import SellerDueDiligence from './pages/seller/SellerDueDiligence';
import SellerPreCloseChecklist from './pages/seller/SellerPreCloseChecklist';
import SellerClosingDocs from './pages/seller/SellerClosingDocs';
import SellerAfterSale from './pages/seller/SellerAfterSale';

// Buyer step pages (11 steps)
import BuyerMessages from './pages/buyer/BuyerMessages';
import BuyerNonDisclosure from './pages/buyer/BuyerNonDisclosure';
import BuyerFinancialStatement from './pages/buyer/BuyerFinancialStatement';
import BuyerCbrCim from './pages/buyer/BuyerCbrCim';
import BuyerUploadDocs from './pages/buyer/BuyerUploadDocs';
import BuyerPurchaseContract from './pages/buyer/BuyerPurchaseContract';
import BuyerDueDiligence from './pages/buyer/BuyerDueDiligence';
import BuyerPreCloseChecklist from './pages/buyer/BuyerPreCloseChecklist';
import BuyerClosingDocs from './pages/buyer/BuyerClosingDocs';
import BuyerAfterSale from './pages/buyer/BuyerAfterSale';

import SellerProgressView from './components/listings/SellerProgressView';
import BuyerProgressView from './components/listings/BuyerProgressView';

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
            <Route path="sellers" element={<BrokerSellers />} />
            <Route path="buyers" element={<BrokerBuyers />} />
            <Route path="sellers/:sellerId/:listingId/*" element={<SellerProgressView />} />
            <Route path="buyers/:buyerId/:listingId/*" element={<BuyerProgressView />} />
          </Route>
          <Route path="/agent" element={<AgentDashboard />}>
            <Route path="messages" element={<MessagesPage userType="AGENT" />} />
            <Route path="listings" element={<AgentListingsPage />} />
            <Route path="sellers" element={<AgentSellersPage />} />
            <Route path="buyers" element={<AgentBuyersPage />} />
            <Route path="sellers/:sellerId/:listingId/*" element={<SellerProgressView />} />
            <Route path="buyers/:buyerId/:listingId/*" element={<BuyerProgressView />} />
          </Route>
          
          {/* Seller Routes - 所有页面都在dashboard内 */}
          <Route path="/seller" element={<SellerDashboard />}>
            <Route index element={<div />} /> {/* 空的index route */}
            <Route path="messages" element={<SellerMessages />} />
            <Route path="listing-agreement" element={<SellerListingAgreement />} />
            <Route path="questionnaire" element={<SellerQuestionnaire />} />
            <Route path="financials" element={<SellerUploadDocs />} />
            <Route path="buyer-activity" element={<SellerBuyerActivity />} />
            <Route path="purchase-agreement" element={<SellerPurchaseAgreement />} />
            <Route path="due-diligence" element={<SellerDueDiligence />} />
            <Route path="pre-close-checklist" element={<SellerPreCloseChecklist />} />
            <Route path="closing-docs" element={<SellerClosingDocs />} />
            <Route path="after-sale" element={<SellerAfterSale />} />
          </Route>
          
          {/* Buyer Routes - 所有页面都在dashboard内 */}
          <Route path="/buyer" element={<BuyerDashboard />}>
            <Route index element={<div />} /> {/* 空的index route */}
            <Route path="messages" element={<BuyerMessages />} />
            <Route path="non-disclosure" element={<BuyerNonDisclosure />} />
            <Route path="financial-statement" element={<BuyerFinancialStatement />} />
            <Route path="cbr-cim" element={<BuyerCbrCim />} />
            <Route path="upload-docs" element={<BuyerUploadDocs />} />
            <Route path="purchase-contract" element={<BuyerPurchaseContract />} />
            <Route path="due-diligence" element={<BuyerDueDiligence />} />
            <Route path="pre-close-checklist" element={<BuyerPreCloseChecklist />} />
            <Route path="closing-docs" element={<BuyerClosingDocs />} />
            <Route path="after-sale" element={<BuyerAfterSale />} />
          </Route>
          
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
