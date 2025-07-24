import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsDesktopMenuOpen(false);
      }
    };

    if (isMenuOpen || isDesktopMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isDesktopMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDesktopMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    closeMenu();
    if (location.pathname === '/' && href.startsWith('#')) {
      // If we're on home page and it's an anchor link, scroll to section
      const element = document.querySelector(href);
      if (element) {
        const headerHeight = 80; // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const navItems = [
    { href: '/booking', label: t('bookNow'), isRoute: true },
    { href: '/about', label: t('aboutUs'), isRoute: true },
    { href: '/blog', label: 'Updates', isRoute: true },
    { href: '/videos', label: t('videoGalleryTitle'), isRoute: true },
    { href: '/reviews', label: t('reviewsTitle'), isRoute: true },
    { href: '#language', label: 'Language', isLanguage: true }
  ];

  return (
    <header ref={menuRef} className="bg-white shadow-md sticky top-0 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 gap-x-4">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3 cursor-pointer flex-shrink-0">
            <img 
              src="https://i.imgur.com/GAjV2PZ.png" 
              alt="Virtual Adventure Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-900 whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>VIRTUAL ADVENTURE</h1>
            </div>
          </Link>

          {/* Desktop Menu Button */}
          <div className="hidden md:block">
            <button
              onClick={toggleDesktopMenu}
              className="p-2 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isDesktopMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Dropdown Menu */}
        {isDesktopMenuOpen && (
          <div className="absolute top-full right-16 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
            <nav className="py-2">
              {navItems.map((item) => (
                item.isLanguage ? (
                  <div key={item.href} className="px-4 py-3">
                    <LanguageSelector />
                  </div>
                ) : item.isRoute ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMenu}
                    className="block text-center px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium rounded-lg mx-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="block text-center px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium rounded-lg mx-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-100">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                item.isLanguage ? (
                  <div key={item.href} className="px-4 py-3">
                    <LanguageSelector />
                  </div>
                ) : item.isRoute ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium rounded-lg"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="block px-4 py-3 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium rounded-lg"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;