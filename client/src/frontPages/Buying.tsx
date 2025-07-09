import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

const Buying: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Buying a Business</h1>
            <p className="text-xl text-gray-600">Find the perfect business opportunity for your investment goals</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Business Acquisition Journey</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Expert Guidance</h3>
                <p className="text-gray-600 mb-4">
                  We guide you through every step of the business acquisition process, from initial 
                  search to final closing, ensuring you make informed decisions.
                </p>
                
                <h3 className="text-lg font-medium text-gray-800 mb-3">Quality Opportunities</h3>
                <p className="text-gray-600">
                  Access our exclusive database of quality businesses for sale, many of which are 
                  not publicly advertised to maintain confidentiality.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Our Process</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Define your acquisition criteria</li>
                  <li>• Search and identify opportunities</li>
                  <li>• Initial business review and screening</li>
                  <li>• Due diligence support</li>
                  <li>• Negotiation assistance</li>
                  <li>• Transaction closing coordination</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Find Your Business?</h3>
            <p className="text-gray-600 mb-6">
              Contact us to discuss your business acquisition goals and explore available opportunities.
            </p>
            <Link 
              to="/contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 mr-4"
            >
              Contact Us
            </Link>
            <Link 
              to="/contact" 
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Get Started
            </Link>
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

export default Buying; 