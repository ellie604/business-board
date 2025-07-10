import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CallbackRequest from './CallbackRequest';
import BlogImg1 from '../assets/Blog Images/BlogPost1.jpg';
import BlogImg2 from '../assets/Blog Images/BlogPost2.jpg';
import BlogImg3 from '../assets/Blog Images/BlogPost3.jpeg';
import BlogImg4 from '../assets/Blog Images/BlogPost4.jpg';
import BlogImg5 from '../assets/Blog Images/BlogPost5.jpg';
import BlogImg6 from '../assets/Blog Images/BlogPost6.jpg';

const blogPosts = [
  {
    image: BlogImg1,
    title: 'The Silent Goldmine: Why Small Business Acquisitions Are the Smartest Play of the Decade',
    content: `You’ve been lied to.\nEveryone glorifies the startup grind—endless pitches, risky prototypes, and five years of ramen noodles. But there’s a better way. And it’s been hiding in plain sight.\n\nBuying an existing business is one of the most overlooked, underrated wealth-building strategies of our time.\n\nHere’s why:\n\n1. Proven Cash Flow, Day One\nYou’re not guessing. You’re stepping into something that already works. Revenue is coming in. Customers exist. Systems are in place. You’re not starting at zero—you’re starting at profitable.\n\n2. The Boomer Boom\nMillions of baby boomers are retiring—and many own successful small businesses with no succession plan. This creates a historic transfer of ownership opportunity for savvy buyers. The supply is there. Are you ready to meet it?\n\n3. Built-in Teams, Brand Equity, and Vendor Relationships\nThese are intangibles that take years to build. When you buy a business, you inherit its reputation, loyal customers, trained staff, and vendor deals. You don’t just buy a business. You buy momentum.\n\n4. SBA-Backed Leverage\nWith the right deal structure and 10% down, you can control a six- or seven-figure business using smart leverage. Try doing that with real estate or tech stocks.\n\nBuying smart beats building from scratch.\nIf you’re ready to stop guessing and start growing—welcome to the world of small business acquisition. At California Business Sales, we’re not here to sell you a dream. We’re here to help you buy reality.`
  },
  {
    image: BlogImg2,
    title: 'Beyond the Deal: What Makes a Business Truly Valuable',
    content: `Everyone talks about EBITDA. Few understand value.\nAs a business broker, I can tell you this: Value isn’t just about the numbers. Some businesses with strong financials struggle to sell. Others with modest profit margins get snapped up.\n\nWhy? Because smart buyers look beyond the spreadsheet.\n\nLet’s break down what really drives value:\n\n1. Transferable Systems\nIf the business falls apart without the owner, it’s not a business—it’s a job. A company with documented systems, delegated tasks, and process automation is infinitely more attractive to buyers.\n\n2. Brand and Customer Loyalty\nIs your business just another name on Google? Or does your name mean something in your industry? Loyal, returning customers—and a strong reputation—carry massive value.\n\n3. Team Strength\nBuyers care about culture. Is your team empowered? Are they staying post-sale? A dependable, experienced team reduces transition risk and increases the perceived value of your business.\n\n4. Recurring Revenue\nPredictability is power. Subscription models, service contracts, and long-term clients are value goldmines.\n\n5. Digital Footprint & Data\nIn today’s world, an optimized website, active customer database, and social proof can be the difference between a decent offer and a great one.\n\nIf you want to sell for a premium, start adding value now. At California Business Sales, we help owners prep early and exit strong. Because the real value of a business? It’s in how well it runs—without you.`
  },
  {
    image: BlogImg3,
    title: 'The Kaizen Mindset: Continuous Improvement for Exit-Ready Businesses',
    content: `Selling your business isn't a one-time event. It's a process.\nThe most successful exits are never rushed. They're prepared for—years in advance—with intentional improvements that quietly increase value over time.\n\nThat's the Kaizen mindset: continuous, daily refinement toward a better version of your business.\n\nHere's how to apply it:\n\n1. Audit Your Bottlenecks\nWhere do things slow down? Where do errors keep happening? Start tracking inefficiencies and redesign systems to make them smoother and more resilient.\n\n2. Delegate Like a Seller\nStart acting like the business is no longer yours. What would break without you? Fix that now—delegate, document, and train. Buyers love businesses that run without the founder.\n\n3. Trim the Fat\nDead inventory, legacy software, stale offerings—clean it up. Lean operations are attractive and easier to transition.\n\n4. Build Your Data Story\nStart tracking key metrics: Customer retention, lifetime value, profit per employee. Buyers eat this up—it shows control, insight, and maturity.\n\n5. Ask This Weekly:\n"If I were buying this business today, what would I want fixed first?"\n\nImprovement isn't just about growth—it's about readiness. At California Business Sales, we help business owners build with the end in mind. Because the best exit is the one you prepared for all along.`
  },
  {
    image: BlogImg4,
    title: 'Behind the Curtain: How Buyers Evaluate Your Business',
    content: `Want to sell your business for top dollar?\nThen stop thinking like a seller—and start thinking like a buyer.\n\nBuyers aren’t just looking at your income statement. They’re analyzing risk. They’re looking for landmines. They’re scanning for red flags that even you may have missed.\n\nLet’s peek behind the curtain.\n\nWhat serious buyers evaluate:\n1. Owner Dependency\nIf everything runs through you, the business feels risky. Buyers want turnkey operations—teams, systems, and processes they can step into.\n\n2. Customer Concentration\nDoes 40% of your revenue come from one client? That’s a deal killer. Diversification is security.\n\n3. Financial Hygiene\nClean, accurate books build trust. Sloppy numbers raise suspicion—even if you're profitable.\n\n4. Lease & Contracts\nBuyers check for renewal risk, unfavorable terms, or pending liabilities. If you haven’t reviewed your leases or vendor contracts in a while—do it now.\n\n5. Online Reviews & Reputation\nYes, they Google you. Bad Yelp or BBB ratings? It matters. Start cleaning up your digital reputation long before you sell.\n\nWant top dollar? Think like a buyer.\nAt California Business Sales, we walk sellers through every lens a buyer will use—so you’re never caught off guard. Transparency isn’t just ethical—it’s profitable.`
  },
  {
    image: BlogImg5,
    title: 'Business Brokering with Integrity: Why It’s Time for a New Standard',
    content: `Let’s be honest. This industry has trust issues.\nToo many brokers are glorified salespeople. Rushing deals. Hiding flaws. Churning listings. I started California Business Sales because I believe there’s a better way.\n\nWe do things differently—by design.\n\nHere’s what we stand for:\n1. No Fluff, No Hype\nWe tell the truth—even if it costs us the deal. Because in the long run, honesty earns trust. And trust builds businesses.\n\n2. Education Over Pressure\nMost sellers (and buyers) don’t know how deals really work. We teach first, guide second, close third.\n\n3. Fit Over Fees\nNot every deal is a good match. If it’s not right, we say so. We’re not in this for a fast payday. We’re in this for long-term relationships.\n\n4. Stewardship, Not Just Sales\nYou’ve poured your life into this business. You deserve a broker who respects that—and treats the transition with care, not urgency.\n\nWe call it the California Business Sales Standard—an honest, intelligent, human-centered approach to deal-making. If that resonates with you, we’d be honored to help.`
  },
  {
    image: BlogImg6,
    title: 'From Confusion to Clarity: The Seller’s Guide to a Smooth Exit',
    content: `Selling your business is a big deal. Emotionally. Logistically. Financially.\nIt’s not just paperwork. It’s the culmination of your life’s work. And if you’ve never done it before, it can feel overwhelming.\n\nThat’s why we built this guide—to simplify the journey.\n\nStep 1: Get a Valuation\nDon’t guess your business’s worth. Have a professional run the numbers, compare comps, and assess value drivers.\n\nStep 2: Clean the Books\nTighten your P&L, separate personal expenses, and prepare clean financials. Buyers will ask for them—and then ask again.\n\nStep 3: Prepare Your Team\nBe discreet, but prep key staff for a transition plan. Employees often fear the unknown. A calm handoff plan brings peace of mind.\n\nStep 4: List With Purpose\nNot every buyer is the right buyer. Your broker should filter, vet, and qualify leads—not just hand you inquiries.\n\nStep 5: Negotiate Smart, Exit Proud\nIt’s not just about price. It’s about terms, trust, and transition. Don’t rush. The right buyer will honor your legacy.\n\nAt California Business Sales, we help sellers exit with dignity, not desperation.\nYou’ve built something real. Now let’s make sure the handoff honors it.`
  },
];

const Blog: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  // For mobile responsiveness, adjust heights dynamically
  const mainHeight = 'calc(100vh - 80px - 60px)';

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 bg-gray-50 flex flex-col items-center justify-center" style={{ minHeight: mainHeight, height: mainHeight }}>
        <div className="w-full max-w-[1400px] px-2 md:px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 mt-2">Blog</h1>
          {expanded === null ? (
            // Responsive grid view
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" 
              style={{height: 'calc(100vh - 140px)', maxHeight: 'calc(100vh - 140px)', overflow: 'auto'}}
            >
              {blogPosts.map((post, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow flex flex-col cursor-pointer transition-transform hover:scale-105 overflow-hidden"
                  onClick={() => setExpanded(idx)}
                  style={{ minHeight: '200px', maxHeight: '300px' }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-24 md:h-28 w-full object-cover"
                  />
                  <div className="p-3 flex-1 flex flex-col">
                    <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-1 leading-tight line-clamp-2">{post.title}</h2>
                    <div className="text-gray-600 text-xs flex-1 whitespace-pre-line line-clamp-3">
                      {post.content.split('\n').slice(0, 2).join(' ')} ...
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-[#1a2341] text-xs font-medium">Click to expand</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Responsive expanded view
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-140px)] gap-4">
              {/* Main expanded card */}
              <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden" style={{minWidth:0, minHeight: '300px'}}>
                <img
                  src={blogPosts[expanded].image}
                  alt={blogPosts[expanded].title}
                  className="h-32 md:h-56 w-full object-cover"
                />
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{blogPosts[expanded].title}</h2>
                  <div className="text-gray-700 text-sm flex-1 whitespace-pre-line overflow-y-auto pr-2" style={{maxHeight:'40vh'}}>
                    {blogPosts[expanded].content}
                  </div>
                  <div className="mt-4 text-right">
                    <button className="text-[#1a2341] text-xs font-medium underline" onClick={() => setExpanded(null)}>
                      Collapse
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Side cards - hidden on mobile, shown on larger screens */}
              <div className="hidden lg:flex flex-col gap-2 w-[280px] xl:w-[320px] min-w-[220px] max-w-[340px]">
                {blogPosts.map((post, idx) => (
                  idx !== expanded && (
                    <div
                      key={idx}
                      className="bg-white rounded-lg shadow flex cursor-pointer transition-transform hover:scale-105 overflow-hidden h-[60px] min-h-[60px]"
                      onClick={() => setExpanded(idx)}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-16 object-cover flex-shrink-0 rounded-l-lg"
                      />
                      <div className="pl-2 pr-1 flex-1 flex flex-col justify-center">
                        <div className="text-xs font-semibold text-gray-800 truncate">{post.title}</div>
                        <div className="text-gray-500 text-xs truncate">{post.content.split('\n')[0]}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CallbackRequest />
    </div>
  );
};

export default Blog; 