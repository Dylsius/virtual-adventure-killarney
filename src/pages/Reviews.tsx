import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const Reviews: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <section className="py-8 bg-white min-h-screen mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SociableKIT Widget Container */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('customerReviews')}
              </h2>
            </div>
            
            {/* SociableKIT Embed Area */}
            <div id="sociablekit-reviews" className="min-h-[400px] flex items-center justify-center">
              <iframe 
                src='https://widgets.sociablekit.com/google-reviews/iframe/25579735' 
                frameBorder='0' 
                width='100%' 
                height='1000'
                className="rounded-lg"
                title="Google Reviews"
              ></iframe>
            </div>
            
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('shareYourExperience')}
              </h2>
              <p className="text-blue-700 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('reviewCallToAction')}
              </p>
              <a 
                href="/booking"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('bookNow')}
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Reviews;