import React from 'react';
import buyingBizImage from '../assets/chatgpt-desktop-buyingBiz.png';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

const BuyABusiness: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="grid grid-cols-2 gap-8 h-full items-center">
            {/* Left Column - Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Do you dream of owning your own business?</h1>
              
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  <strong>Buying a business can be a complicated procedure</strong>
                </p>
                
                <p>
                  If you are new to the business buying process, we will be your guide every step of the way. After signing a confidentiality agreement we will then provide you with the business profile information and financial statements that will help you decide if it is right for you.
                </p>
                
                <p>
                  After selecting the business you are interested in, we will then arrange a showing and meeting with the owner. You will be able to tour the facilities and ask questions regarding the operations of the business.
                </p>
                
                <p>
                  We explain the basis on which the business was valued and the terms of the sale required by the owner. In addition, we can help you locate financing.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
              <img 
                src={buyingBizImage} 
                alt="Business buying consultation" 
                className="max-w-lg h-auto rounded-lg"
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

export default BuyABusiness; 