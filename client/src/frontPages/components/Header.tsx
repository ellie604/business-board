import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/california-business-sales-logo.png';

const Header: React.FC = () => {
  const [showSellingDropdown, setShowSellingDropdown] = useState(false);
  const [showBuyingDropdown, setShowBuyingDropdown] = useState(false);
  const sellingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buyingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellingDropdownRef = useRef<HTMLDivElement>(null);
  const buyingDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Selling dropdown handlers
  const handleSellingMouseEnter = () => {
    if (sellingTimeoutRef.current) {
      clearTimeout(sellingTimeoutRef.current);
    }
    setShowSellingDropdown(true);
  };

  const handleSellingMouseLeave = () => {
    sellingTimeoutRef.current = setTimeout(() => {
      setShowSellingDropdown(false);
    }, 300);
  };

  const handleSellingClick = () => {
    setShowSellingDropdown(!showSellingDropdown);
  };

  // Buying dropdown handlers
  const handleBuyingMouseEnter = () => {
    if (buyingTimeoutRef.current) {
      clearTimeout(buyingTimeoutRef.current);
    }
    setShowBuyingDropdown(true);
  };

  const handleBuyingMouseLeave = () => {
    buyingTimeoutRef.current = setTimeout(() => {
      setShowBuyingDropdown(false);
    }, 300);
  };

  const handleBuyingClick = () => {
    setShowBuyingDropdown(!showBuyingDropdown);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sellingDropdownRef.current && !sellingDropdownRef.current.contains(event.target as Node)) {
        setShowSellingDropdown(false);
      }
      if (buyingDropdownRef.current && !buyingDropdownRef.current.contains(event.target as Node)) {
        setShowBuyingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (sellingTimeoutRef.current) {
        clearTimeout(sellingTimeoutRef.current);
      }
      if (buyingTimeoutRef.current) {
        clearTimeout(buyingTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to check if current path matches
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="relative flex-shrink-0">
      {/* Top bar with contact info */}
      <div className="bg-gray-800 text-white text-sm py-1 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>📞 Call (916) 474-0390</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/registration" className="hover:text-gray-300">Registration</Link>
          <span>|</span>
          <Link to="/nda" className="hover:text-gray-300">NDA</Link>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white shadow-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="California Business Sales" 
              className="h-10 w-auto"
            />
          </div>

          {/* Navigation Links - Right aligned with uniform spacing */}
          <div className="flex-1 flex justify-end">
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-8">
                <div className="nav-item flex justify-center min-w-[70px]">
                  <Link 
                    to="/" 
                    className={`text-gray-800 hover:text-[#B59152] text-sm font-normal whitespace-nowrap ${
                      isActive('/') ? 'border-b-2 border-[#B59152]' : ''
                    }`}
                  >
                    HOME
                  </Link>
                </div>
                <div className="nav-item flex justify-center min-w-[70px]">
                  <Link 
                    to="/about" 
                    className={`text-gray-800 hover:text-[#B59152] text-sm font-normal whitespace-nowrap ${
                      isActive('/about') ? 'border-b-2 border-[#B59152]' : ''
                    }`}
                  >
                    ABOUT
                  </Link>
                </div>
                <div className="nav-item flex justify-center min-w-[70px]">
                  {/* Selling Dropdown */}
                  <div 
                    ref={sellingDropdownRef}
                    className="relative"
                    onMouseEnter={handleSellingMouseEnter}
                    onMouseLeave={handleSellingMouseLeave}
                  >
                    <button
                      onClick={handleSellingClick}
                      className={`text-gray-800 hover:text-[#B59152] text-sm font-normal flex items-center bg-transparent border-none cursor-pointer whitespace-nowrap ${
                        isActive('/selling') ? 'border-b-2 border-[#B59152]' : ''
                      }`}
                    >
                      SELLING
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showSellingDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="py-2">
                          <Link
                            to="/selling/your-business"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            onClick={() => setShowSellingDropdown(false)}
                          >
                            Selling Your Business
                          </Link>
                          <Link
                            to="/selling/faqs"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            onClick={() => setShowSellingDropdown(false)}
                          >
                            FAQs
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="nav-item flex justify-center min-w-[70px]">
                  {/* Buying Dropdown */}
                  <div 
                    ref={buyingDropdownRef}
                    className="relative"
                    onMouseEnter={handleBuyingMouseEnter}
                    onMouseLeave={handleBuyingMouseLeave}
                  >
                    <button
                      onClick={handleBuyingClick}
                      className={`text-gray-800 hover:text-[#B59152] text-sm font-normal flex items-center bg-transparent border-none cursor-pointer whitespace-nowrap ${
                        isActive('/buying') ? 'border-b-2 border-[#B59152]' : ''
                      }`}
                    >
                      BUYING
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showBuyingDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="py-2">
                          <Link
                            to="/buying/business"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            onClick={() => setShowBuyingDropdown(false)}
                          >
                            Buy a Business
                          </Link>
                          <Link
                            to="/buying/faqs"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            onClick={() => setShowBuyingDropdown(false)}
                          >
                            FAQs
                          </Link>
                          <Link
                            to="/buying/nda"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            onClick={() => setShowBuyingDropdown(false)}
                          >
                            Non Disclosure Agreement
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="nav-item flex justify-center min-w-[70px]">
                  <Link 
                    to="/blog" 
                    className={`text-gray-800 hover:text-[#B59152] text-sm font-normal whitespace-nowrap ${
                      isActive('/blog') ? 'border-b-2 border-[#B59152]' : ''
                    }`}
                  >
                    BLOG
                  </Link>
                </div>
                <div className="nav-item flex justify-center min-w-[70px]">
                  <Link 
                    to="/contact" 
                    className={`text-gray-800 hover:text-[#B59152] text-sm font-normal whitespace-nowrap ${
                      isActive('/contact') ? 'border-b-2 border-[#B59152]' : ''
                    }`}
                  >
                    CONTACT
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Login Button - Right aligned */}
          <div className="hidden md:flex ml-6">
            <Link to="/login" className="bg-[#1a2341] text-white text-sm font-normal px-3 py-1 rounded-md hover:bg-[#B59152] hover:text-[#1a2341] transition-colors duration-200 border border-[#1a2341]">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 