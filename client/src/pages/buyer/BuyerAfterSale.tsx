import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import type { BuyerProgress } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const BuyerAfterSale: React.FC = () => {
  const [progress, setProgress] = useState<BuyerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const steps = [
    'Home',
    'Contact your agent via messages',
    'Fill out a Non Disclosure agreement online',
    'Fill out a simple financial statement online',
    'Download a CBR or CIM for the business your interested in',
    'Upload documents for loan pre-approval',
    'Download your purchase contract (once we have an accepted offer)',
    'Request & Download Due Diligence documents',
    'Pre Close Checklist: Check off your to do list',
    'Download Closing document once we are closed',
    'After the Sale: Tips to make your transition smoother'
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await buyerService.getProgress();
        setProgress(progressRes.progress);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[10]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 10;

  return (
    <StepGuard stepName="After The Sale">
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 11: After The Sale</h1>
              <p className="text-gray-600 mt-2">Tips to make your transition smoother</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 11 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Finished
                </span>
              ) : isCurrentStep ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  In Progress
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Congratulations Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-4">🎉 Congratulations on Your Purchase!</h2>
            <p className="text-green-700 text-lg leading-relaxed">
              Now that you've acquired your business, here are some important next steps to ensure a smooth transition 
              and long-term success.
            </p>
          </div>
        </div>

        {/* Main Content - Scrollable Tips */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h3 className="text-2xl font-semibold">After the Sale: Tips & Advice for Buyers</h3>
            <p className="text-blue-100 mt-2">Scroll through these essential guidelines for business ownership success</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-6 space-y-8">
            {/* 1. Secure Your Transition Plan */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                Secure Your Transition Plan
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Follow the Transition Agreement</p>
                    <p className="text-gray-600 text-sm">If the seller agreed to assist for a set period, maximize this time by learning everything you can.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Build Rapport with Key Stakeholders</p>
                    <p className="text-gray-600 text-sm">Employees, customers, and suppliers need confidence in your leadership.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Document Critical Processes</p>
                    <p className="text-gray-600 text-sm">Ensure you have clear documentation of all operational procedures.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Review Financial & Legal Aspects */}
            <div className="border-l-4 border-green-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                Review Financial & Legal Aspects
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Reconcile Accounts</p>
                    <p className="text-gray-600 text-sm">Verify bank accounts, merchant accounts, payroll systems, and accounts payable/receivable.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Confirm Business Licenses & Permits</p>
                    <p className="text-gray-600 text-sm">Ensure all legal requirements are met in your name.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Review Tax Obligations</p>
                    <p className="text-gray-600 text-sm">Understand upcoming tax deadlines and ensure compliance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Retain Key Employees & Culture */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                Retain Key Employees & Culture
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Meet with Staff</p>
                    <p className="text-gray-600 text-sm">Introduce yourself, share your vision, and address concerns.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Retain Institutional Knowledge</p>
                    <p className="text-gray-600 text-sm">Long-term employees have valuable insights—learn from them.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Implement Gradual Changes</p>
                    <p className="text-gray-600 text-sm">Sudden, drastic changes can disrupt operations and morale.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Strengthen Customer & Supplier Relationships */}
            <div className="border-l-4 border-orange-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">4</span>
                Strengthen Customer & Supplier Relationships
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Communicate with Existing Customers</p>
                    <p className="text-gray-600 text-sm">Reassure them that business will continue smoothly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Understand Your Supplier Agreements</p>
                    <p className="text-gray-600 text-sm">Ensure you maintain good terms with existing suppliers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Evaluate Customer Feedback</p>
                    <p className="text-gray-600 text-sm">Look for ways to enhance the business based on existing feedback.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Implement Systems & Improvements */}
            <div className="border-l-4 border-red-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">5</span>
                Implement Systems & Improvements
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Assess Technology & Software</p>
                    <p className="text-gray-600 text-sm">Upgrade outdated systems where necessary.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Review Inventory & Supply Chain</p>
                    <p className="text-gray-600 text-sm">Ensure smooth fulfillment and adjust ordering as needed.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Monitor Cash Flow Closely</p>
                    <p className="text-gray-600 text-sm">Avoid unnecessary spending until you fully understand revenue patterns.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Develop a Long-Term Strategy */}
            <div className="border-l-4 border-indigo-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">6</span>
                Develop a Long-Term Strategy
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Set Clear Goals</p>
                    <p className="text-gray-600 text-sm">Define short-term and long-term objectives.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Measure Key Metrics</p>
                    <p className="text-gray-600 text-sm">Track performance indicators like revenue, profit margins, and customer retention.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Plan for Growth</p>
                    <p className="text-gray-600 text-sm">Identify opportunities for expansion or new revenue streams.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Stay Connected with Professional Support */}
            <div className="border-l-4 border-pink-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">7</span>
                Stay Connected with Professional Support
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Work with a Business Mentor or Coach</p>
                    <p className="text-gray-600 text-sm">Gain insights from experienced professionals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Maintain Legal & Accounting Support</p>
                    <p className="text-gray-600 text-sm">A good lawyer and accountant can help you avoid costly mistakes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Network with Industry Peers</p>
                    <p className="text-gray-600 text-sm">Join local or national business groups for support and connections.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Take Care of Yourself */}
            <div className="border-l-4 border-teal-500 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">8</span>
                Take Care of Yourself
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Delegate Responsibilities</p>
                    <p className="text-gray-600 text-sm">Don't try to do everything yourself.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Stay Organized</p>
                    <p className="text-gray-600 text-sm">Keep track of tasks, deadlines, and progress.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-800">Be Patient & Adaptable</p>
                    <p className="text-gray-600 text-sm">Every transition comes with challenges—stay flexible and proactive.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">🌟 Your Journey Begins Now!</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Thank you for choosing us to guide you through your business acquisition. We're confident that with these tips 
            and your dedication, you'll build a successful and thriving business. Remember, we're here to support you 
            even after the sale.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Contact Support
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Share Your Success Story
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/closing-docs')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Closing Docs
          </button>
          <button
            onClick={() => navigate('/buyer')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerAfterSale; 