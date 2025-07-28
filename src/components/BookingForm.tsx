import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const BookingForm: React.FC = () => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Call the Netlify function to create Stripe checkout session
      const response = await fetch('/.netlify/functions/create-stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/booking`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <section id="booking" className="bg-white mt-8 mb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.imgur.com/GAjV2PZ.png" 
              alt="Virtual Adventure Killarney Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('bookYourAdventure')}</h2>
          <p className="text-xl text-blue-700 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('reserveYourSpot')}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Complete Your Booking
            </h3>
            <p className="text-blue-700 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Click below to proceed to our secure booking form where you can select your VR experience, 
              preferred date & time, and complete your €10 deposit payment.
            </p>
            
            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <strong>What's included:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <li>• Choose from 6 different VR experiences</li>
                <li>• Select your preferred date and time</li>
                <li>• Book for 1-10 participants</li>
                <li>• Secure your booking with just a €10 deposit</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
              isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Booking Session...</span>
              </div>
            ) : (
              'Book Your VR Adventure Now'
            )}
          </button>
          
          <p className="text-xs text-blue-600 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Secure payment processing powered by Stripe
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
