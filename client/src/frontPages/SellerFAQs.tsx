import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';
import faqImage from '../assets/ChatGPT Image Jul 9, 2025 at 02_58_14 PM.png';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const SellerFAQs: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Why is seller financing so important to the sale of my business?",
      answer: "Surveys have shown that a seller who asks for all cash, receives on average only 70 percent of his or her asking price, while sellers who accept terms receive on average 86 percent of their asking price. That's a difference of 16 percent! In many cases, businesses that are listed for all cash just don't sell. With reasonable terms, however, the chances of selling increase dramatically and the time period from listing to sale greatly decreases. Most sellers are unaware of how much interest they can receive by financing the sale of their business. In some cases it can greatly increase the amount received. And, again, it tells the buyer that the seller has enough confidence that the business can, indeed, pay for itself."
    },
    {
      id: 2,
      question: "What happens when there is a buyer for my business?",
      answer: "When a buyer is sufficiently interested in your business, he or she will, or should, submit an offer in writing. This offer or proposal may have one or more contingencies. Usually, the contingencies concern a detailed review of your financial records and may also include a review of your lease arrangements, franchise agreement (if there is one), or other pertinent details of the business. You may accept the terms of the offer or you may make a counter-proposal. You should understand, however, that if you do not accept the buyer's proposal, the buyer can withdraw it at any time. At first review, you may not be pleased with a particular offer; however, it is important to look at it carefully. It may be lacking in some areas, but it might also have some pluses to seriously consider. There is an old adage that says, \"The first offer is generally the best one the seller will receive.\" This does not mean that you should accept the first, or any offer — just that all offers should be looked at carefully. Once you and the buyer are in agreement, both of you should work to satisfy and remove the contingencies in the offer. It is important that you cooperate fully in this process. You don't want the buyer to think that you are hiding anything. The buyer may, at this point, bring in outside advisors to help them review the information. When all the conditions have been met, final papers will be drawn and signed. Once the closing has been completed, money will be distributed and the new owner will take possession of the business."
    },
    {
      id: 3,
      question: "What can I do to help sell my business?",
      answer: "A buyer will want up-to-date financial information. If you use accountants, you can work with them on making current information available. If you are using an attorney, make sure they are familiar with the business closing process and the laws of your particular state. You might also ask if their schedule will allow them to participate in the closing on very short notice. If you and the buyer want to close the sale quickly, usually within a few weeks, unless there is an alcohol or other license involved that might delay things, you don't want to wait until the attorney can make the time to prepare the documents or attend the closing. Time is of the essence in any business sale transaction. The failure to close on schedule permits the buyer to reconsider or make changes in the original proposal."
    },
    {
      id: 4,
      question: "What can business brokers do – and, what can't they do",
      answer: "Business brokers are the professionals who will facilitate the successful sale of your business. It is important that you understand just what a professional business broker can do — as well as what they can't. They can help you decide how to price your business and how to structure the sale so it makes sense for everyone — you and the buyer. They can find the right buyer for your business, work with you and the buyer in negotiating and along every other step of the way until the transaction is successfully closed. They can also help the buyer in all the details of the business buying process. A business broker is not, however, a magician who can sell an overpriced business. Most businesses are saleable if priced and structured properly. You should understand that only the marketplace can determine what a business will sell for. The amount of the down payment you are willing to accept, along with the terms of the seller financing, can greatly influence not only the ultimate selling price, but also the success of the sale itself."
    },
    {
      id: 5,
      question: "How long does it take to sell my business?",
      answer: "It generally takes, on average, between five to eight months to sell most businesses. Keep in mind that an average is just that. Some businesses will take longer to sell, while others will sell in a shorter period of time. The sooner you have all the information needed to begin the marketing process, the shorter the time period should be. It is also important that the business be priced properly right from the start. Some sellers, operating under the premise that they can always come down in price, overprice their business. This theory often \"backfires,\" because buyers often will refuse to look at an overpriced business. It has been shown that the amount of the down payment may be the key ingredient to a quick sale. The lower the down payment, generally 40 percent of the asking price or less, the shorter the time to a successful sale. A reasonable down payment also tells a potential buyer that the seller has confidence in the business's ability to make the payments."
    }
  ];

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: FAQ List */}
            <div className="max-w-lg w-full mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Seller FAQs</h1>
                <p className="text-lg text-gray-600">Common questions about selling your business</p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    >
                      <div className="flex items-start space-x-3 pr-4">
                        <svg 
                          className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${
                          expandedItems.includes(faq.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedItems.includes(faq.id) && (
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-200 ml-9">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Image */}
            <div className="flex justify-center items-start w-full">
              <img src={faqImage} alt="Seller FAQ" className="rounded-lg shadow-md max-w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Callback Request Component */}
      <CallbackRequest />
    </div>
  );
};

export default SellerFAQs; 