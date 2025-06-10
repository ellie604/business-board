import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProgressSteps from '../ProgressSteps';

// Mock data - will be replaced with API calls later
const mockBuyerSteps = [
  { title: 'Email the broker or agent', completed: true },
  { title: 'Fill out a Non Disclosure agreement online', completed: true },
  { title: 'Fill out a simple financial statement online', completed: true },
  { title: 'Download a CBR or CIM for the business your interested in', completed: true },
  { title: 'Upload documents', completed: false },
  { title: 'Download your purchase contract', completed: false },
  { title: 'Request & Download Due Diligence documents', completed: false },
  { title: 'Checklist: Check off your to do list', completed: false },
  { title: 'Download Closing document once we are closed', completed: false },
  { title: 'After the Sale: Tips to make your transition smoother', completed: false }
];

const mockDocuments = [
  {
    id: '1',
    name: 'Non-Disclosure Agreement.pdf',
    uploadDate: '2024-03-01',
    size: '1.2 MB',
    downloadUrl: '/documents/nda.pdf'
  },
  {
    id: '2',
    name: 'Financial Statement.pdf',
    uploadDate: '2024-03-02',
    size: '2.1 MB',
    downloadUrl: '/documents/financial-statement.pdf'
  },
  {
    id: '3',
    name: 'Business Profile.pdf',
    uploadDate: '2024-03-03',
    size: '4.5 MB',
    downloadUrl: '/documents/business-profile.pdf'
  },
  {
    id: '4',
    name: 'Proof of Funds.pdf',
    uploadDate: '2024-03-04',
    size: '1.8 MB',
    downloadUrl: '/documents/proof-of-funds.pdf'
  },
  {
    id: '5',
    name: 'Bank Statements.pdf',
    uploadDate: '2024-03-05',
    size: '3.2 MB',
    downloadUrl: '/documents/bank-statements.pdf'
  },
  {
    id: '6',
    name: 'Business Plan.pdf',
    uploadDate: '2024-03-06',
    size: '5.7 MB',
    downloadUrl: '/documents/business-plan.pdf'
  },
  {
    id: '7',
    name: 'Investment Portfolio.pdf',
    uploadDate: '2024-03-07',
    size: '2.9 MB',
    downloadUrl: '/documents/investment-portfolio.pdf'
  },
  {
    id: '8',
    name: 'Credit Report.pdf',
    uploadDate: '2024-03-08',
    size: '1.5 MB',
    downloadUrl: '/documents/credit-report.pdf'
  },
  {
    id: '9',
    name: 'Resume.pdf',
    uploadDate: '2024-03-09',
    size: '0.8 MB',
    downloadUrl: '/documents/resume.pdf'
  },
  {
    id: '10',
    name: 'Reference Letters.pdf',
    uploadDate: '2024-03-10',
    size: '1.6 MB',
    downloadUrl: '/documents/reference-letters.pdf'
  },
  {
    id: '11',
    name: 'Due Diligence Questions.docx',
    uploadDate: '2024-03-11',
    size: '1.1 MB',
    downloadUrl: '/documents/due-diligence-questions.docx'
  },
  {
    id: '12',
    name: 'Purchase Offer Draft.pdf',
    uploadDate: '2024-03-12',
    size: '2.3 MB',
    downloadUrl: '/documents/purchase-offer-draft.pdf'
  }
];

const BuyerProgressView: React.FC = () => {
  const { buyerId, listingId } = useParams<{ buyerId: string; listingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToList = () => {
    if (location.pathname.startsWith('/broker/')) {
      navigate('/broker/buyers');
    } else if (location.pathname.startsWith('/agent/')) {
      navigate('/agent/buyers');
    } else {
      navigate('/broker/buyers');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Buyer Progress</h1>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Buyer List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ProgressSteps steps={mockBuyerSteps} type="buyer" />
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

export default BuyerProgressView; 