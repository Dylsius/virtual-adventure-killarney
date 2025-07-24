import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Business Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://i.imgur.com/GAjV2PZ.png" 
                alt="Virtual Adventure Killarney Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>VIRTUAL ADVENTURE</h3>
                <p className="text-blue-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>Killarney</p>
              </div>
            </div>
              <a 
                href="tel:+353874838264"
                className="flex items-center space-x-3 text-blue-100 hover:text-white transition-colors group"
              >
                <Phone className="h-5 w-5 text-blue-300 group-hover:text-white" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>+353 (87) 483 8264</span>
              </a>
              
              <a 
                href="mailto:virtualadventurekillarney@gmail.com"
                className="flex items-center space-x-3 text-blue-100 hover:text-white transition-colors group"
              >
                <Mail className="h-5 w-5 text-blue-300 group-hover:text-white" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>virtualadventurekillarney@gmail.com</span>
              </a>
              
              <a 
                href="https://maps.app.goo.gl/P8dNWpGtRWSSChMaA?g_st=ipc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 text-blue-100 hover:text-white transition-colors group"
              >
                <MapPin className="h-5 w-5 text-blue-300 mt-1 flex-shrink-0 group-hover:text-white" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>V93 W0YE</span>
              </a>
            </div>

          </div>

          {/* Social Media */}
          <div>
            <div className="flex space-x-4 mt-8">
              <a 
                href="https://www.instagram.com/virtual_adventure_killarney?igsh=ZWE3MzJ2Z3l4d3Y4"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-3 rounded-full hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6 text-white" />
              </a>
              
              <a 
                href="https://www.facebook.com/share/1BfaxZKqJx/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6 text-white" />
              </a>
            </div>
          </div>
        
        <div className="border-t border-blue-800 mt-12 pt-8 text-center">
          <p className="text-blue-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('footerCopyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;