import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/california-business-sales-logo.png';
import angelaSims from '../assets/Angela-Sims.jpg';
import davidSievers from '../assets/David-Sievers.jpg';
import wesBrown from '../assets/wes-brown-profile.jpg';
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
      <main className="flex-1 bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="grid grid-cols-2 gap-12 h-full">
            {/* Left Column - About Company */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">About California Business Sales</h1>
              <h2 className="text-xl text-blue-600 font-semibold mb-4">Get the Best Brokerage Service</h2>
              
              <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                <p>
                  California Business Sales is a boutique business brokerage firm led by Wes Brown, a seasoned broker with over 18 years of experience helping business owners across California. Our office is located near Sacramento.
                </p>
                
                <p>
                  We've grown from selling Main Street businesses to handling multi-million-dollar lower middle-market transactions. Our team includes a full-time broker, agent, and marketing manager.
                </p>
                
                <p>
                  We're known for high-touch, responsive service. Whether you need a fast sale (we've closed in six weeks) or want top dollar, we tailor our approach to your goals.
                </p>
                
                <p>
                  Selling your business is emotional and complex. We provide step-by-step guidance, regular updates, and expert negotiation backed by real-world experience. You may only sell a business once. We sell them every day.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Thinking of selling?</h3>
                  <p className="text-sm text-blue-700">
                    Let's talk. We'll give you a realistic market value and timeline based on real data and decades of experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Our Team */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
              
              <div className="space-y-4">
                {/* Wes Brown */}
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                  <img 
                    src={wesBrown} 
                    alt="Wes Brown" 
                    className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">Wes Brown</h3>
                    <p className="text-blue-600 text-sm font-medium mb-1">Business Broker</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Email: awesb@comcast.net | Phone: (916) 474-0390
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      18 years experience in business brokerage. CABB and IBBA trained. Specializes in maximizing exit strategies and tax reduction.
                    </p>
                  </div>
                </div>

                {/* David Sievers */}
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                  <img 
                    src={davidSievers} 
                    alt="David Sievers" 
                    className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">David Sievers</h3>
                    <p className="text-blue-600 text-sm font-medium mb-1">Business Broker</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Email: davidpsievers@gmail.com | Phone: (209) 915-3844
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      5+ years in real estate and commercial sales. Former Colliers International Junior Broker. Mentored by Wes Brown.
                    </p>
                  </div>
                </div>

                {/* Angela Sims */}
                <div className="flex items-start space-x-4">
                  <img 
                    src={angelaSims} 
                    alt="Angela Sims" 
                    className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">Angela Sims</h3>
                    <p className="text-blue-600 text-sm font-medium mb-1">Director of Marketing</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Email: angela.sims211@gmail.com | Phone: (916) 846-5540
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      B.A. Business Administration from Pacific University. Expert in strategic marketing, data analytics, and brand development.
                    </p>
                  </div>
                </div>
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