import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressSteps from '../../components/ProgressSteps';

// Mock data - will be replaced with API calls later
const mockSellerSteps = [
  { title: 'Download your listing agreement', completed: true },
  { title: 'Fill out your business questionnaire Online', completed: true },
  { title: 'Upload your Financial documents', completed: true },
  { title: 'Buyer Activity: Up to the minute updates on buyers', completed: false },
  { title: 'Download your purchase contract', completed: false },
  { title: 'Upload due diligence documents', completed: false },
  { title: 'Download Closing document once we are closed', completed: false },
  { title: 'After the Sale: Learn about ways mitigate taxes on the proceeds', completed: false }
];

const mockDocuments = [
  {
    id: '1',
    name: 'Listing Agreement.pdf',
    uploadDate: '2024-03-01',
    size: '2.5 MB',
    downloadUrl: '/documents/listing-agreement.pdf'
  },
  {
    id: '2',
    name: 'Business Questionnaire.pdf',
    uploadDate: '2024-03-02',
    size: '1.8 MB',
    downloadUrl: '/documents/questionnaire.pdf'
  },
  {
    id: '3',
    name: 'Financial Statements.pdf',
    uploadDate: '2024-03-03',
    size: '3.2 MB',
    downloadUrl: '/documents/financials.pdf'
  },
  {
    id: '4',
    name: 'Tax Returns 2023.pdf',
    uploadDate: '2024-03-04',
    size: '4.1 MB',
    downloadUrl: '/documents/tax-returns-2023.pdf'
  },
  {
    id: '5',
    name: 'Equipment Inventory.xlsx',
    uploadDate: '2024-03-05',
    size: '1.5 MB',
    downloadUrl: '/documents/equipment-inventory.xlsx'
  },
  {
    id: '6',
    name: 'Employee Contracts.zip',
    uploadDate: '2024-03-06',
    size: '5.2 MB',
    downloadUrl: '/documents/employee-contracts.zip'
  },
  {
    id: '7',
    name: 'Lease Agreement.pdf',
    uploadDate: '2024-03-07',
    size: '2.8 MB',
    downloadUrl: '/documents/lease-agreement.pdf'
  },
  {
    id: '8',
    name: 'Insurance Policies.pdf',
    uploadDate: '2024-03-08',
    size: '3.5 MB',
    downloadUrl: '/documents/insurance-policies.pdf'
  },
  {
    id: '9',
    name: 'Business Licenses.pdf',
    uploadDate: '2024-03-09',
    size: '1.9 MB',
    downloadUrl: '/documents/business-licenses.pdf'
  },
  {
    id: '10',
    name: 'Vendor Contracts.pdf',
    uploadDate: '2024-03-10',
    size: '2.7 MB',
    downloadUrl: '/documents/vendor-contracts.pdf'
  },
  {
    id: '11',
    name: 'Property Photos.zip',
    uploadDate: '2024-03-11',
    size: '8.4 MB',
    downloadUrl: '/documents/property-photos.zip'
  },
  {
    id: '12',
    name: 'Marketing Materials.pdf',
    uploadDate: '2024-03-12',
    size: '4.3 MB',
    downloadUrl: '/documents/marketing-materials.pdf'
  }
];

const SellerListing: React.FC = () => {
  const { sellerId, listingId } = useParams<{ sellerId: string; listingId: string }>();
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate('/broker/sellers');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Progress</h1>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Seller List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ProgressSteps steps={mockSellerSteps} type="seller" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg h-[calc(100vh-12rem)] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-6">Uploaded Documents</h3>
          <div className="grid grid-cols-1 gap-4">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-blue-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on {doc.uploadDate} • {doc.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(doc.downloadUrl, '_blank')}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerListing; 