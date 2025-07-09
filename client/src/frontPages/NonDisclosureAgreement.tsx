import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';

const NonDisclosureAgreement: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Non-Disclosure Agreement</h1>
            <p className="text-lg text-gray-600">Protecting confidential business information during the evaluation process</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">About Non-Disclosure Agreements</h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                A Non-Disclosure Agreement (NDA), also known as a Confidentiality Agreement, is a legal contract that protects 
                sensitive business information shared during the business evaluation process. When you're interested in purchasing 
                a business, you'll need to sign an NDA before receiving detailed financial information.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Why NDAs Are Important</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Protects the seller's business information and trade secrets</li>
                  <li>• Maintains customer and supplier confidentiality</li>
                  <li>• Prevents competitors from accessing sensitive data</li>
                  <li>• Creates legal protection for both buyer and seller</li>
                  <li>• Standard practice in all professional business transactions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">What Information Is Protected</h3>
                <p className="mb-3">
                  The NDA typically covers all confidential information shared during the evaluation process, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Financial statements and tax returns</li>
                  <li>Customer lists and supplier information</li>
                  <li>Employee data and compensation details</li>
                  <li>Business operations and processes</li>
                  <li>Marketing strategies and trade secrets</li>
                  <li>Lease agreements and contracts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Obligations as a Buyer</h3>
                <p className="mb-3">
                  By signing an NDA, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Keep all shared information strictly confidential</li>
                  <li>Use the information only for evaluating the business opportunity</li>
                  <li>Not disclose information to unauthorized parties</li>
                  <li>Return or destroy documents if the transaction doesn't proceed</li>
                  <li>Not use the information to compete against the business</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Notes</h3>
                <div className="space-y-2 text-yellow-700">
                  <p>• NDAs are legally binding contracts - take them seriously</p>
                  <p>• Review the terms carefully before signing</p>
                  <p>• Most NDAs remain in effect for 2-5 years</p>
                  <p>• Violation of an NDA can result in legal action and damages</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Begin the Process?</h3>
            <p className="text-gray-600 mb-6">
              To access detailed information about businesses for sale, you'll need to complete and sign our 
              Non-Disclosure Agreement. This is a standard step that protects all parties involved.
            </p>
            
            <div className="flex space-x-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
              >
                Request NDA
              </Link>
              <Link 
                to="/buying/faqs" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
              >
                Buyer FAQs
              </Link>
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

export default NonDisclosureAgreement; 