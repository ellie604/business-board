import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/california-business-sales-logo.png';
import CallbackRequest from './CallbackRequest';

const Blog: React.FC = () => {
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
              <Link to="/buying" className="text-gray-700 hover:text-orange-500 font-medium">
                BUYING
              </Link>
              <Link to="/listings" className="text-gray-700 hover:text-orange-500 font-medium">
                LISTINGS
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-orange-500 font-medium border-b-2 border-orange-500">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Business Sales Blog</h1>
            <p className="text-xl text-gray-600">Insights, tips, and news about buying and selling businesses</p>
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sample Blog Post 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">March 15, 2024</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5 Key Factors That Determine Business Value</h3>
                <p className="text-gray-600 mb-4">
                  Understanding what drives business valuation is crucial for any business owner considering a sale...
                </p>
                <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Sample Blog Post 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">March 10, 2024</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Prepare Your Business for Sale</h3>
                <p className="text-gray-600 mb-4">
                  Proper preparation can significantly increase your business value and reduce time to sale...
                </p>
                <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Sample Blog Post 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">March 5, 2024</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Due Diligence: What Buyers Really Look For</h3>
                <p className="text-gray-600 mb-4">
                  Understanding the due diligence process from a buyer's perspective can help sellers prepare...
                </p>
                <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Sample Blog Post 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">February 28, 2024</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Market Trends in Business Acquisitions</h3>
                <p className="text-gray-600 mb-4">
                  Current market conditions and trends affecting business buyers and sellers in California...
                </p>
                <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </Link>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-blue-600 rounded-lg p-8 mt-12 text-center text-white">
            <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
            <p className="mb-6">Subscribe to our newsletter for the latest insights on business sales and acquisitions.</p>
            <div className="flex max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-r-lg font-medium transition duration-300">
                Subscribe
              </button>
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

export default Blog; 