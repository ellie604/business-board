import React from 'react';
import meetingImage from '../assets/ChatGPT-meeting-sellingbiz.png';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

const SellingYourBusiness: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="grid grid-cols-2 gap-12 h-full">
            {/* Left Column - Content */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">Selling A Business?</h1>
              
              <div className="space-y-5 text-gray-700 text-base leading-relaxed">
                <p>
                  If you are contemplating selling your business, it's worth getting an appraisal of your company. Why? Because inflated price expectations waste your time and selling for too little robs you of the equity you've built.
                </p>
                
                <p>
                  California Business Sales can perform a business valuation that establishes a fair market asking price. Our experts review your financials and asset base to extract every bit of value and equity you're entitled to.
                </p>
                
                <p>
                  We create an effective marketing and sales strategy, explain the process, pre-qualify buyers, and assist you through negotiations and due diligence.
                </p>
                
                <p>
                  We believe we're forming a partnership with our clients. Whether you're looking to expand with a merger or liquidate as part of your exit strategy, we're here to help you achieve your goals.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
              <img 
                src={meetingImage} 
                alt="Business meeting discussion" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Callback Request Component */}
      <CallbackRequest />
    </div>
  );
};

export default SellingYourBusiness; 