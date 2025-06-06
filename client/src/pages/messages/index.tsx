import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MessageList from '../../components/messages/MessageList';
import MessageCompose from '../../components/messages/MessageCompose';

import { API_BASE_URL } from '../../config';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'BROKER' | 'AGENT' | 'SELLER' | 'BUYER';
}

interface MessagesPageProps {
  userType: 'BROKER' | 'AGENT' | 'SELLER' | 'BUYER';
}

const MessagesPage: React.FC<MessagesPageProps> = ({ userType }) => {
  const [isComposing, setIsComposing] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const queryClient = useQueryClient();

  // Fetch inbox messages
  const { data: inboxMessages, isLoading: isLoadingInbox, error: inboxError } = useQuery({
    queryKey: ['messages', 'inbox'],
    queryFn: async () => {
      try {
        console.log('Fetching inbox messages...');
        const response = await fetch(`${API_BASE_URL}/messages/inbox`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Inbox response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching inbox:', error);
        throw error;
      }
    },
  });

  // Fetch sent messages
  const { data: sentMessages, isLoading: isLoadingSent, error: sentError } = useQuery({
    queryKey: ['messages', 'sent'],
    queryFn: async () => {
      try {
        console.log('Fetching sent messages...');
        const response = await fetch(`${API_BASE_URL}/messages/sent`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Sent response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching sent:', error);
        throw error;
      }
    },
  });

  // Fetch all users except current user
  const { data: contacts, isLoading: isLoadingContacts, error: contactsError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log('Fetching users...');
        const response = await fetch(`${API_BASE_URL}/users`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Users response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
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
      
      console.log('Sending message with formData:', {
        receiverId: data.receiverId,
        subject: data.subject,
        content: data.content,
        attachmentsCount: data.attachments?.length || 0
      });
      
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
    onSuccess: () => {
      // Invalidate both inbox and sent messages queries
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setIsComposing(false);
      // Switch to sent messages tab after sending
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
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const handleMessageClick = async (message: any) => {
    if (!message.isRead) {
      await markAsReadMutation.mutateAsync(message.id);
    }
  };

  const handleSendMessage = async (data: {
    receiverId: string;
    subject: string;
    content: string;
    attachments?: File[];
  }) => {
    await sendMessageMutation.mutateAsync(data);
  };

  if (isLoadingInbox || isLoadingSent || isLoadingContacts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-gray-600">Logged in as: {userType}</p>
        </div>
        <button
          onClick={() => setIsComposing(!isComposing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isComposing ? 'Cancel' : 'New Message'}
        </button>
      </div>

      {isComposing ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">New Message</h2>
          <MessageCompose
            contacts={contacts || []}
            onSend={handleSendMessage}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
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
            sentMessages && sentMessages.length > 0 ? (
              <MessageList
                messages={sentMessages}
                onMessageClick={handleMessageClick}
              />
            ) : (
              <div className="p-6 text-center text-gray-500">
                No sent messages
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 