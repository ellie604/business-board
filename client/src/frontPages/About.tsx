import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/california-business-sales-logo.png';
import CallbackRequest from './CallbackRequest';

const About: React.FC = () => {
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
              <Link to="/about" className="text-gray-700 hover:text-orange-500 font-medium border-b-2 border-orange-500">
                ABOUT
              </Link>
              <Link to="/selling" className="text-gray-700 hover:text-orange-500 font-medium">
                SELLING
              </Link>
              <Link to="/buying" className="text-gray-700 hover:text-orange-500 font-medium">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-xl text-gray-600">Expert Business Sales & Acquisitions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Experience</h2>
                <p className="text-gray-600 mb-4">
                  With years of experience in business sales and acquisitions, we understand the complexities 
                  of buying and selling businesses. Our team is dedicated to providing professional, 
                  confidential, and successful transactions.
                </p>
                <p className="text-gray-600">
                  We work with business owners who are ready to transition to their next chapter and 
                  with buyers who are looking for the right investment opportunity.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Services</h2>
                <ul className="text-gray-600 space-y-2">
                  <li>• Business Valuation & Analysis</li>
                  <li>• Marketing & Buyer Identification</li>
                  <li>• Due Diligence Support</li>
                  <li>• Transaction Coordination</li>
                  <li>• Confidential Negotiations</li>
                  <li>• Closing Assistance</li>
                </ul>
              </div>
            </div>
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

export default About; 