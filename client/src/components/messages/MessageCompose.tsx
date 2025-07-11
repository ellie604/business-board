import React, { useState, useCallback } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MessageComposeProps {
  contacts: Contact[];
  onSend: (data: {
    receiverId: string;
    subject: string;
    content: string;
    attachments?: File[];
  }) => Promise<void>;
}

const MessageCompose: React.FC<MessageComposeProps> = React.memo(({ contacts, onSend }) => {
  const [receiverId, setReceiverId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure contacts is always an array
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !subject || !content) {
      return;
    }

    setIsLoading(true);
    try {
      await onSend({
        receiverId,
        subject,
        content,
        attachments,
      });
      // Reset form
      setReceiverId('');
      setSubject('');
      setContent('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [receiverId, subject, content, attachments, onSend]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  }, []);

  const handleReceiverChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setReceiverId(e.target.value);
  }, []);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">
          To:
        </label>
        <select
          id="receiver"
          value={receiverId}
          onChange={handleReceiverChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select recipient</option>
          {safeContacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name || contact.email} ({contact.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject:
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={handleSubjectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Message:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">
          Attachments:
        </label>
        <input
          type="file"
          id="attachments"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {attachments.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Selected files:</p>
            <ul className="mt-1 text-sm text-gray-600">
              {attachments.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
});

MessageCompose.displayName = 'MessageCompose';

export default MessageCompose; 