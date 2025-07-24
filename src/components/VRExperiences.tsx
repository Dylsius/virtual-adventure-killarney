import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Experience {
  id: string;
  name: string;
  games: string;
  gameTime: string;
  recommendedAge: string;
  description: string;
  image: string;
}

const experiences: Experience[] = [
  {
    id: 'car',
    name: 'CAR',
    games: '8 racing games',
    gameTime: '10 mins',
    recommendedAge: '4+',
    description: 'Experience high-speed racing with realistic car simulation games',
    image: 'https://i.imgur.com/yfKXbdQ.jpeg'
  },
  {
    id: 'egg-chair',
    name: 'DOUBLE VR EGG CHAIR',
    games: '200 games (variety of genres)',
    gameTime: '2–10 mins',
    recommendedAge: '4+',
    description: 'Comfortable VR experience with the largest game selection',
    image: 'https://i.imgur.com/9AQGOGB.jpeg'
  },
  {
    id: 'ultimate-crossing',
    name: 'ULTIMATE CROSSING 2',
    games: '20 games',
    gameTime: 'Varies',
    recommendedAge: '4+',
    description: 'Action-packed adventure games with immersive challenges',
    image: 'https://i.imgur.com/hLRfp0j.jpeg'
  },
  {
    id: 'vr-360',
    name: 'VR 360',
    games: '14 games',
    gameTime: '3–5 mins',
    recommendedAge: '12+',
    description: 'Full 360-degree immersive virtual reality experiences',
    image: 'https://i.imgur.com/ibjJ5QG.jpeg'
  }
];

const VRExperiences: React.FC = () => {
  const { t } = useLanguage();

  const experiences: Experience[] = [
    {
      id: 'car',
      name: t('carName'),
      games: t('carGames'),
      gameTime: t('carTime'),
      recommendedAge: t('carAge'),
      description: t('carDescription'),
      image: 'https://i.imgur.com/yfKXbdQ.jpeg'
    },
    {
      id: 'egg-chair',
      name: t('eggChairName'),
      games: t('eggChairGames'),
      gameTime: t('eggChairTime'),
      recommendedAge: t('eggChairAge'),
      description: t('eggChairDescription'),
      image: 'https://i.imgur.com/9AQGOGB.jpeg'
    },
    {
      id: 'ultimate-crossing',
      name: t('ultimateCrossingName'),
      games: t('ultimateCrossingGames'),
      gameTime: t('ultimateCrossingTime'),
      recommendedAge: t('ultimateCrossingAge'),
      description: t('ultimateCrossingDescription'),
      image: 'https://i.imgur.com/hLRfp0j.jpeg'
    },
    {
      id: 'vr-360',
      name: t('vr360Name'),
      games: t('vr360Games'),
      gameTime: t('vr360Time'),
      recommendedAge: t('vr360Age'),
      description: t('vr360Description'),
      image: 'https://i.imgur.com/ibjJ5QG.jpeg'
    },
    {
      id: 'virtual-relaxation',
      name: t('virtualRelaxationName'),
      games: t('virtualRelaxationGames'),
      gameTime: t('virtualRelaxationTime'),
      recommendedAge: t('virtualRelaxationAge'),
      description: t('virtualRelaxationDescription'),
      image: 'https://i.imgur.com/Rb00Acv.jpeg'
    },
    {
      id: 'kind-bear',
      name: t('kindBearName'),
      games: t('kindBearGames'),
      gameTime: t('kindBearTime'),
      recommendedAge: t('kindBearAge'),
      description: t('kindBearDescription'),
      image: 'https://i.imgur.com/IrlcB7b.jpeg'
    }
  ];

  return (
    <section id="experiences" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('vrExperiences')}</h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('vrExperiencesDescription')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((experience) => (
            <div 
              key={experience.id}
              className="relative h-96 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group"
            >
              <div className="absolute inset-0">
                <img 
                  src={experience.image} 
                  alt={experience.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/30 p-6 flex flex-col justify-end">
                <p className="text-sm text-white text-outline-dark-blue mb-3 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{experience.description}</p>
              
                <div className="bg-white/20 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white text-outline-dark-blue" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('games')}</span>
                    <span className="text-white text-outline-dark-blue font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{experience.games}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white text-outline-dark-blue" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('duration')}</span>
                    <span className="text-white text-outline-dark-blue font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{experience.gameTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white text-outline-dark-blue" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('age')}</span>
                    <span className="text-white text-outline-dark-blue font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{experience.recommendedAge}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VRExperiences;