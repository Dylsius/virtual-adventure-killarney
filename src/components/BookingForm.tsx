import React, { useState } from 'react';
import { Clock, User, Mail, Phone, Gamepad2, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { stripeProducts } from '../stripe-config';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  experience: string;
  participants: number;
}

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

const BookingForm: React.FC = () => {
  const { t } = useLanguage();

  console.log('🚀 BookingForm component loaded at:', new Date().toISOString());

  const experiences = [
    `${t('carName')} - ${t('carGames')}`,
    `${t('eggChairName')} - ${t('eggChairGames')}`,
    `${t('ultimateCrossingName')} - ${t('ultimateCrossingGames')}`,
    `${t('vr360Name')} - ${t('vr360Games')}`,
    `${t('virtualRelaxationName')} - ${t('virtualRelaxationGames')}`,
    `${t('kindBearName')} - ${t('kindBearGames')}`
  ];

  const [formData, setFormData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    experience: '',
    participants: 1
  });

 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  // No need to prevent default, Netlify will handle the submission
  // No client-side state changes needed here for payment flow
};




  const isFormValid = formData.name && formData.email && formData.phone && 
                     formData.date && formData.time && formData.experience;

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
          <p className="text-xl text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('reserveYourSpot')}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-8">
         <form
    data-netlify="true"
    name="booking"
    action="https://buy.stripe.com/bJedR9go75ZggPIdwh9IQ00"
    method="POST"
    className="space-y-6"
> <input type="hidden" name="form-name" value="booking" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <User className="h-4 w-4 mr-2" />
                  {t('fullName')} {t('required')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder={t('enterFullName')}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Mail className="h-4 w-4 mr-2" />
                  {t('emailAddress')} {t('required')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder={t('enterEmail')}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Phone className="h-4 w-4 mr-2" />
                  {t('phoneNumber')} {t('required')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder={t('enterPhone')}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <User className="h-4 w-4 mr-2" />
                  {t('numberOfParticipants')}
                </label>
                <select
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? t('person') : t('people')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('preferredDate')} {t('required')}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Clock className="h-4 w-4 mr-2" />
                  {t('preferredTime')} {t('required')}
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <option value="">{t('selectTimeSlot')}</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Gamepad2 className="h-4 w-4 mr-2" />
                {t('vrExperience')} {t('required')}
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <option value="">{t('chooseVrExperience')}</option>
                {experiences.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <strong>{t('note')}:</strong> A €10 deposit is required to secure your booking.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {error}
                </p>
              </div>
            )}

            {!showPayment ? (
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Review Booking
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Booking Summary
                  </h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>Date:</strong> {formData.date}</p>
                    <p><strong>Time:</strong> {formData.time}</p>
                    <p><strong>Experience:</strong> {formData.experience}</p>
                    <p><strong>Participants:</strong> {formData.participants}</p>
                  </div>
                </div>
                
                <button
                  onClick={handlePayment}
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
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Pay €10 Deposit'
                  )}
                </button>
                
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full py-2 px-4 text-blue-600 hover:text-blue-800 font-medium"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  ← Back to Edit Booking
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
