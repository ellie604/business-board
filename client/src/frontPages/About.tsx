import React, { useState } from 'react';
import angelaSims from '../assets/Angela-Sims.jpg';
import davidSievers from '../assets/David-Sievers.jpg';
import wesBrown from '../assets/wes-brown-profile.jpg';
import xinyiLuo from '../assets/xinyi.jpg';
import decorativeImage from '../assets/corpofficeimages/IMG_1472.jpeg';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

// Modal Component for Detailed Bio
interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  image: string;
  shortBio: string;
  detailedBio?: {
    education?: string;
    credentials?: string[];
    specialties?: string[];
    description: string;
    experience?: string;
  };
}

interface BioModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

const BioModal: React.FC<BioModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Large Profile Image */}
          <div className="flex justify-center">
            <img 
              src={member.image} 
              alt={member.name}
              className="w-48 h-48 rounded-lg object-cover shadow-lg"
            />
          </div>
          
          {/* Contact Information */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{member.position}</h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> 
              <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline ml-1">
                {member.email}
              </a>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> 
              <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline ml-1">
                {member.phone}
              </a>
            </p>
          </div>
          
          {/* Detailed Information */}
          {member.detailedBio && (
            <div className="space-y-4">
              {/* Education */}
              {member.detailedBio.education && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Education</h4>
                  <p className="text-gray-700">{member.detailedBio.education}</p>
                </div>
              )}
              
              {/* Credentials */}
              {member.detailedBio.credentials && member.detailedBio.credentials.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Credentials</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {member.detailedBio.credentials.map((credential, index) => (
                      <li key={index}>{credential}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Specialties */}
              {member.detailedBio.specialties && member.detailedBio.specialties.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Specialties</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {member.detailedBio.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✔️</span>
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Experience Description */}
              {member.detailedBio.experience && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Experience</h4>
                  <p className="text-gray-700 leading-relaxed">{member.detailedBio.experience}</p>
                </div>
              )}
              
              {/* Main Description */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">About</h4>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  {member.detailedBio.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 'wes',
      name: 'Wes Brown',
      position: 'Business Broker',
      email: 'awesb@comcast.net',
      phone: '(916) 474-0390',
      image: wesBrown,
      shortBio: '18 years experience in business brokerage. CABB and IBBA trained. Specializes in maximizing exit strategies and tax reduction.',
      detailedBio: {
        education: 'BS – Mass Communication, MTSU',
        credentials: [
          'Business Broker',
          'Real Estate Broker',
          'IBBA Member',
          'CABB Member',
          'Private Pilot'
        ],
        specialties: [
          'Qualified Opportunity Zones (1400z)',
          '1031 Delaware Statutory Trusts',
          '453 Installment Sales',
          'Energy Investments (263c – Oil & Natural Gas)',
          'Historic & Conservation Real Estate (170h)',
          'Solar Credits & Accelerated Depreciation'
        ],
        experience: 'Helping Business Owners Maximize Their Exit Strategy',
        description: `With 18 years of experience in business brokerage, I've helped countless business owners successfully sell their businesses and reach their financial goals.

I began my career in the commercial division at Century 21 and have been professionally trained by both the California Association of Business Brokers (CABB) and the International Business Brokers Association (IBBA). My expertise extends beyond just selling your business—I help you maximize your sale price, reduce taxes, and structure deals in your best interest.

Many business owners aren't aware of the complexities involved in selling a business. I can guide you through the process, from establishing the most probable selling price to structuring your sale in a way that benefits you the most. If your business includes real estate, you might be able to defer or eliminate capital gains taxes by leveraging strategies like a 1031 exchange into an income-producing commercial property.

I work with specialists in tax reduction strategies. The way your deal is structured can significantly impact how much you walk away with. I'll help you explore all your options, so you can keep more of your hard-earned money and possibly gain income-producing assets after the sale.`
      }
    },
    {
      id: 'david',
      name: 'David Sievers',
      position: 'Business Broker',
      email: 'davidpsievers@gmail.com',
      phone: '(209) 915-3844',
      image: davidSievers,
      shortBio: '5+ years in real estate and commercial sales. Former Colliers International Junior Broker. Mentored by Wes Brown.',
      detailedBio: {
        description: `I have been working in real estate for over 5 years in multiple capacities including property management, residential and commercial sales, and investing. I began my real estate career in property management where I handled the marketing, leasing, maintenance, and financials of numerous properties spanning over two cities.

As my passion for real estate grew, I acquired my real estate license and began working in residential sales in 2020. Working a full time job and practicing as a part-time agent, I quickly realized that I loved generating new leads, working transactions, and closing deals. My drive to work in real estate full time led me to my first position in commercial real estate working for Colliers International's Sacramento Office.

At Colliers I honed my skills as a researcher becoming familiar with new markets, learning how to anticipate market trends and interpreting complex data into research reports. I soon began working as a Junior Broker for Colliers where I specialized in the leasing and sales of industrial assets.

My primary focus was to develop new relationships, generate new business, and manage the sales and leasing operations for my clients. After Colliers I took an operations manager position at Ace Properties, a company that buys out of state rental properties, site unseen, and sells them for a profit to a list of investors.

I have since transitioned into the world of business brokerage where I am being mentored by Wes Brown, who has been in the industry for almost two decades and has a wealth of knowledge in the business brokerage industry.`
      }
    },
    {
      id: 'xinyi',
      name: 'Xinyi Luo',
      position: 'Software Developer',
      email: 'xinyiluo2024@gmail.com',
      phone: '(412) 808-0588',
      image: xinyiLuo,
      shortBio: 'Software developer engineer from Carnegie Mellon University. Expert in information networking, system design, and software development.'
    }
  ];

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-6 relative">
        {/* Decorative Background Image */}
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${decorativeImage})` }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-6 h-full relative z-10">
          <div className="grid grid-cols-2 gap-12 h-full">
            {/* Left Column - About Company */}
            <div className="bg-white rounded-lg shadow-sm p-6 backdrop-blur-sm bg-opacity-95">
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
            <div className="bg-white rounded-lg shadow-sm p-6 backdrop-blur-sm bg-opacity-95">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
              
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-start space-x-4 pb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    onClick={() => handleMemberClick(member)}
                  >
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-36 h-36 rounded-lg object-cover flex-shrink-0 hover:shadow-lg transition-shadow"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium mb-1">{member.position}</p>
                      <p className="text-xs text-gray-600 mb-2">
                        Email: {member.email} | Phone: {member.phone}
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {member.shortBio}
                      </p>
                      <p className="text-xs text-blue-500 mt-2 font-medium">
                        Click to view detailed bio →
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bio Modal */}
      <BioModal member={selectedMember} onClose={handleCloseModal} />

      {/* Footer */}
      <Footer />

      {/* Callback Request Component */}
      <CallbackRequest />
    </div>
  );
};

export default About; 