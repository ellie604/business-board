import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/california-business-sales-logo.png';
import CallbackRequest from './CallbackRequest';

const Buying: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <header className="relative flex-shrink-0">
        {/* Top bar with contact info */}
        <div className="bg-gray-800 text-white text-sm py-1 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>📞 Call (916) 474-0390</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/registration" className="hover:text-gray-300">Registration</Link>
            <span>|</span>
            <Link to="/nda" className="hover:text-gray-300">NDA</Link>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="bg-white shadow-sm py-3 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="California Business Sales" 
                className="h-10 w-auto"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-orange-500 font-medium">
                HOME
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-orange-500 font-medium">
                ABOUT
              </Link>
              <Link to="/selling" className="text-gray-700 hover:text-orange-500 font-medium">
                SELLING
              </Link>
              <Link to="/buying" className="text-gray-700 hover:text-orange-500 font-medium border-b-2 border-orange-500">
                BUYING
              </Link>
              <Link to="/listings" className="text-gray-700 hover:text-orange-500 font-medium">
                LISTINGS
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-orange-500 font-medium">
                BLOG
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-500 font-medium">
                CONTACT
              </Link>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Login
              </Link>
            </div>
          </div>
        </nav>
      </header>

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
              to="/listings" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 mr-4"
            >
              View Listings
            </Link>
            <Link 
              to="/contact" 
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center items-center space-x-8 text-sm">
            <span>915 Highland Pointe Drive, Roseville, CA 95747</span>
            <span>|</span>
            <span>Phone: (916) 474-0390</span>
          </div>
        </div>
      </footer>

      {/* Callback Request Component */}
      <CallbackRequest />
    </div>
  );
};

export default Buying; 