import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, Gamepad2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  experience: string;
  participants: number;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  customerEmail?: string;
}

const BookingSuccess: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    verifyPaymentAndSaveBooking(sessionId);
  }, [searchParams]);

  const verifyPaymentAndSaveBooking = async (sessionId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      const { booking, paymentDetails } = await response.json();
      setBookingData(booking);
      setPaymentDetails(paymentDetails);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    navigate('/booking');
  };

  if (loading) {
    return (
      <>
        <section className="py-20 bg-white min-h-screen mt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('processing')}...
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error || !bookingData) {
    return (
      <>
        <section className="py-20 bg-white min-h-screen mt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 rounded-xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('paymentError')}
              </h2>
              <p className="text-red-700 text-lg mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {error || t('bookingError')}
              </p>
              <button
                onClick={handleNewBooking}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('tryAgain')}
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="py-20 bg-white min-h-screen mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-green-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('paymentSuccessTitle')}
            </h2>
            
            <p className="text-green-700 text-lg mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('paymentSuccessMessage')}
            </p>

            {/* Booking Confirmation Details */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('bookingConfirmationDetails')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-blue-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('date')}</p>
                    <p className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{bookingData.booking_date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-blue-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('time')}</p>
                    <p className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{bookingData.booking_time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Gamepad2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-blue-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('experience')}</p>
                    <p className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{bookingData.experience}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-blue-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('participants')}</p>
                    <p className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {bookingData.participants} {bookingData.participants === 1 ? t('person') : t('people')}
                    </p>
                  </div>
                </div>
              </div>

              {paymentDetails && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {t('paymentConfirmed')}
                  </p>
                  <p className="text-green-700 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    €{paymentDetails.amount.toFixed(2)} {t('depositPaid')}
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('nextSteps')}
              </h4>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <p className="text-blue-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {t('nextStep1')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <p className="text-blue-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {t('nextStep2')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <p className="text-blue-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {t('nextStep3')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('contactInformation')}
              </h4>
              <div className="space-y-2">
                <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  📞 +353 (87) 483 8264
                </p>
                <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ✉️ virtualadventurekillarney@gmail.com
                </p>
                <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  📍 V93 W0YE, Shopping Arcade, New Street, Killarney
                </p>
              </div>
            </div>

            <button
              onClick={handleNewBooking}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('makeAnotherBooking')}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BookingSuccess;