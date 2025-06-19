import React, { useCallback } from 'react';
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
}> = React.memo(({ message, onMessageClick }) => {
  const handleClick = useCallback(() => {
    onMessageClick(message);
  }, [message, onMessageClick]);

  const handleAttachmentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 ${
        !message.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-medium ${!message.isRead ? 'font-bold' : ''}`}>
            {message.subject}
          </h3>
          <p className="text-sm text-gray-600">
            From: {message.senderName} To: {message.receiverName}
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
        </span>
      </div>
      <p className="mt-2 text-gray-600 line-clamp-2">{message.content}</p>
      {message.attachments.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Attachments: {message.attachments.length}
          </p>
          <div className="flex gap-2 mt-1">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
                onClick={handleAttachmentClick}
              >
                {attachment.fileName}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const MessageList: React.FC<MessageListProps> = React.memo(({ messages, onMessageClick }) => {
  return (
    <div className="divide-y divide-gray-200">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onMessageClick={onMessageClick}
        />
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList; 