import React, { useCallback, useState } from 'react';
import { format } from 'date-fns';

interface Message {
  id: string;
  subject: string;
  content: string;
  createdAt: string;
  senderName: string;
  receiverName: string;
  isRead: boolean;
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
}

interface MessageListProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
}

const MessageItem: React.FC<{ 
  message: Message; 
  onMessageClick: (message: Message) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}> = React.memo(({ message, onMessageClick, isExpanded, onToggleExpanded }) => {
  const handleClick = useCallback(() => {
    // Mark as read if not read
    if (!message.isRead) {
      onMessageClick(message);
    }
    // Toggle expanded state
    onToggleExpanded();
  }, [message, onMessageClick, onToggleExpanded]);

  const handleAttachmentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
        !message.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      } ${isExpanded ? 'bg-gray-50' : ''}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-medium ${!message.isRead ? 'font-bold text-blue-900' : 'text-gray-900'}`}>
              {message.subject}
            </h3>
            {!message.isRead && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            From: <span className="font-medium">{message.senderName}</span> To: <span className="font-medium">{message.receiverName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
          </span>
          <div className="text-gray-400">
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>
      
      {/* Message Content */}
      <div className="mt-3">
        {isExpanded ? (
          <div className="bg-white border rounded-lg p-4">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {message.content}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 line-clamp-2">
            {message.content}
          </p>
        )}
      </div>

      {/* Attachments */}
      {message.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-medium mb-2">
            📎 Attachments ({message.attachments.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded"
                onClick={handleAttachmentClick}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {attachment.fileName}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Click hint for collapsed messages */}
      {!isExpanded && (
        <div className="mt-2 text-xs text-gray-500">
          Click to expand message
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const MessageList: React.FC<MessageListProps> = React.memo(({ messages, onMessageClick }) => {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const handleToggleExpanded = useCallback((messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="divide-y divide-gray-200">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onMessageClick={onMessageClick}
          isExpanded={expandedMessages.has(message.id)}
          onToggleExpanded={() => handleToggleExpanded(message.id)}
        />
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList; 