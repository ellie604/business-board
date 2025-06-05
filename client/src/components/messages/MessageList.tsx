import React from 'react';
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

const MessageList: React.FC<MessageListProps> = ({ messages, onMessageClick }) => {
  return (
    <div className="divide-y divide-gray-200">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 cursor-pointer hover:bg-gray-50 ${
            !message.isRead ? 'bg-blue-50' : ''
          }`}
          onClick={() => onMessageClick(message)}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    {attachment.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList; 