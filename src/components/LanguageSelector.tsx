import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en' as Language, name: t('english'), flag: '🇬🇧' },
    { code: 'uk' as Language, name: t('ukrainian'), flag: '🇺🇦' },
    { code: 'es' as Language, name: t('spanish'), flag: '🇪🇸' },
    { code: 'pl' as Language, name: t('polish'), flag: '🇵🇱' },
    { code: 'fr' as Language, name: t('french'), flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium w-full justify-start"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-lg font-semibold">{currentLanguage?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
          <div className="py-2" role="listbox">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                  language === lang.code ? 'bg-blue-50 text-blue-900' : 'text-blue-700'
                }`}
                role="option"
                aria-selected={language === lang.code}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;