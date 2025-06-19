import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MessageList from '../../components/messages/MessageList';
import MessageCompose from '../../components/messages/MessageCompose';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

import { API_BASE_URL } from '../../config';
import { buyerService } from '../../services/buyer';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'BROKER' | 'AGENT' | 'SELLER' | 'BUYER';
}

const BuyerMessages: React.FC = () => {
  const [isComposing, setIsComposing] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const queryClient = useQueryClient();

  const steps = useMemo(() => [
    'Select Listing',
    'Messages',
    'Non Disclosure',
    'Financial Statement',
    'CBR/CIM',
    'Upload Docs',
    'Purchase Contract',
    'Due Diligence',
    'Pre Close Checklist',
    'Closing Docs',
    'After The Sale'
  ], []);

  // Fetch progress data
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['buyer-progress'],
    queryFn: async () => {
      const progressRes = await buyerService.getProgress();
      return progressRes.progress;
    },
  });

  // Fetch inbox messages (prioritize over sent messages)
  const { data: inboxMessages, isLoading: isLoadingInbox } = useQuery({
    queryKey: ['messages', 'inbox'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/messages/inbox`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    },
  });

  // Fetch sent messages (lower priority)
  const { data: sentMessages, isLoading: isLoadingSent } = useQuery({
    queryKey: ['messages', 'sent'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/messages/sent`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    },
    enabled: activeTab === 'sent', // Only fetch when needed
  });

  // Fetch contacts (only when composing)
  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.users || [];
    },
    enabled: isComposing, // Only fetch when composing
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: {
      receiverId: string;
      subject: string;
      content: string;
      attachments?: File[];
    }) => {
      const formData = new FormData();
      formData.append('receiverId', data.receiverId);
      formData.append('subject', data.subject);
      formData.append('content', data.content);
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: async () => {
      // Invalidate and refetch queries efficiently
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['messages'] }),
        buyerService.updateStep(1).then(() => {
          queryClient.invalidateQueries({ queryKey: ['buyer-progress'] });
        })
      ]);
      
      setIsComposing(false);
      setActiveTab('sent');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] });
    },
  });

  const handleMessageClick = useCallback(async (message: any) => {
    if (!message.isRead) {
      await markAsReadMutation.mutateAsync(message.id);
    }
  }, [markAsReadMutation]);

  const handleSendMessage = useCallback(async (data: {
    receiverId: string;
    subject: string;
    content: string;
    attachments?: File[];
  }) => {
    await sendMessageMutation.mutateAsync(data);
  }, [sendMessageMutation]);

  // Memoize step calculations
  const stepStatus = useMemo(() => {
    if (!progressData) return { stepCompleted: false, currentStepIndex: 0, isStepFinished: false, isCurrentStep: false, isAccessible: false };
    
    const stepCompleted = progressData.steps[1]?.completed || false;
    const currentStepIndex = progressData.currentStep || 0;
    const isStepFinished = stepCompleted || currentStepIndex > 1;
    const isCurrentStep = currentStepIndex === 1;
    const isAccessible = currentStepIndex >= 1;

    return { stepCompleted, currentStepIndex, isStepFinished, isCurrentStep, isAccessible };
  }, [progressData]);

  // Show loading only for critical data
  const isLoadingCritical = isLoadingProgress || (activeTab === 'inbox' && isLoadingInbox);
  
  if (isLoadingCritical) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <StepGuard stepName="Messages">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progressData?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 2: Messages</h1>
              <p className="text-gray-600 mt-2">Contact your acquisition specialist via secure messaging</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 2 of 11
              </span>
              {stepStatus.isStepFinished ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Finished
                </span>
              ) : stepStatus.isCurrentStep ? (
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Messages</h2>
              <p className="text-sm text-gray-600">Secure communication with your acquisition specialist</p>
            </div>
            <button
              onClick={() => setIsComposing(!isComposing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isComposing ? 'Cancel' : 'New Message'}
            </button>
          </div>

          {isComposing ? (
            <div className="border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">New Message</h3>
              {isLoadingContacts ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <MessageCompose
                  contacts={contacts || []}
                  onSend={handleSendMessage}
                />
              )}
            </div>
          ) : (
            <div className="border rounded-lg">
              <div className="border-b">
                <nav className="flex">
                  <button
                    className={`px-4 py-2 ${
                      activeTab === 'inbox'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('inbox')}
                  >
                    Inbox
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === 'sent'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('sent')}
                  >
                    Sent
                  </button>
                </nav>
              </div>
              
              {activeTab === 'inbox' ? (
                inboxMessages && inboxMessages.length > 0 ? (
                  <MessageList
                    messages={inboxMessages}
                    onMessageClick={handleMessageClick}
                  />
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No messages in your inbox
                  </div>
                )
              ) : (
                <>
                  {isLoadingSent ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : sentMessages && sentMessages.length > 0 ? (
                    <MessageList
                      messages={sentMessages}
                      onMessageClick={handleMessageClick}
                    />
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No sent messages
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerMessages; 