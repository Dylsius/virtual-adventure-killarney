import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://res.cloudinary.com/darq9ofvp/video/upload/v1752331524/VR-Killarney_cgoz2u.mov" type="video/mp4" />
      </video>
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="https://i.imgur.com/GAjV2PZ.png" 
              alt="Virtual Adventure Killarney Logo" 
              className="h-32 w-auto bg-transparent"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <a 
              href="/booking"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg border-2 border-blue-600 w-48"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('bookNow')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;