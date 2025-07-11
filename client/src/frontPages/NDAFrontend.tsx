import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';
import { API_BASE_URL } from '../config';

interface NDAFormData {
  // User Registration Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  
  // Personal Information
  organization: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Business Interest (same as BuyerNonDisclosure.tsx)
  listingInterest: string;  // This is required now
  availableMoney: string;
  minimumIncome: string;
  totalPriceWilling: string;
  californiaRegions: string[];
  timeFrameToPurchase: string;
  
  // Agreement
  agreementAccepted: boolean;
  signature: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
}

const NDAFrontend: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<NDAFormData>({
    // User Registration Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    
    // Personal Information
    organization: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Business Interest
    listingInterest: '',
    availableMoney: '',
    minimumIncome: '',
    totalPriceWilling: '',
    californiaRegions: [],
    timeFrameToPurchase: '',
    
    // Agreement
    agreementAccepted: false,
    signature: ''
  });

  const californiaRegionOptions = [
    'All California',
    'Northern California',
    'Greater Sacramento Region',
    'East Bay',
    'West Bay',
    'Los Angeles Region',
    'San Diego Region',
    'No Preference'
  ];

  const timeFrameOptions = [
    '0-3 months',
    '3-6 months',
    '6-12 months',
    '1-2 years',
    'More than 2 years',
    'No specific timeframe'
  ];

  // Fetch available listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/available-listings`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || []);
        } else {
          console.error('Failed to fetch listings');
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  const handleInputChange = (field: keyof NDAFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      californiaRegions: checked 
        ? [...prev.californiaRegions, region]
        : prev.californiaRegions.filter(r => r !== region)
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      
      // Validate required fields (same as BuyerNonDisclosure.tsx)
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.password || !formData.listingInterest || 
          !formData.agreementAccepted || !formData.signature) {
        setMessage({ type: 'error', text: 'Please fill in all required fields and accept the agreement.' });
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/nda-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || 'Failed to submit NDA');
      }
    } catch (err) {
      console.error('Failed to submit NDA:', err);
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to submit NDA. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">NDA Successfully Submitted!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for completing the Non-Disclosure Agreement. Your information has been processed and you can now log in to your account.
            </p>
            <p className="text-gray-600 mb-8">
              Our broker will review your NDA and contact you with business details that match your criteria. A PDF document has been generated and sent to our brokers.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium transition duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Non-Disclosure Agreement</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p className="text-sm">
              <strong>This NDA is for buyers.</strong> If you have not registered yet, filling out this information will automatically register you into our system which you can log in later.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          {/* User Registration Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">User Registration Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Set your account password"
                  required
                />
              </div>
            </div>
          </section>

          {/* Personal Information Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Business Interest Section - Same as BuyerNonDisclosure.tsx */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Business Interest</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Interest <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">Please select business of interest from the drop down menu</p>
                <select
                  value={formData.listingInterest}
                  onChange={(e) => handleInputChange('listingInterest', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a business...</option>
                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title} - ${listing.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much money do you have available for the purchase of a business?
                </label>
                <input
                  type="text"
                  value={formData.availableMoney}
                  onChange={(e) => handleInputChange('availableMoney', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $500,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is there a minimum amount of money you need to receive from a business?
                </label>
                <input
                  type="text"
                  value={formData.minimumIncome}
                  onChange={(e) => handleInputChange('minimumIncome', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $100,000 annually"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is the total price you are willing to pay for a business?
                </label>
                <input
                  type="text"
                  value={formData.totalPriceWilling}
                  onChange={(e) => handleInputChange('totalPriceWilling', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $1,000,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What regions of California would you consider owning a business in?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {californiaRegionOptions.map((region) => (
                    <label key={region} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.californiaRegions.includes(region)}
                        onChange={(e) => handleRegionChange(region, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your time frame to purchase?
                </label>
                <select
                  value={formData.timeFrameToPurchase}
                  onChange={(e) => handleInputChange('timeFrameToPurchase', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select timeframe...</option>
                  {timeFrameOptions.map((timeFrame) => (
                    <option key={timeFrame} value={timeFrame}>
                      {timeFrame}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Agreement Terms - Same as BuyerNonDisclosure.tsx */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Agreement Terms</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <strong>1.</strong> That information provided on businesses by California Business Sales is sensitive and confidential and that its disclosure to others would be damaging to the businesses and to the broker's fiduciary relationship with the seller.
                </div>
                <div>
                  <strong>2.</strong> That I will not disclose any information regarding these businesses to any other person who has not also signed and dated this agreement, except to secure their advice and counsel, in which case I agree to obtain their consent to maintain such confidentiality. "Information" shall include the fact that the business is for sale, plus other data. The term "information" does not include any information, which is, or becomes, generally available to the public or is already in your possession. All information provided to review the business will be returned to California Business Sales without retaining copies, summaries, analyses, or extracts thereof in the event the review is terminated.
                </div>
                <div>
                  <strong>3.</strong> That I will not contact the seller, his/her employees, suppliers, or customers except through California Business Sales.
                </div>
                <div>
                  <strong>4.</strong> That all information is provided by the seller and is not verified in any way by California Business Sales. California Business Sales is relying on the seller for the accuracy and completeness of said information, has no knowledge of the accuracy of said information, and makes no warranty, express or implied, as to such information.
                </div>
                <div>
                  <strong>5.</strong> California Business Sales does not give tax, accounting, or legal advice. That, prior to finalizing an agreement to purchase a business, it is my responsibility to make an independent verification of all information. I agree that California Business Sales is not responsible for the accuracy of any information I receive, and I agree to indemnify and hold California Business Sales harmless from any claims or damages resulting from its use. I will look only to the seller and to my own investigation for all information regarding any business offered by California Business Sales.
                </div>
                <div>
                  <strong>6.</strong> That, should I enter into an agreement to purchase a business which California Business Sales offers for sale, I grant to the seller the right to obtain, through standard reporting agencies, financial and credit information concerning myself or the companies or other parties I represent; and I understand that this information will be held confidential by the seller and California Business Sales and will be used only for the purpose of the seller extending credit to me.
                </div>
                <div>
                  <strong>7.</strong> That all correspondence, inquiries, offers to purchase, and negotiations relating to the purchase or lease of any business presented to me, or companies I represent, by California Business Sales, will be conducted exclusively through California Business Sales.
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreementAccepted}
                    onChange={(e) => handleInputChange('agreementAccepted', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-sm font-medium text-gray-700">
                    By checking this box you agree to the terms of this agreement. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
          
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your full name as signature"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Please type your full name as your electronic signature</p>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center pt-6 border-t">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit NDA'
              )}
            </button>
          </div>
          
          {/* Message Display */}
          {message && (
            <div className={`rounded-lg p-4 mt-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Callback Request Section */}
        <div className="mt-8">
          <CallbackRequest />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NDAFrontend; 