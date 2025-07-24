import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <User className="h-5 w-5" />
        <span>Sign In</span>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:inline">{user.user_metadata?.name || user.email}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
          <div className="p-4 border-b border-blue-100">
            <p className="text-sm font-medium text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {user.user_metadata?.name || 'User'}
            </p>
            <p className="text-xs text-blue-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {user.email}
            </p>
            {subscription && (
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  subscription.subscription_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {subscription.subscription_status === 'active' ? 'Active Plan' : 'No Active Plan'}
                </span>
              </div>
            )}
          </div>
          
          <div className="py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;