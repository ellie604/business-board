import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/LASkylineSm.jpg';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

const Home: React.FC = () => {
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Hero Section - Made larger */}
      <section 
        className="relative flex-1 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-medium mb-6 leading-tight">
            Selling your Business<br />
            is Our Business
          </h1>
          <p className="text-lg mb-4 font-light">
            You've worked hard on your business, now it's time for it to work for you.
          </p>
          <p className="text-base mb-8 font-light">
            Sell your business in a way that rewards you and honors your life's work.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/selling" className="bg-[#1a2341] hover:bg-[#B59152] hover:text-[#1a2341] text-white px-6 py-2 rounded-md text-sm font-normal border border-[#1a2341] transition-colors duration-200">
              GET STARTED
            </Link>
            <Link to="/about" className="bg-transparent border-2 border-[#1a2341] text-white hover:bg-[#B59152] hover:text-[#1a2341] hover:border-[#B59152] px-6 py-2 rounded-md text-sm font-normal transition-colors duration-200">
              ABOUT US
            </Link>
          </div>
        </div>
      </section>

      {/* Three Features Section - Made smaller */}
      <section className="py-8 bg-gray-50 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Sell A Business */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {/* Dollar Sign SVG Icon */}
                  <svg className="w-6 h-6 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sell a Business</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                Selling your business is a major decision! You have devoted your time, money, and energy into building, running, and operating your business.
              </p>
              <Link to="/selling" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                Learn More →
              </Link>
            </div>

            {/* Buy a Business */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {/* Eye SVG Icon */}
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4C7 4 2.73 7.11 1 12C2.73 16.89 7 20 12 20S21.27 16.89 23 12C21.27 7.11 17 4 12 4ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Buy a Business</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                Click here to view our current business for sale. Contact us to discuss available opportunities that meet your criteria and investment goals.
              </p>
              <Link to="/contact" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                Learn More →
              </Link>
            </div>

            {/* Business Sales Process */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {/* Ear with Sound Waves SVG Icon */}
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20C17 21.1 16.1 22 15 22H9C7.9 22 7 21.1 7 20V18H9V20H15V18H17V20ZM15 4C18.31 4 21 6.69 21 10C21 12.76 19.26 15.09 16.8 15.71L15 17.5V16C15 14.9 14.1 14 13 14H11C9.9 14 9 14.9 9 16V17.5L7.2 15.71C4.74 15.09 3 12.76 3 10C3 6.69 5.69 4 9 4H15M12 6C10.34 6 9 7.34 9 9S10.34 12 12 12S15 10.66 15 9S13.66 6 12 6M12 8C12.55 8 13 8.45 13 9S12.55 10 12 10S11 9.55 11 9S11.45 8 12 8Z"/>
                    <path d="M20 8C20.5 8 21 8.5 21 9S20.5 10 20 10M22 7C22.5 7 23 7.5 23 8S22.5 9 22 9M20 10C20.5 10 21 10.5 21 11S20.5 12 20 12"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Business Sales Process</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                Buying a business can be a complicated procedure, from finding the right one to working out all the details required for a smooth transfer.
              </p>
              <Link to="/buying" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                Learn More →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Callback Request Component */}
      <CallbackRequest />
    </div>
  );
};

export default Home; 