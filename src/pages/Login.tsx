import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthForm from '../components/AuthForm';
import Footer from '../components/Footer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  const handleAuthSuccess = () => {
    navigate('/');
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  return (
    <>
      <section className="py-20 bg-blue-50 min-h-screen mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthForm 
            mode={authMode}
            onSuccess={handleAuthSuccess}
            onToggleMode={toggleAuthMode}
          />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;