import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Hero from '../components/Hero';
import VRExperiences from '../components/VRExperiences';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      <VRExperiences />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('readyForAdventure')}</h2>
            <Link 
              to="/booking"
              className="inline-block bg-blue-600 text-white px-12 py-6 rounded-xl font-bold text-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mt-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Home;