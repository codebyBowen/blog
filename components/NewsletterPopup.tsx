import React from 'react';

const NewsletterPopup: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to My Newsletter</h1>
      <p className="text-gray-600 mb-6">
        Stay updated with the latest content, tips, and insights delivered straight to your inbox.
        Subscribe now to join our community and never miss an update!
      </p>
      <iframe 
        src="https://stockscouter.substack.com/embed" 
        width="100%" 
        height="320" 
        className="border border-gray-200 bg-white" 
        frameBorder="0" 
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default NewsletterPopup;