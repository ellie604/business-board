import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

// 定义buyer数据接口
interface BuyerActivityData {
  id: string;
  buyerNumber: string;
  buyerName: string;
  company: string;
  dateOfContact: string;
  nda: 'Yes' | 'No' | 'Pending';
  preQualified: 'Yes' | 'No' | 'Pending';
  status: 'Interested' | 'Not Interested' | 'Made an offer';
  offerAmount?: number;
  email: string;
  activity: string;
  timestamp: string;
}

const SellerBuyerActivity: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [realBuyers, setRealBuyers] = useState<any[]>([]);
  const [buyerActivityData, setBuyerActivityData] = useState<BuyerActivityData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  
  const ITEMS_PER_PAGE = 25; // 每页显示25条，可容纳300条数据需要12页
  
  const steps = [
    'Home',
    'Messages',
    'Listing Agreement',
    'Questionnaire',
    'Financials',
    'Buyer Activity',
    'Purchase Agreement',
    'Due Diligence',
    'Pre Close Checklist',
    'Closing Docs',
    'After The Sale'
  ];

  // Mock数据生成函数
  const generateMockData = (realBuyers: any[]): BuyerActivityData[] => {
    const mockStatuses: BuyerActivityData['status'][] = ['Interested', 'Not Interested', 'Made an offer'];
    const ndaStatuses: BuyerActivityData['nda'][] = ['Yes', 'No', 'Pending'];
    const preQualifiedStatuses: BuyerActivityData['preQualified'][] = ['Yes', 'No', 'Pending'];
    
    const activities = [
      'Viewed listing details',
      'Downloaded information packet',
      'Requested additional documents',
      'Submitted offer',
      'Scheduled site visit',
      'Reviewed financial documents',
      'Contacted for clarification',
      'Signed NDA',
      'Submitted pre-qualification documents'
    ];

    const companies = [
      'TechCorp Inc.', 'Smith Enterprises', 'Brown Industries', 'Wilson Group',
      'Global Ventures', 'Nexus Partners', 'Alpha Solutions', 'Beta Holdings',
      'Gamma Investment', 'Delta Corp', 'Epsilon LLC', 'Zeta Group',
      'Eta Ventures', 'Theta Capital', 'Iota Holdings', 'Kappa Enterprises'
    ];

    // 将真实买家数据和mock数据结合
    const allBuyerData: BuyerActivityData[] = [];
    
    // 首先添加真实买家数据
    realBuyers.forEach((buyer, index) => {
      const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      const contactDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      allBuyerData.push({
        id: buyer.id,
        buyerNumber: `B${String(index + 1).padStart(3, '0')}`,
        buyerName: buyer.name,
        company: companies[index % companies.length],
        dateOfContact: contactDate.toISOString().split('T')[0],
        nda: ndaStatuses[Math.floor(Math.random() * ndaStatuses.length)],
        preQualified: preQualifiedStatuses[Math.floor(Math.random() * preQualifiedStatuses.length)],
        status,
        offerAmount: status === 'Made an offer' ? Math.floor(Math.random() * 500000) + 200000 : undefined,
        email: buyer.email,
        activity: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    });
    
    // 如果真实买家数量少于300，添加mock数据
    const targetCount = 300;
    const remainingCount = targetCount - realBuyers.length;
    
    for (let i = 0; i < remainingCount; i++) {
      const buyerIndex = realBuyers.length + i + 1;
      const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      const contactDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
      
      allBuyerData.push({
        id: `mock-${i + 1}`,
        buyerNumber: `B${String(buyerIndex).padStart(3, '0')}`,
        buyerName: `Mock Buyer ${buyerIndex}`,
        company: companies[i % companies.length],
        dateOfContact: contactDate.toISOString().split('T')[0],
        nda: ndaStatuses[Math.floor(Math.random() * ndaStatuses.length)],
        preQualified: preQualifiedStatuses[Math.floor(Math.random() * preQualifiedStatuses.length)],
        status,
        offerAmount: status === 'Made an offer' ? Math.floor(Math.random() * 500000) + 200000 : undefined,
        email: `mockbuyer${buyerIndex}@example.com`,
        activity: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return allBuyerData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, buyersRes] = await Promise.all([
          sellerService.getProgress(),
          sellerService.getListingBuyers()
        ]);
        
        setProgress(progressRes.progress);
        setRealBuyers(buyersRes);
        
        // 生成包含真实买家和mock数据的完整数据集
        const mockData = generateMockData(buyersRes);
        setBuyerActivityData(mockData);
        
        // 界面成功加载后，自动标记步骤6为完成
        const currentStepIndex = progressRes.progress?.currentStep || 0;
        const step6Completed = progressRes.progress?.steps[5]?.completed;
        
        console.log('Buyer Activity - Debug Info:', {
          currentStepIndex,
          step6Completed,
          totalSteps: progressRes.progress?.steps?.length,
          allSteps: progressRes.progress?.steps?.map(s => ({ id: s.id, title: s.title, completed: s.completed }))
        });
        
        // 如果当前步骤是6或更高，且步骤6还未完成，则标记为完成
        if (currentStepIndex >= 5 && !step6Completed) {
          console.log('Attempting to mark step 6 as completed...');
          try {
            await sellerService.updateStep(5); // 步骤6的索引是5
            console.log('Step 6 (Buyer Activity) marked as completed successfully');
            
            // 重新获取更新后的进度
            const updatedProgressRes = await sellerService.getProgress();
            setProgress(updatedProgressRes.progress);
            
            console.log('Updated progress:', {
              newCurrentStep: updatedProgressRes.progress?.currentStep,
              newStep6Completed: updatedProgressRes.progress?.steps[5]?.completed
            });
          } catch (updateError) {
            console.error('Failed to update step 6:', updateError);
          }
        } else {
          console.log('Step 6 completion skipped:', {
            reason: currentStepIndex < 5 ? 'Current step is too low' : 'Step 6 already completed',
            currentStepIndex,
            step6Completed
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤和搜索功能
  const filteredData = buyerActivityData.filter(buyer => {
    const matchesSearch = buyer.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.buyerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || buyer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 分页数据
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Interested': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Not Interested': { bg: 'bg-red-100', text: 'text-red-800' },
      'Made an offer': { bg: 'bg-green-100', text: 'text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Interested'];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const getBadge = (value: string, type: 'nda' | 'preQualified') => {
    const colorMap = {
      'Yes': 'bg-green-100 text-green-800',
      'No': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[value as keyof typeof colorMap]}`}>
        {value}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[5]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 5;
  const isAccessible = currentStepIndex >= 5;

  // 统计数据
  const stats = {
    totalViews: Math.floor(Math.random() * 500) + 200,
    interestedBuyers: buyerActivityData.filter(b => b.status === 'Interested').length,
    offersReceived: buyerActivityData.filter(b => b.status === 'Made an offer').length,
    highestOffer: Math.max(...buyerActivityData.filter(b => b.offerAmount).map(b => b.offerAmount!), 0)
  };

  return (
    <StepGuard stepName="Buyer Activity">
      <div className="max-w-7xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 6: Buyer Activity</h1>
              <p className="text-gray-600 mt-2">Monitor interested buyers and their activities in real-time</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 6 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              ) : isCurrentStep ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Active Monitoring
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
              {/* Test button for manual completion */}
              {!stepCompleted && isAccessible && (
                <button
                  onClick={async () => {
                    try {
                      console.log('Manual completion triggered - Current state:', {
                        stepCompleted,
                        currentStepIndex,
                        isAccessible
                      });
                      
                      console.log('Calling updateStep(5)...');
                      const updateResult = await sellerService.updateStep(5);
                      console.log('updateStep result:', updateResult);
                      
                      console.log('Fetching updated progress...');
                      const updatedProgress = await sellerService.getProgress();
                      console.log('Updated progress received:', {
                        currentStep: updatedProgress.progress?.currentStep,
                        step5Completed: updatedProgress.progress?.steps[5]?.completed,
                        allSteps: updatedProgress.progress?.steps?.map(s => ({ 
                          id: s.id, 
                          title: s.title, 
                          completed: s.completed 
                        }))
                      });
                      
                      setProgress(updatedProgress.progress);
                      console.log('Manual completion successful - UI should update now');
                    } catch (error) {
                      console.error('Manual completion failed:', error);
                    }
                  }}
                  className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Interested Buyers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.interestedBuyers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offers Received</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.offersReceived}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Highest Offer</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.highestOffer > 0 ? `$${(stats.highestOffer / 1000).toFixed(0)}K` : '$0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search buyer name, company or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Made an offer">Made an offer</option>
              </select>
              <span className="text-sm text-gray-500">
                Showing {filteredData.length} records
              </span>
            </div>
          </div>
        </div>

        {/* Buyer Activity Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Buyer Activity Data Table</h2>
            <p className="text-gray-600 text-sm mt-1">Expandable to up to 300 buyer records with detailed activity data</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Initial Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NDA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pre qualified by phone and email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {buyer.buyerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(buyer.dateOfContact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getBadge(buyer.nda, 'nda')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getBadge(buyer.preQualified, 'preQualified')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(buyer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{buyer.buyerName}</div>
                        <div className="text-sm text-gray-500">{buyer.company}</div>
                        <div className="text-xs text-gray-400">{buyer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {buyer.offerAmount ? (
                        <span className="font-semibold text-green-600">
                          ${buyer.offerAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/financials')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Financials
          </button>
          <button
            onClick={() => navigate('/seller/purchase-agreement')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Purchase Agreement
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerBuyerActivity; 