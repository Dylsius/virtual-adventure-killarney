import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CookiesPopup: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="bg-white border-t border-blue-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-1">
                <p className="text-sm text-blue-900 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {t('cookiesMessage')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('decline')}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('acceptCookies')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPopup;