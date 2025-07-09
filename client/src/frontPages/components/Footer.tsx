import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center items-center space-x-8 text-sm">
          <span>915 Highland Pointe Drive, Roseville, CA 95747</span>
          <span>|</span>
          <span>Phone: (916) 474-0390</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 