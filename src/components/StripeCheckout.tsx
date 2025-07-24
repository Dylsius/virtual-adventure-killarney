import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { stripeProducts } from '../stripe-config';

interface StripeCheckoutProps {
  priceId: string;
  className?: string;
  children?: React.ReactNode;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  priceId, 
  className = '',
  children 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = stripeProducts.find(p => p.priceId === priceId);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please sign in to continue');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/booking`,
          mode: product?.mode || 'payment',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {error}
          </p>
        </div>
      )}
      
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${className} ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {children || (
              <>
                <CreditCard className="h-5 w-5" />
                <span>{product?.name || 'Purchase'}</span>
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default StripeCheckout;