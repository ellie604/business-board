import React from 'react';
import angelaSims from '../assets/Angela-Sims.jpg';
import davidSievers from '../assets/David-Sievers.jpg';
import wesBrown from '../assets/wes-brown-profile.jpg';
import xinyiLuo from '../assets/xinyi.jpg';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

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
                    className="w-36 h-36 rounded-lg object-cover flex-shrink-0"
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
                    className="w-36 h-36 rounded-lg object-cover flex-shrink-0"
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

                {/* Xinyi Luo */}
                <div className="flex items-start space-x-4">
                  <img 
                    src={xinyiLuo} 
                    alt="Xinyi Luo" 
                    className="w-36 h-36 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">Xinyi Luo</h3>
                    <p className="text-blue-600 text-sm font-medium mb-1">Software Developer</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Email: xinyiluo2024@gmail.com | Phone: (412) 808-0588
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Software developer engineer from Carnegie Mellon University. Expert in information networking, system design, and software development.
                    </p>
                  </div>
                </div>
              </div>
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

export default About; 