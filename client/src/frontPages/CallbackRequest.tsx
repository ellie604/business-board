import React, { useState } from 'react';

interface CallbackRequestProps {
  onSubmit?: (data: CallbackFormData) => void;
}

interface CallbackFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const CallbackRequest: React.FC<CallbackRequestProps> = ({ onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CallbackFormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call API to send message to broker
      const response = await fetch('/api/callback-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form and close modal
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
        setIsModalOpen(false);
        alert('Thank you! Your message has been sent. We will contact you soon.');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending callback request:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Fixed Request Button - Dark Gold Color */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-700 hover:bg-yellow-800 text-white py-6 px-3 rounded-l-lg shadow-lg transition-colors duration-300"
          style={{ 
            writingMode: 'vertical-lr',
            minHeight: '120px',
            width: '48px'
          }}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm font-medium leading-none">Request a Call Back</span>
          </div>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header - Darker Blue */}
            <div className="bg-blue-800 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Request a Call Back</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded font-bold text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    placeholder="First Name*"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    placeholder="Last Name*"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  placeholder="Email*"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  placeholder="Please tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium transition-colors duration-300"
              >
                {isSubmitting ? 'Sending...' : 'SEND US A MESSAGE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CallbackRequest; 