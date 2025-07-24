import React, { useState, useEffect } from 'react';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';
import RulesModal from '../components/RulesModal';

const Booking: React.FC = () => {
  const [showRulesModal, setShowRulesModal] = useState(true);

  const handleRulesAgreement = () => {
    setShowRulesModal(false);
  };

  return (
    <>
      <RulesModal 
        isOpen={showRulesModal} 
        onAgree={handleRulesAgreement} 
      />
      
        <BookingForm />
      <Footer />
    </>
  );
};

export default Booking;