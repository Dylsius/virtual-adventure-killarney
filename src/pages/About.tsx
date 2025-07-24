import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <section className="py-20 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('aboutTitle')}</h1>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden mb-8 h-64">
              <img 
                src="https://i.imgur.com/29UVJAB.jpeg" 
                alt="Virtual Adventure Background"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6 mb-12">
              <p className="text-lg text-blue-800 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('aboutDescription1')}</p>
              
              <p className="text-lg text-blue-800 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('aboutDescription2')}</p>
              
              <p className="text-lg text-blue-800 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('aboutDescription3')}</p>
            </div>

          {/* Opening Hours Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('openingHours')}</h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-6 text-center">
                  <h3 className="text-xl font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('weeklySchedule')}</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-red-50 text-red-700">
                      <span className="font-semibold text-red-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('monday')}</span>
                      <span className="text-red-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('closed')}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('tuesday')}</span>
                      <span className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>12:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('wednesday')}</span>
                      <span className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>12:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('thursday')}</span>
                      <span className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>12:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('friday')}</span>
                      <span className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>12:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('saturday')}</span>
                      <span className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>12:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('sunday')}</span>
                      <span className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>12:00 – 18:00</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('breakTime')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;