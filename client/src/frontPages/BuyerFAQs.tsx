import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';
import faqImage from '../assets/ChatGPT Image Jul 9, 2025 at 03_00_15 PM.png';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const BuyerFAQs: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Do I need an attorney?",
      answer: `It may be advisable to have an attorney review the legal documents. It is important, however, that the attorney you hire is familiar with the business buying process and has the time available to handle the paperwork on a timely basis. If the attorney does not have experience in handling business sales, you may be paying for the attorney’s education. Most business brokers have lists of attorneys who are familiar with the business buying process. An experienced attorney can be of real assistance in making sure that all of the details are handled properly. Business brokers are not qualified to give legal advice.\n\nHowever, keep in mind that many attorneys are not qualified to give business advice. Your attorney will be, and should be, looking after your interests; however, you need to remember that the seller’s interests must also be considered. If the attorney goes too far in trying to protect your interests, the seller’s attorney will instruct his or her client not to proceed. The transaction must be fair for all parties. The attorney works for you, and you must have a say in how everything is done.\n\nIf you know someone who has owned their own business for a period of time, he or she may also be a valuable resource in answering your questions about how small business really works.\n\nYou have to make the final decision; that “leap of faith” between looking and actually being in business for yourself is a decision that only you can make!`
    },
    {
      id: 2,
      question: "Why should I go to a business broker?",
      answer: `A professional business broker can be helpful in many ways. They can provide you with a selection of different and, in many cases, unique businesses, including many that you would not be able to find on your own. Approximately 90 percent of those who buy businesses end up with something completely different from the business that they first inquired about. Business brokers can offer you a wide variety of businesses to look at and consider.\n\nBusiness brokers are also an excellent source of information about small business and the business buying process. They are familiar with the market and can advise you about trends, pricing and what is happening locally. Your business broker will handle all of the details of the business sale and will do everything possible to guide you in the right direction, including, if necessary, consulting other professionals who may be able to assist you.\n\nYour local professional business broker is the best person to talk to about your business needs and requirements.`
    },
    {
      id: 3,
      question: "What happens when I find a business I want to buy?",
      answer: `When you find a business, the business broker will be able to answer many of your questions immediately or will research them for you. Once you get your preliminary questions answered, the typical next step is for the broker to prepare an offer based on the price and terms you feel are appropriate. This offer will generally be subject to your approval of the actual books and records supporting the figures that have been supplied to you. The main purpose of the offer is to see if the seller is willing to accept the price and terms you offered.\n\nThere isn’t much point in continuing if you and the seller can’t get together on price and terms. The offer is then presented to the seller who can approve it, reject it, or counter it with his or her own offer. You, obviously, have the decision of accepting the counter proposal from the seller or rejecting it and going on to consider other businesses.\n\nIf you and the seller agree on the price and terms, the next step is for you to do your “due diligence.” The burden is on you – the buyer – no one else. You may choose to bring in other outside advisors or to do it on your own – the choice is yours. Once you have checked and approved those areas of concern, the closing documents can be prepared, and your purchase of the business can be successfully closed. You will now join many others who, like you, have chosen to become self-employed!`
    },
    {
      id: 4,
      question: "What does it take to be successful?",
      answer: `Certainly, you need adequate capital to buy the business and to make the improvements you want, along with maintaining some reserves in case things start off slowly. You need to be willing to work hard and, in many cases, to put in long hours. Unfortunately, many of today’s buyers are not willing to do what it takes to be successful in owning a business. A business owner has to, as they say, be the janitor, errand boy, employee, bookkeeper and “chief bottle washer!” Too many people think they can buy a business and then just sit behind a desk and work on their business plans. Owners of small businesses must be “doers.”`
    },
    {
      id: 5,
      question: "What should I look for?",
      answer: `Obviously, you want to consider only those businesses that you would feel comfortable owning and operating. “Pride of Ownership” is an important ingredient for success. You also want to consider only those businesses that you can afford with the cash you have available. In addition, the business you buy must be able to supply you with enough income – after making payments on it – to pay your bills. However, you should look at a business with an eye toward what you can do with it – how you can improve it and make it more productive and profitable. There is an old adage advising that you shouldn’t buy a business unless you feel you can do better than the present owner. Everyone has seen examples of a business that needs improvement in order to thrive, and a new owner comes in and does just that. Conversely, there are also cases where a new owner takes over a very successful business and not soon after, it either closes or is sold. It all depends on you!`
    },
    {
      id: 6,
      question: "How are businesses priced?",
      answer: `Generally, at the outset, a prospective seller will ask the business broker what he or she thinks the business will sell for. The business broker usually explains that a review of the financial information will be necessary before a price, or a range of prices, can be suggested for the business.\n\nMost sellers have some idea about what they feel their business should sell for – and this is certainly taken into consideration. However, the business broker is familiar with market considerations and, by reviewing the financial records of the business, can make a recommendation of what he or she feels the market will dictate. A range is normally set with a low and high price. The more cash demanded by the seller, the lower the selling price; the smaller the cash requirements of the seller, the higher the price.\n\nSince most business sales are seller-financed, the down payment and terms of the sale are very important. In many cases, how the sale of the business is structured is more important than the actual selling price. Too many buyers make the mistake of being overly-concerned about the full price when the terms of the sale can make the difference between success and failure.\n\nAn oft-quoted anecdote may better illustrate this point: If you could buy a business that would provide you with more net profit than you thought possible even after subtracting the debt service to the seller, and you could purchase this business with a very small down payment, would you really care what the full price of the business was?`
    },
    {
      id: 7,
      question: "What is the real reason people go into business for themselves?",
      answer: `There have been many surveys taken in an attempt to answer this question. Most surveys reveal the same responses, in almost the same identical order of priority. Here are the results of a typical survey, listed in order of importance:\n\n1. To do my own thing, control my own destiny.\n2. Don’t want to work for someone else.\n3. To better utilize my skills and abilities.\n4. To make money.\n*It is interesting to note that money is not at the top of the list, but comes in fourth.`
    },
    {
      id: 8,
      question: "Why should I buy a business rather than start one?",
      answer: `An existing business has a track record. The failure rate in small business is largely in the start-up phase. The existing business has demonstrated that there is a need for that product or service in a particular locale. Financial records are available along with other information on the business. Most sellers will stay and train a new owner and most will also supply financing. Finding someone who will teach you the intricacies of running a business and who is also willing to finance the sale can make all the difference.`
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
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Buyer FAQs</h1>
                <p className="text-lg text-gray-600">Common questions about buying a business</p>
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
              <img src={faqImage} alt="Buyer FAQ" className="rounded-lg shadow-md max-w-full h-auto object-cover" />
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

export default BuyerFAQs; 